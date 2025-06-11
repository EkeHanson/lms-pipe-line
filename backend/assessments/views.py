from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Avg
from .models import (
    Assessment, Question, QuestionOption, Rubric,
    AssessmentAttachment, AssessmentSubmission,
    QuestionResponse, RubricRating
)
from .serializers import (
    AssessmentSerializer, QuestionSerializer, RubricSerializer,QuestionOptionSerializer,
    AssessmentAttachmentSerializer, AssessmentSubmissionSerializer
)
from courses.models import Course
from users.models import User

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    #permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            print("serializer.errors")
            print(serializer.errors)
            print("serializer.errors")
            return Response(
                {
                    'status': 'error',
                    'message': 'Validation error',
                    'errors': e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except ValidationError as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'Validation error',
                    'errors': e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        assessment_type = self.request.query_params.get('type')
        if assessment_type:
            queryset = queryset.filter(assessment_type=assessment_type)
        
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            queryset = queryset.filter(
                Q(course__enrollments__user=self.request.user) |
                Q(course__course_instructors__instructor__user=self.request.user)
            ).distinct()
        
        return queryset.select_related('course', 'created_by', 'edited_by').prefetch_related('questions', 'rubrics', 'attachments')
    
    def check_permissions(self, request):
        super().check_permissions(request)
        
        if request.user.is_staff or request.user.role == "admin":
            return
        
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'delete_all_questions', 'delete_all_rubrics']:
            course_id = request.data.get('course')
            if course_id and not Course.objects.filter(
                id=course_id,
                course_instructors__instructor__user=request.user
            ).exists():
                raise PermissionDenied("You don't have permission to modify assessments for this course.")
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(edited_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        assessment = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to publish this assessment.")
        
        if assessment.status == 'draft':
            assessment.status = 'published'
            assessment.edited_by = request.user
            assessment.save()
            return Response({'status': 'assessment published'})
        else:
            raise ValidationError("Only draft assessments can be published.")
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        assessment = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to activate this assessment.")
        
        if assessment.status in ['published', 'inactive']:
            assessment.status = 'active'
            assessment.edited_by = request.user
            assessment.save()
            return Response({'status': 'assessment activated'})
        else:
            raise ValidationError("Only published or inactive assessments can be activated.")
    
    @action(detail=True, methods=['delete'])
    def delete_all_questions(self, request, pk=None):
        assessment = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to delete questions for this assessment.")
        
        assessment.questions.all().delete()
        return Response({'status': 'all questions deleted'})
    
    @action(detail=True, methods=['delete'])
    def delete_all_rubrics(self, request, pk=None):
        assessment = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to delete rubrics for this assessment.")
        
        assessment.rubrics.all().delete()
        return Response({'status': 'all rubrics deleted'})
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        assessment = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to view statistics for this assessment.")
        
        submissions = assessment.submissions.filter(status__in=['submitted', 'late', 'graded'])
        graded_submissions = submissions.filter(status='graded')
        
        data = {
            'total_submissions': submissions.count(),
            'graded_submissions': graded_submissions.count(),
            'average_score': graded_submissions.aggregate(avg_score=Avg('score'))['avg_score'],
            'pass_rate': None,
            'question_stats': []
        }
        
        if data['average_score'] is not None:
            data['pass_rate'] = graded_submissions.filter(
                score__gte=assessment.passing_score
            ).count() / graded_submissions.count() * 100 if graded_submissions.count() > 0 else 0
        
        if assessment.assessment_type == 'quiz':
            for question in assessment.questions.all():
                responses = QuestionResponse.objects.filter(
                    submission__assessment=assessment,
                    question=question
                )
                correct_count = responses.filter(is_correct=True).count()
                total_responses = responses.count()
                
                data['question_stats'].append({
                    'question_id': question.id,
                    'question_text': question.text[:100],
                    'correct_count': correct_count,
                    'total_responses': total_responses,
                    'correct_percentage': correct_count / total_responses * 100 if total_responses > 0 else 0
                })
        
        return Response(data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    # permission_classes = [IsAuthenticated]
    
    # def get_queryset(self):
    #     queryset = super().get_queryset()
        
    #     assessment_id = self.request.query_params.get('assessment_id')
    #     if assessment_id:
    #         queryset = queryset.filter(assessment_id=assessment_id)
        
    #     if not self.request.user.is_staff and not self.request.user.is_superuser:
    #         queryset = queryset.filter(
    #             Q(assessment__course__enrollments__user=self.request.user) |
    #             Q(assessment__course__course_instructors__instructor__user=self.request.user)
    #         ).distinct()
        
    #     return queryset.select_related('assessment', 'created_by', 'edited_by')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Handle nested route
        if 'assessment_pk' in self.kwargs:
            return queryset.filter(assessment_id=self.kwargs['assessment_pk'])
        
        assessment_id = self.request.query_params.get('assessment_id')
        if assessment_id:
            queryset = queryset.filter(assessment_id=assessment_id)

    def check_permissions(self, request):
        super().check_permissions(request)
        
        if request.user.is_staff or request.user.role=="admin":
            return
        
        # if self.action in ['create', 'update', 'partial_update', 'destroy']:
        #     assessment_id = request.data.get('assessment', self.get_object().assessment.id if self.action != 'create' else None)
        #     if assessment_id and not Assessment.objects.filter(
        #         id=assessment_id,
        #         course__course_instructors__instructor__user=request.user
        #     ).exists():
        #         raise PermissionDenied("You don't have permission to modify questions for this assessment.")
    
    def perform_create(self, serializer):
        # For nested route, get assessment from URL
        if 'assessment_pk' in self.kwargs:
            assessment = get_object_or_404(Assessment, pk=self.kwargs['assessment_pk'])
            serializer.save(assessment=assessment, created_by=self.request.user)
        else:
            # For non-nested route, ensure assessment is in validated data
            serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(edited_by=self.request.user)

# views.py
class QuestionOptionViewSet(viewsets.ModelViewSet):
    queryset = QuestionOption.objects.all()
    serializer_class = QuestionOptionSerializer
    
    def get_queryset(self):
        return super().get_queryset().filter(
            question_id=self.kwargs['question_pk'],
            question__assessment_id=self.kwargs['assessment_pk']
        )
    
    def perform_create(self, serializer):
        question = get_object_or_404(
            Question, 
            pk=self.kwargs['question_pk'],
            assessment_id=self.kwargs['assessment_pk']
        )
        serializer.save(question=question)

class RubricViewSet(viewsets.ModelViewSet):
    queryset = Rubric.objects.all()
    serializer_class = RubricSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        assessment_id = self.request.query_params.get('assessment_id')
        if assessment_id:
            queryset = queryset.filter(assessment_id=assessment_id)
        
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            queryset = queryset.filter(
                Q(assessment__course__enrollments__user=self.request.user) |
                Q(assessment__course__course_instructors__instructor__user=self.request.user)
            ).distinct()
        
        return queryset.select_related('assessment', 'created_by', 'edited_by')
    
    def check_permissions(self, request):
        super().check_permissions(request)
        
        if request.user.is_staff or request.user.is_superuser:
            return
        
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            assessment_id = request.data.get('assessment', self.get_object().assessment.id if self.action != 'create' else None)
            if assessment_id and not Assessment.objects.filter(
                id=assessment_id,
                course__course_instructors__instructor__user=request.user
            ).exists():
                raise PermissionDenied("You don't have permission to modify rubrics for this assessment.")
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(edited_by=self.request.user)

class AssessmentAttachmentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = AssessmentAttachment.objects.all()
    serializer_class = AssessmentAttachmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        assessment_id = self.request.query_params.get('assessment_id')
        if assessment_id:
            queryset = queryset.filter(assessment_id=assessment_id)
        
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            queryset = queryset.filter(
                Q(assessment__course__enrollments__user=self.request.user) |
                Q(assessment__course__course_instructors__instructor__user=self.request.user)
            ).distinct()
        
        return queryset.select_related('assessment', 'created_by')
    
    def check_permissions(self, request):
        super().check_permissions(request)
        
        if request.user.is_staff or request.user.is_superuser:
            return
        
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            assessment_id = request.data.get('assessment', self.get_object().assessment.id if self.action != 'create' else None)
            if assessment_id and not Assessment.objects.filter(
                id=assessment_id,
                course__course_instructors__instructor__user=request.user
            ).exists():
                raise PermissionDenied("You don't have permission to modify attachments for this assessment.")
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AssessmentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssessmentSubmission.objects.all()
    serializer_class = AssessmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        assessment_id = self.request.query_params.get('assessment_id')
        if assessment_id:
            queryset = queryset.filter(assessment_id=assessment_id)
        
        user_id = self.request.query_params.get('user_id')
        if user_id and (self.request.user.is_staff or self.request.user.is_superuser or self.is_course_instructor()):
            queryset = queryset.filter(user_id=user_id)
        elif not (self.request.user.is_staff or self.request.user.is_superuser) and not self.is_course_instructor():
            queryset = queryset.filter(user=self.request.user)
        
        return queryset.select_related(
            'assessment', 'user', 'graded_by'
        ).prefetch_related('responses', 'responses__selected_options')
    
    def is_course_instructor(self):
        assessment_id = self.request.query_params.get('assessment_id')
        if assessment_id:
            assessment = get_object_or_404(Assessment, pk=assessment_id)
            return assessment.course.course_instructors.filter(
                instructor__user=self.request.user
            ).exists()
        return False
    
    def check_permissions(self, request):
        super().check_permissions(request)
        
        if request.user.is_staff or request.user.is_superuser:
            return
        
        if self.action == 'create':
            assessment_id = request.data.get('assessment')
            if assessment_id and not Assessment.objects.filter(
                id=assessment_id,
                course__enrollments__user=request.user,
                course__enrollments__is_active=True
            ).exists():
                raise PermissionDenied("You are not enrolled in this course.")
        
        if self.action in ['update', 'partial_update', 'destroy', 'submit', 'grade', 'auto_grade']:
            submission = self.get_object()
            if not (submission.user == request.user or 
                    submission.assessment.course.course_instructors.filter(
                        instructor__user=request.user
                    ).exists()):
                raise PermissionDenied("You don't have permission to access this submission.")
    
    def perform_create(self, serializer):
        assessment = serializer.validated_data['assessment']
        
        if assessment.status != 'active':
            raise ValidationError("You can only submit to active assessments.")
        
        if assessment.due_date < timezone.now():
            raise ValidationError("The due date for this assessment has passed.")
        
        if not assessment.course.enrollments.filter(
            user=self.request.user,
            is_active=True
        ).exists() and not (self.request.user.is_staff or self.request.user.is_superuser):
            raise PermissionDenied("You are not enrolled in this course.")
        
        if assessment.max_attempts > 0:
            previous_attempts = AssessmentSubmission.objects.filter(
                assessment=assessment,
                user=self.request.user
            ).count()
            if previous_attempts >= assessment.max_attempts:
                raise ValidationError(
                    f"You have reached the maximum number of attempts ({assessment.max_attempts}) for this assessment."
                )
        
        request = self.context.get('request')
        ip_address = request.META.get('REMOTE_ADDR') if request else None
        user_agent = request.META.get('HTTP_USER_AGENT', '') if request else ''
        
        serializer.save(
            user=self.request.user,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        submission = self.get_object()
        
        if not (submission.user == request.user or 
                request.user.is_staff or 
                request.user.is_superuser or
                submission.assessment.course.course_instructors.filter(
                    instructor__user=request.user
                ).exists()):
            raise PermissionDenied("You don't have permission to submit this assessment.")
        
        if submission.status != 'draft':
            raise ValidationError("This assessment has already been submitted.")
        
        responses = submission.responses.all()
        if not responses.exists():
            raise ValidationError("Cannot submit an assessment with no responses.")
        
        submission.status = 'late' if submission.assessment.due_date < timezone.now() else 'submitted'
        submission.submitted_at = timezone.now()
        submission.save()
        
        return Response({'status': 'assessment submitted'})
    
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        submission = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not submission.assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to grade this submission.")
        
        if submission.status not in ['submitted', 'late']:
            raise ValidationError("Only submitted assessments can be graded.")
        
        score = request.data.get('score')
        feedback = request.data.get('feedback', '')
        
        if score is None:
            raise ValidationError("Score is required for grading.")
        
        try:
            score = float(score)
        except (TypeError, ValueError):
            raise ValidationError("Score must be a number.")
        
        submission.score = score
        submission.feedback = feedback
        submission.status = 'graded'
        submission.graded_at = timezone.now()
        submission.graded_by = request.user
        submission.save()
        
        return Response({'status': 'submission graded'})
    
    @action(detail=True, methods=['post'])
    def auto_grade(self, request, pk=None):
        submission = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser) and not submission.assessment.course.course_instructors.filter(
            instructor__user=request.user
        ).exists():
            raise PermissionDenied("You don't have permission to grade this submission.")
        
        if submission.assessment.assessment_type != 'quiz':
            raise ValidationError("Auto-grading is only available for quizzes.")
        
        if submission.status not in ['submitted', 'late']:
            raise ValidationError("Only submitted assessments can be graded.")
        
        total_score = 0
        max_score = 0
        
        for response in submission.responses.all():
            question = response.question
            max_score += question.points
            
            if question.question_type == 'mcq':
                correct_options = question.options.filter(is_correct=True)
                selected_correct = response.selected_options.filter(is_correct=True).count()
                
                if (response.selected_options.count() == correct_options.count() and 
                    selected_correct == correct_options.count()):
                    response.is_correct = True
                    response.score = question.points
                    total_score += question.points
                else:
                    response.is_correct = False
                    response.score = 0
            elif question.question_type == 'true_false':
                correct_option = question.options.filter(is_correct=True).first()
                selected_option = response.selected_options.first()
                
                if correct_option and selected_option and correct_option.id == selected_option.id:
                    response.is_correct = True
                    response.score = question.points
                    total_score += question.points
                else:
                    response.is_correct = False
                    response.score = 0
            
            response.save()
        
        percentage_score = (total_score / max_score * 100) if max_score > 0 else 0
        
        submission.score = percentage_score
        submission.status = 'graded'
        submission.graded_at = timezone.now()
        submission.graded_by = request.user
        submission.save()
        
        return Response({
            'status': 'submission auto-graded',
            'score': percentage_score,
            'is_passed': percentage_score >= submission.assessment.passing_score
        })