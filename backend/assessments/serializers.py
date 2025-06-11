# from courses.models import Course
# from rest_framework import serializers
# from .models import (
#     Assessment, Question, QuestionOption, Rubric,
#     AssessmentAttachment, AssessmentSubmission,
#     QuestionResponse, RubricRating
# )
# from courses.serializers import CourseSerializer
# from users.serializers import UserSerializer

# class QuestionOptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = QuestionOption
#         fields = ['id', 'text', 'is_correct', 'order']

# class RubricSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Rubric
#         fields = ['id', 'criterion', 'description', 'weight', 'order']

# class QuestionSerializer(serializers.ModelSerializer):
#     options = QuestionOptionSerializer(many=True, required=False)
    
#     class Meta:
#         model = Question
#         fields = [
#             'id', 'question_type', 'text', 'points', 'order', 
#             'explanation', 'options', 'created_at', 'updated_at'
#         ]

# class AssessmentAttachmentSerializer(serializers.ModelSerializer):
#     file_url = serializers.SerializerMethodField()
    
#     class Meta:
#         model = AssessmentAttachment
#         fields = ['id', 'name', 'description', 'file', 'file_url', 'created_at']
#         read_only_fields = ['file_url', 'created_at']
    
#     def get_file_url(self, obj):
#         return obj.file.url if obj.file else None

# class AssessmentSerializer(serializers.ModelSerializer):
#     questions = QuestionSerializer(many=True, required=False)
#     rubrics = RubricSerializer(many=True, required=False)
#     attachments = AssessmentAttachmentSerializer(many=True, required=False, read_only=True)
#     course = CourseSerializer(read_only=True)
#     course_id = serializers.PrimaryKeyRelatedField(
#         queryset=Course.objects.all(),
#         source='course',
#         write_only=True
#     )
#     created_by = UserSerializer(read_only=True)
#     edited_by = UserSerializer(read_only=True)
#     status_display = serializers.CharField(source='get_status_display', read_only=True)
#     assessment_type_display = serializers.CharField(
#         source='get_assessment_type_display', 
#         read_only=True
#     )
#     is_active = serializers.BooleanField(read_only=True)
    
#     class Meta:
#         model = Assessment
#         fields = [
#             'id', 'title', 'course', 'course_id', 'assessment_type', 
#             'assessment_type_display', 'description', 'due_date', 
#             'time_limit', 'status', 'status_display', 'instructions',
#             'passing_score', 'max_attempts', 'shuffle_questions',
#             'show_correct_answers', 'questions', 'rubrics', 'attachments',
#             'created_at', 'updated_at', 'created_by', 'edited_by',
#             'is_active'
#         ]
    
#     def create(self, validated_data):
#         questions_data = validated_data.pop('questions', [])
#         rubrics_data = validated_data.pop('rubrics', [])
#         validated_data['created_by'] = self.context['request'].user
        
#         assessment = Assessment.objects.create(**validated_data)
        
#         for question_data in questions_data:
#             options_data = question_data.pop('options', [])
#             question = Question.objects.create(
#                 assessment=assessment, 
#                 created_by=self.context['request'].user,
#                 **question_data
#             )
#             for option_data in options_data:
#                 QuestionOption.objects.create(question=question, **option_data)
        
#         for rubric_data in rubrics_data:
#             Rubric.objects.create(
#                 assessment=assessment,
#                 created_by=self.context['request'].user,
#                 **rubric_data
#             )
        
#         return assessment
    
#     def update(self, instance, validated_data):
#         questions_data = validated_data.pop('questions', None)
#         rubrics_data = validated_data.pop('rubrics', None)
#         validated_data['edited_by'] = self.context['request'].user
        
#         instance = super().update(instance, validated_data)
        
#         if questions_data is not None:
#             # Update or create questions
#             question_ids = []
#             for question_data in questions_data:
#                 options_data = question_data.pop('options', [])
#                 question_id = question_data.pop('id', None)
                
