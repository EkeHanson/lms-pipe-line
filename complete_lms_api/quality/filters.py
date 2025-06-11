import django_filters
from .models import Assessment, IQASample

class AssessmentFilter(django_filters.FilterSet):
    learner = django_filters.CharFilter(field_name='learner__user__last_name', lookup_expr='icontains')
    qualification = django_filters.NumberFilter(field_name='qualification__id')
    outcome = django_filters.ChoiceFilter(choices=Assessment.outcome_choices)
    submitted_after = django_filters.DateFilter(field_name='submission_date', lookup_expr='gte')
    submitted_before = django_filters.DateFilter(field_name='submission_date', lookup_expr='lte')

    class Meta:
        model = Assessment
        fields = ['learner', 'qualification', 'outcome', 'unit_code']

class IQASampleFilter(django_filters.FilterSet):
    assessment = django_filters.NumberFilter(field_name='assessment__id')
    decision = django_filters.ChoiceFilter(choices=IQASample.decision_choices)
    sampled_after = django_filters.DateFilter(field_name='sample_date', lookup_expr='gte')
    sampled_before = django_filters.DateFilter(field_name='sample_date', lookup_expr='lte')

    class Meta:
        model = IQASample
        fields = ['assessment', 'decision']