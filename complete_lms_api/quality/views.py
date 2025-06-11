from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .models import (
    Qualification, Assessor, IQA, EQA, Learner, 
    Assessment, IQASample, IQASamplingPlan, EQAVisit, EQASample
)
from .serializers import (
    QualificationSerializer, AssessorSerializer, IQASerializer, EQASerializer,
    LearnerSerializer, AssessmentSerializer, IQASampleSerializer,
    IQASamplingPlanSerializer, EQAVisitSerializer, EQASampleSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from .filters import AssessmentFilter, IQASampleFilter
from .permissions import IsIQA, IsEQA, IsAssessor, IsLearnerOrAssessor

class QualificationViewSet(viewsets.ModelViewSet):
    queryset = Qualification.objects.all()
    serializer_class = QualificationSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssessorViewSet(viewsets.ModelViewSet):
    queryset = Assessor.objects.all()
    serializer_class = AssessorSerializer
    permission_classes = [permissions.IsAdminUser]

class IQAViewSet(viewsets.ModelViewSet):
    queryset = IQA.objects.all()
    serializer_class = IQASerializer
    permission_classes = [permissions.IsAdminUser]

class EQAViewSet(viewsets.ModelViewSet):
    queryset = EQA.objects.all()
    serializer_class = EQASerializer
    permission_classes = [permissions.IsAdminUser]

class LearnerViewSet(viewsets.ModelViewSet):
    queryset = Learner.objects.all()
    serializer_class = LearnerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['qualifications', 'assessor']

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.none()  # Default empty queryset
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsLearnerOrAssessor]
    filter_backends = [DjangoFilterBackend]
    filterset_class = AssessmentFilter

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='IQA').exists():
            return Assessment.objects.all()
        elif user.groups.filter(name='EQA').exists():
            return Assessment.objects.all()
        elif user.groups.filter(name='Assessor').exists():
            assessor = Assessor.objects.get(user=user)
            return Assessment.objects.filter(assessor=assessor)
        elif user.groups.filter(name='Learner').exists():
            learner = Learner.objects.get(user=user)
            return Assessment.objects.filter(learner=learner)
        return self.queryset

class IQASampleViewSet(viewsets.ModelViewSet):
    queryset = IQASample.objects.none()  # Default empty queryset
    serializer_class = IQASampleSerializer
    permission_classes = [permissions.IsAuthenticated, IsIQA]
    filter_backends = [DjangoFilterBackend]
    filterset_class = IQASampleFilter

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='IQA').exists():
            iqa = IQA.objects.get(user=user)
            return IQASample.objects.filter(iqa=iqa)
        elif user.groups.filter(name='EQA').exists():
            return IQASample.objects.all()
        return self.queryset

    def perform_create(self, serializer):
        if self.request.user.groups.filter(name='IQA').exists():
            iqa = IQA.objects.get(user=self.request.user)
            serializer.save(iqa=iqa)
        else:
            raise permissions.exceptions.PermissionDenied()

class IQASamplingPlanViewSet(viewsets.ModelViewSet):
    queryset = IQASamplingPlan.objects.all()
    serializer_class = IQASamplingPlanSerializer
    permission_classes = [permissions.IsAuthenticated, IsIQA]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='IQA').exists():
            iqa = IQA.objects.get(user=user)
            return IQASamplingPlan.objects.filter(iqa=iqa)
        return self.queryset

    def perform_create(self, serializer):
        if self.request.user.groups.filter(name='IQA').exists():
            iqa = IQA.objects.get(user=self.request.user)
            serializer.save(iqa=iqa)
        else:
            raise permissions.exceptions.PermissionDenied()

class EQAVisitViewSet(viewsets.ModelViewSet):
    queryset = EQAVisit.objects.none()  # Default empty queryset
    serializer_class = EQAVisitSerializer
    permission_classes = [permissions.IsAuthenticated, IsEQA]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='EQA').exists():
            eqa = EQA.objects.get(user=user)
            return EQAVisit.objects.filter(eqa=eqa)
        return self.queryset

    def perform_create(self, serializer):
        if self.request.user.groups.filter(name='EQA').exists():
            eqa = EQA.objects.get(user=self.request.user)
            serializer.save(eqa=eqa)
        else:
            raise permissions.exceptions.PermissionDenied()

class EQASampleViewSet(viewsets.ModelViewSet):
    queryset = EQASample.objects.none()  # Default empty queryset
    serializer_class = EQASampleSerializer
    permission_classes = [permissions.IsAuthenticated, IsEQA]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='EQA').exists():
            eqa = EQA.objects.get(user=user)
            return EQASample.objects.filter(visit__eqa=eqa)
        return self.queryset

    def perform_create(self, serializer):
        if self.request.user.groups.filter(name='EQA').exists():
            visit_id = self.request.data.get('visit')
            visit = EQAVisit.objects.get(id=visit_id)
            if visit.eqa.user == self.request.user:
                serializer.save()
            else:
                raise permissions.exceptions.PermissionDenied()
        else:
            raise permissions.exceptions.PermissionDenied()

class DashboardView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {}

        if user.groups.filter(name='IQA').exists():
            iqa = IQA.objects.get(user=user)
            samples_due = IQASample.objects.filter(iqa=iqa, decision='P').count()
            plans = IQASamplingPlan.objects.filter(iqa=iqa).count()
            data.update({
                'samples_due': samples_due,
                'sampling_plans': plans
            })
        elif user.groups.filter(name='EQA').exists():
            eqa = EQA.objects.get(user=user)
            upcoming_visits = EQAVisit.objects.filter(eqa=eqa, completed=False).count()
            data.update({
                'upcoming_visits': upcoming_visits
            })

        return Response(data)