#                 if question_id and Question.objects.filter(id=question_id, assessment=instance).exists():
#                     question = Question.objects.get(id=question_id)
#                     for attr, value in question_data.items():
#                         setattr(question, attr, value)
#                     question.edited_by = self.context['request'].user
#                     question.save()
                    
#                     # Update or create options
#                     option_ids = []
#                     for option_data in options_data:
#                         option_id = option_data.pop('id', None)
#                         if option_id and QuestionOption.objects.filter(id=option_id, question=question).exists():
#                             option = QuestionOption.objects.get(id=option_id)
#                             for attr, value in option_data.items():
#                                 setattr(option, attr, value)
#                             option.save()
#                         else:
#                             option = QuestionOption.objects.create(question=question, **option_data)
#                         option_ids.append(option.id)
                    
#                     # Delete removed options
#                     QuestionOption.objects.filter(question=question).exclude(id__in=option_ids).delete()
#                 else:
#                     question = Question.objects.create(
#                         assessment=instance, 
#                         created_by=self.context['request'].user,
#                         **question_data
#                     )
#                     for option_data in options_data:
#                         QuestionOption.objects.create(question=question, **option_data)
                
#                 question_ids.append(question.id)
            
#             # Delete removed questions
#             Question.objects.filter(assessment=instance).exclude(id__in=question_ids).delete()
        
#         if rubrics_data is not None:
#             # Update or create rubrics
#             rubric_ids = []
#             for rubric_data in rubrics_data:
#                 rubric_id = rubric_data.pop('id', None)
#                 if rubric_id and Rubric.objects.filter(id=rubric_id, assessment=instance).exists():
#                     rubric = Rubric.objects.get(id=rubric_id)
#                     for attr, value in rubric_data.items():
#                         setattr(rubric, attr, value)
#                     rubric.edited_by = self.context['request'].user
#                     rubric.save()
#                 else:
#                     rubric = Rubric.objects.create(
#                         assessment=instance,
#                         created_by=self.context['request'].user,
#                         **rubric_data
#                     )
#                 rubric_ids.append(rubric.id)
            
#             # Delete removed rubrics
#             Rubric.objects.filter(assessment=instance).exclude(id__in=rubric_ids).delete()
        
#         return instance

# class RubricRatingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RubricRating
#         fields = ['id', 'rubric', 'rating', 'feedback', 'created_at', 'updated_at']

# class QuestionResponseSerializer(serializers.ModelSerializer):
#     selected_options = QuestionOptionSerializer(many=True, read_only=True)
#     selected_option_ids = serializers.PrimaryKeyRelatedField(
#         many=True,
#         queryset=QuestionOption.objects.all(),
#         source='selected_options',
#         write_only=True,
#         required=False
#     )
#     rubric_ratings = RubricRatingSerializer(many=True, required=False)
    
#     class Meta:
#         model = QuestionResponse
#         fields = [
#             'id', 'question', 'text_response', 'selected_options',
#             'selected_option_ids', 'score', 'feedback', 'is_correct',
#             'rubric_ratings', 'created_at', 'updated_at'
#         ]

# class AssessmentSubmissionSerializer(serializers.ModelSerializer):
#     responses = QuestionResponseSerializer(many=True, required=False)
#     user = UserSerializer(read_only=True)
#     graded_by = UserSerializer(read_only=True)
#     status_display = serializers.CharField(source='get_status_display', read_only=True)
#     is_passed = serializers.BooleanField(read_only=True)
#     is_late = serializers.BooleanField(read_only=True)
    
