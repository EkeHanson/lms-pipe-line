# assessments/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from courses.models import Course
import uuid

def assessment_file_path(instance, filename):
    return f'assessments/{instance.course.slug}/{filename}'

class Assessment(models.Model):
    ASSESSMENT_TYPE_CHOICES = [
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
        ('peer_assessment', 'Peer Assessment'),
        ('certification_exam', 'Certification Exam'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    title = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assessments')
    assessment_type = models.CharField(max_length=20, choices=ASSESSMENT_TYPE_CHOICES)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    time_limit = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Time limit in minutes (optional)"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    instructions = models.TextField(blank=True)
    passing_score = models.PositiveIntegerField(
        default=70,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Minimum score required to pass (percentage)"
    )
    max_attempts = models.PositiveIntegerField(
        default=1,
        help_text="Maximum number of attempts allowed (0 for unlimited)"
    )
    shuffle_questions = models.BooleanField(default=False)
    show_correct_answers = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_assessments'
    )
    edited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='edited_assessments'
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['course', 'status']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_assessment_type_display()})"

    @property
    def is_active(self):
        return self.status == 'active' and self.due_date > timezone.now()

class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('mcq', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
        ('matching', 'Matching'),
        ('fill_blank', 'Fill in the Blank'),
    ]
    
    assessment = models.ForeignKey(
        Assessment, 
        on_delete=models.CASCADE, 
        related_name='questions'
    )
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)
    text = models.TextField()
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)
    explanation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_questions'
    )
    edited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='edited_questions'
    )

    class Meta:
        ordering = ['order']
        unique_together = ['assessment', 'order']

    def __str__(self):
        return f"{self.text[:50]}... ({self.get_question_type_display()})"

class QuestionOption(models.Model):
    question = models.ForeignKey(
        Question, 
        on_delete=models.CASCADE, 
        related_name='options'
    )
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.text[:50]}... ({'Correct' if self.is_correct else 'Incorrect'})"

class Rubric(models.Model):
    assessment = models.ForeignKey(
        Assessment, 
        on_delete=models.CASCADE, 
        related_name='rubrics'
    )
    criterion = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    weight = models.PositiveIntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Weight as percentage"
    )
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_rubrics'
    )
    edited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='edited_rubrics'
    )

    class Meta:
        ordering = ['order']
        unique_together = ['assessment', 'order']

    def __str__(self):
        return f"{self.criterion} ({self.weight}%)"

class AssessmentAttachment(models.Model):
    assessment = models.ForeignKey(
        Assessment, 
        on_delete=models.CASCADE, 
        related_name='attachments'
    )
    file = models.FileField(upload_to=assessment_file_path)
    name = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_attachments'
    )

    def __str__(self):
        return self.name or self.file.name.split('/')[-1]

class AssessmentSubmission(models.Model):
    SUBMISSION_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('late', 'Submitted Late'),
        ('graded', 'Graded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(
        Assessment, 
        on_delete=models.CASCADE, 
        related_name='submissions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assessment_submissions'
    )
    attempt_number = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20, 
        choices=SUBMISSION_STATUS_CHOICES, 
        default='draft'
    )
    score = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='graded_submissions'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['assessment', 'user', 'attempt_number']
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user} - {self.assessment} (Attempt {self.attempt_number})"

    @property
    def is_passed(self):
        if self.score is None:
            return False
        return self.score >= self.assessment.passing_score

    @property
    def is_late(self):
        if not self.submitted_at:
            return False
        return self.submitted_at > self.assessment.due_date

class QuestionResponse(models.Model):
    submission = models.ForeignKey(
        AssessmentSubmission, 
        on_delete=models.CASCADE, 
        related_name='responses'
    )
    question = models.ForeignKey(
        Question, 
        on_delete=models.CASCADE, 
        related_name='responses'
    )
    text_response = models.TextField(blank=True)
    selected_options = models.ManyToManyField(
        QuestionOption, 
        blank=True,
        related_name='responses'
    )
    score = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    feedback = models.TextField(blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['submission', 'question']

    def __str__(self):
        return f"Response to {self.question} by {self.submission.user}"

class RubricRating(models.Model):
    response = models.ForeignKey(
        QuestionResponse, 
        on_delete=models.CASCADE, 
        related_name='rubric_ratings'
    )
    rubric = models.ForeignKey(
        Rubric, 
        on_delete=models.CASCADE, 
        related_name='ratings'
    )
    rating = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        validators=[MinValueValidator(0)]
    )
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['response', 'rubric']

    def __str__(self):
        return f"{self.rating}/{self.rubric.weight} for {self.rubric.criterion}"