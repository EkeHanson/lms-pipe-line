
from django.urls import path, include
from rest_framework_nested import routers

from rest_framework.routers import DefaultRouter
from .views import (
    AssessmentViewSet, QuestionViewSet, RubricViewSet,QuestionOptionViewSet,
    AssessmentAttachmentViewSet, AssessmentSubmissionViewSet
)

router = DefaultRouter()
router.register(r'assessments', AssessmentViewSet, basename='assessment')

# Nested routers for questions and attachments
assessments_router = routers.NestedSimpleRouter(router, r'assessments', lookup='assessment')
assessments_router.register(r'questions', QuestionViewSet, basename='assessment-questions')
assessments_router.register(r'attachments', AssessmentAttachmentViewSet, basename='assessment-attachments')
assessments_router.register(r'submissions', AssessmentSubmissionViewSet, basename='assessment-submissions')
assessments_router.register(r'questions/(?P<question_pk>[^/.]+)/options', QuestionOptionViewSet, basename='question-options')

# Regular routes
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'rubrics', RubricViewSet, basename='rubric')
router.register(r'attachments', AssessmentAttachmentViewSet, basename='attachment')
router.register(r'submissions', AssessmentSubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(assessments_router.urls)),
]