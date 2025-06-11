from rest_framework import serializers
from .models import (
    Qualification, Assessor, IQA, EQA, Learner, 
    Assessment, IQASample, IQASamplingPlan, EQAVisit, EQASample
)

class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = '__all__'

class AssessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessor
        fields = '__all__'

class IQASerializer(serializers.ModelSerializer):
    class Meta:
        model = IQA
        fields = '__all__'

class EQASerializer(serializers.ModelSerializer):
    class Meta:
        model = EQA
        fields = '__all__'

class LearnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learner
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    learner_name = serializers.CharField(source='learner.user.get_full_name', read_only=True)
    assessor_name = serializers.CharField(source='assessor.user.get_full_name', read_only=True)
    qualification_name = serializers.CharField(source='qualification.name', read_only=True)

    class Meta:
        model = Assessment
        fields = '__all__'
        read_only_fields = ('assessor',)

class IQASampleSerializer(serializers.ModelSerializer):
    assessment_details = AssessmentSerializer(source='assessment', read_only=True)
    iqa_name = serializers.CharField(source='iqa.user.get_full_name', read_only=True)

    class Meta:
        model = IQASample
        fields = '__all__'
        read_only_fields = ('iqa', 'sample_date')

class IQASamplingPlanSerializer(serializers.ModelSerializer):
    qualification_name = serializers.CharField(source='qualification.name', read_only=True)
    iqa_name = serializers.CharField(source='iqa.user.get_full_name', read_only=True)

    class Meta:
        model = IQASamplingPlan
        fields = '__all__'
        read_only_fields = ('iqa',)

class EQAVisitSerializer(serializers.ModelSerializer):
    eqa_name = serializers.CharField(source='eqa.user.get_full_name', read_only=True)
    visit_type_display = serializers.CharField(source='get_visit_type_display', read_only=True)

    class Meta:
        model = EQAVisit
        fields = '__all__'
        read_only_fields = ('eqa',)

class EQASampleSerializer(serializers.ModelSerializer):
    visit_details = EQAVisitSerializer(source='visit', read_only=True)
    assessment_details = AssessmentSerializer(source='assessment', read_only=True)
    iqa_sample_details = IQASampleSerializer(source='iqa_sample', read_only=True)
    outcome_display = serializers.CharField(source='get_outcome_display', read_only=True)

    class Meta:
        model = EQASample
        fields = '__all__'