#     class Meta:
#         model = AssessmentSubmission
#         fields = [
#             'id', 'assessment', 'user', 'attempt_number', 'status',
#             'status_display', 'score', 'feedback', 'submitted_at',
#             'graded_at', 'graded_by', 'ip_address', 'user_agent',
#             'responses', 'is_passed', 'is_late', 'created_at', 'updated_at'
#         ]
#         read_only_fields = [
#             'attempt_number', 'submitted_at', 'graded_at', 
#             'graded_by', 'ip_address', 'user_agent', 'created_at',
#             'updated_at'
#         ]
    
#     def create(self, validated_data):
#         responses_data = validated_data.pop('responses', [])
#         assessment = validated_data['assessment']
#         user = self.context['request'].user
        
#         # Calculate attempt number
#         previous_attempts = AssessmentSubmission.objects.filter(
#             assessment=assessment,
#             user=user
#         ).count()
#         validated_data['attempt_number'] = previous_attempts + 1
        
#         # Set IP and user agent
#         request = self.context.get('request')
#         if request:
#             validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
#             validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
#         submission = AssessmentSubmission.objects.create(**validated_data)
        
#         for response_data in responses_data:
#             selected_options = response_data.pop('selected_options', [])
#             rubric_ratings_data = response_data.pop('rubric_ratings', [])
            
#             response = QuestionResponse.objects.create(
#                 submission=submission,
#                 **response_data
#             )
            
#             for option in selected_options:
#                 response.selected_options.add(option)
            
#             for rating_data in rubric_ratings_data:
#                 RubricRating.objects.create(
#                     response=response,
#                     **rating_data
#                 )
        
#         return submission
    
#     def update(self, instance, validated_data):
#         responses_data = validated_data.pop('responses', None)
        
#         instance = super().update(instance, validated_data)
        
#         if responses_data is not None:
#             # Update or create responses
#             response_ids = []
#             for response_data in responses_data:
#                 selected_options = response_data.pop('selected_options', [])
#                 rubric_ratings_data = response_data.pop('rubric_ratings', [])
#                 response_id = response_data.pop('id', None)
                
#                 if response_id and QuestionResponse.objects.filter(id=response_id, submission=instance).exists():
#                     response = QuestionResponse.objects.get(id=response_id)
#                     for attr, value in response_data.items():
#                         setattr(response, attr, value)
#                     response.save()
                    
#                     # Update selected options
#                     response.selected_options.clear()
#                     for option in selected_options:
#                         response.selected_options.add(option)
                    
#                     # Update or create rubric ratings
#                     rating_ids = []
#                     for rating_data in rubric_ratings_data:
#                         rating_id = rating_data.pop('id', None)
#                         if rating_id and RubricRating.objects.filter(id=rating_id, response=response).exists():
#                             rating = RubricRating.objects.get(id=rating_id)
#                             for attr, value in rating_data.items():
#                                 setattr(rating, attr, value)
#                             rating.save()
#                         else:
#                             rating = RubricRating.objects.create(
#                                 response=response,
#                                 **rating_data
#                             )
#                         rating_ids.append(rating.id)
                    
#                     # Delete removed ratings
#                     RubricRating.objects.filter(response=response).exclude(id__in=rating_ids).delete()
#                 else:
#                     response = QuestionResponse.objects.create(
#                         submission=instance,
#                         **response_data
#                     )
#                     for option in selected_options:
#                         response.selected_options.add(option)
#                     for rating_data in rubric_ratings_data:
#                         RubricRating.objects.create(
#                             response=response,
#                             **rating_data
#                         )
                
#                 response_ids.append(response.id)
            
#             # Delete removed responses
#             QuestionResponse.objects.filter(submission=instance).exclude(id__in=response_ids).delete()
        
#         return instance
from courses.models import Course
from rest_framework import serializers
from .models import (
    Assessment, Question, QuestionOption, Rubric,
    AssessmentAttachment, AssessmentSubmission,
    QuestionResponse, RubricRating
)
from courses.serializers import CourseSerializer
from users.serializers import UserSerializer

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'text', 'is_correct', 'order']

class RubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rubric
        fields = ['id', 'criterion', 'description', 'weight', 'order']

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, required=False)
    assessment = serializers.PrimaryKeyRelatedField(queryset=Assessment.objects.all())
    
    class Meta:
        model = Question
        fields = ['id', 'assessment', 'question_type', 'text', 'points', 'order', 
            'explanation', 'options', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)
        
        for option_data in options_data:
            QuestionOption.objects.create(question=question, **option_data)
            
        return question
    
    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        
        # Update question fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if options_data is not None:
            # Clear existing options and create new ones
            instance.options.all().delete()
            for option_data in options_data:
                QuestionOption.objects.create(question=instance, **option_data)
                
        return instance
    
    def validate(self, data):
        if 'assessment' not in data and 'assessment_pk' not in self.context.get('kwargs', {}):
            raise serializers.ValidationError("Assessment is required")
        return data

class AssessmentAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AssessmentAttachment
        fields = ['id', 'name', 'description', 'file', 'file_url', 'created_at']
        read_only_fields = ['file_url', 'created_at']
    
    def get_file_url(self, obj):
        return obj.file.url if obj.file else None

class AssessmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    rubrics = RubricSerializer(many=True, required=False)
    attachments = AssessmentAttachmentSerializer(many=True, required=False, read_only=True)
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )
    created_by = UserSerializer(read_only=True)
    edited_by = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assessment_type_display = serializers.CharField(
        source='get_assessment_type_display', 
        read_only=True
    )
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Assessment
        fields = [
            'id', 'title', 'course', 'course_id', 'assessment_type', 
            'assessment_type_display', 'description', 'due_date', 
            'time_limit', 'status', 'status_display', 'instructions',
            'passing_score', 'max_attempts', 'shuffle_questions',
            'show_correct_answers', 'questions', 'rubrics', 'attachments',
            'created_at', 'updated_at', 'created_by', 'edited_by',
            'is_active'
        ]
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        rubrics_data = validated_data.pop('rubrics', [])
        validated_data['created_by'] = self.context['request'].user
        
        assessment = Assessment.objects.create(**validated_data)
        
        for index, question_data in enumerate(questions_data):
            options_data = question_data.pop('options', [])
            question_data['order'] = index
            question = Question.objects.create(
                assessment=assessment, 
                created_by=self.context['request'].user,
                **question_data
            )
            for opt_index, option_data in enumerate(options_data):
                option_data['order'] = opt_index
                QuestionOption.objects.create(question=question, **option_data)
        
        for index, rubric_data in enumerate(rubrics_data):
            rubric_data['order'] = index
            Rubric.objects.create(
                assessment=assessment,
                created_by=self.context['request'].user,
                **rubric_data
            )
        
        return assessment
    
    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', None)
        rubrics_data = validated_data.pop('rubrics', None)
        validated_data['edited_by'] = self.context['request'].user
        
        instance = super().update(instance, validated_data)
        
        if questions_data is not None:
            instance.questions.all().delete()
            for index, question_data in enumerate(questions_data):
                options_data = question_data.pop('options', [])
                question_data['order'] = index
                question = Question.objects.create(
                    assessment=instance, 
                    created_by=self.context['request'].user,
                    **question_data
                )
                for opt_index, option_data in enumerate(options_data):
                    option_data['order'] = opt_index
                    QuestionOption.objects.create(question=question, **option_data)
        
        if rubrics_data is not None:
            instance.rubrics.all().delete()
            for index, rubric_data in enumerate(rubrics_data):
                rubric_data['order'] = index
                Rubric.objects.create(
                    assessment=instance,
                    created_by=self.context['request'].user,
                    **rubric_data
                )
        
        return instance

class RubricRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubricRating
        fields = ['id', 'rubric', 'rating', 'feedback', 'created_at', 'updated_at']

