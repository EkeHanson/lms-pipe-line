# quality/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'qualifications', views.QualificationViewSet)
router.register(r'assessors', views.AssessorViewSet)
router.register(r'iqas', views.IQAViewSet)
router.register(r'eqas', views.EQAViewSet)
router.register(r'learners', views.LearnerViewSet)
router.register(r'assessments', views.AssessmentViewSet)
router.register(r'iqasamples', views.IQASampleViewSet)
router.register(r'iqasamplingplans', views.IQASamplingPlanViewSet)
router.register(r'eqavisits', views.EQAVisitViewSet)
router.register(r'eqasamples', views.EQASampleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
]