class QuestionResponseSerializer(serializers.ModelSerializer):
    selected_options = QuestionOptionSerializer(many=True, read_only=True)
    selected_option_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=QuestionOption.objects.all(),
        source='selected_options',
        write_only=True,
        required=False
    )
    rubric_ratings = RubricRatingSerializer(many=True, required=False)
    
    class Meta:
        model = QuestionResponse
        fields = [
            'id', 'question', 'text_response', 'selected_options',
            'selected_option_ids', 'score', 'feedback', 'is_correct',
            'rubric_ratings', 'created_at', 'updated_at'
        ]

class AssessmentSubmissionSerializer(serializers.ModelSerializer):
    responses = QuestionResponseSerializer(many=True, required=False)
    user = UserSerializer(read_only=True)
    graded_by = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_passed = serializers.BooleanField(read_only=True)
    is_late = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = AssessmentSubmission
        fields = [
            'id', 'assessment', 'user', 'attempt_number', 'status',
            'status_display', 'score', 'feedback', 'submitted_at',
            'graded_at', 'graded_by', 'ip_address', 'user_agent',
            'responses', 'is_passed', 'is_late', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'attempt_number', 'submitted_at', 'graded_at', 
            'graded_by', 'ip_address', 'user_agent', 'created_at',
            'updated_at'
        ]
    
    def create(self, validated_data):
        responses_data = validated_data.pop('responses', [])
        assessment = validated_data['assessment']
        user = self.context['request'].user
        
        previous_attempts = AssessmentSubmission.objects.filter(
            assessment=assessment,
            user=user
        ).count()
        validated_data['attempt_number'] = previous_attempts + 1
        
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        submission = AssessmentSubmission.objects.create(**validated_data)
        
        for response_data in responses_data:
            selected_options = response_data.pop('selected_options', [])
            rubric_ratings_data = response_data.pop('rubric_ratings', [])
            
            response = QuestionResponse.objects.create(
                submission=submission,
                **response_data
            )
            
            for option in selected_options:
                response.selected_options.add(option)
            
            for rating_data in rubric_ratings_data:
                RubricRating.objects.create(
                    response=response,
                    **rating_data
                )
        
        return submission
    
    def update(self, instance, validated_data):
        responses_data = validated_data.pop('responses', None)
        
        instance = super().update(instance, validated_data)
        
        if responses_data is not None:
            response_ids = []
            for response_data in responses_data:
                selected_options = response_data.pop('selected_options', [])
                rubric_ratings_data = response_data.pop('rubric_ratings', [])
                response_id = response_data.pop('id', None)
                
                if response_id and QuestionResponse.objects.filter(id=response_id, submission=instance).exists():
                    response = QuestionResponse.objects.get(id=response_id)
                    for attr, value in response_data.items():
                        setattr(response, attr, value)
                    response.save()
                    
                    response.selected_options.clear()
                    for option in selected_options:
                        response.selected_options.add(option)
                    
                    rating_ids = []
                    for rating_data in rubric_ratings_data:
                        rating_id = rating_data.pop('id', None)
                        if rating_id and RubricRating.objects.filter(id=rating_id, response=response).exists():
                            rating = RubricRating.objects.get(id=rating_id)
                            for attr, value in rating_data.items():
                                setattr(rating, attr, value)
                            rating.save()
                        else:
                            rating = RubricRating.objects.create(
                                response=response,
                                **rating_data
                            )
                        rating_ids.append(rating.id)
                    
                    RubricRating.objects.filter(response=response).exclude(id__in=rating_ids).delete()
                else:
                    response = QuestionResponse.objects.create(
                        submission=instance,
                        **response_data
                    )
                    for option in selected_options:
                        response.selected_options.add(option)
                    for rating_data in rubric_ratings_data:
                        RubricRating.objects.create(
                            response=response,
                            **rating_data
                        )
                
                response_ids.append(response.id)
            
            QuestionResponse.objects.filter(submission=instance).exclude(id__in=response_ids).delete()
        
        return instance