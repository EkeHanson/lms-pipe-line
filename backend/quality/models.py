from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError

class Qualification(models.Model):
    name = models.CharField(max_length=255)
    awarding_body = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.awarding_body})"

class Assessor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    qualifications = models.ManyToManyField(Qualification)
    staff_id = models.CharField(max_length=50)

    def __str__(self):
        return self.user.get_full_name()

class IQA(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    qualifications = models.ManyToManyField(Qualification)
    staff_id = models.CharField(max_length=50)

    def __str__(self):
        return self.user.get_full_name()

class EQA(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    awarding_body = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.awarding_body})"

class Learner(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=50)
    qualifications = models.ManyToManyField(Qualification)
    enrollment_date = models.DateField()
    assessor = models.ForeignKey(Assessor, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.user.get_full_name()

class Assessment(models.Model):
    learner = models.ForeignKey(Learner, on_delete=models.CASCADE)
    qualification = models.ForeignKey(Qualification, on_delete=models.CASCADE)
    assessor = models.ForeignKey(Assessor, on_delete=models.CASCADE)
    unit_code = models.CharField(max_length=50)
    unit_title = models.CharField(max_length=255)
    submission_date = models.DateTimeField()
    assessment_date = models.DateTimeField()
    outcome_choices = [
        ('P', 'Pass'),
        ('F', 'Fail'),
        ('R', 'Referred'),
    ]
    outcome = models.CharField(max_length=1, choices=outcome_choices)
    feedback = models.TextField()
    evidence = models.FileField(upload_to='assessments/evidence/')

    def __str__(self):
        return f"{self.learner} - {self.unit_code}"

class IQASample(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    iqa = models.ForeignKey(IQA, on_delete=models.CASCADE)
    sample_date = models.DateTimeField(auto_now_add=True)
    comments = models.TextField()
    decision_choices = [
        ('A', 'Approved'),
        ('R', 'Revisions Required'),
        ('I', 'Invalid'),
    ]
    decision = models.CharField(max_length=1, choices=decision_choices)
    feedback_to_assessor = models.TextField()
    verification_record = models.FileField(upload_to='iqa/records/')

    def __str__(self):
        return f"IQA Sample {self.id} for {self.assessment}"

class IQASamplingPlan(models.Model):
    qualification = models.ForeignKey(Qualification, on_delete=models.CASCADE)
    iqa = models.ForeignKey(IQA, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    sample_size_percent = models.IntegerField()
    criteria = models.TextField()
    plan_document = models.FileField(upload_to='iqa/plans/')

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("End date must be after start date")
        if not (1 <= self.sample_size_percent <= 100):
            raise ValidationError("Sample size must be between 1 and 100 percent")

    def __str__(self):
        return f"Sampling Plan for {self.qualification}"

class EQAVisit(models.Model):
    eqa = models.ForeignKey(EQA, on_delete=models.CASCADE)
    visit_date = models.DateField()
    visit_type_choices = [
        ('P', 'Physical Visit'),
        ('R', 'Remote Visit'),
    ]
    visit_type = models.CharField(max_length=1, choices=visit_type_choices)
    agenda = models.TextField()
    completed = models.BooleanField(default=False)
    report = models.FileField(upload_to='eqa/reports/', null=True, blank=True)

    def __str__(self):
        return f"EQA Visit on {self.visit_date}"

class EQASample(models.Model):
    visit = models.ForeignKey(EQAVisit, on_delete=models.CASCADE)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    iqa_sample = models.ForeignKey(IQASample, on_delete=models.CASCADE, null=True, blank=True)
    comments = models.TextField()
    outcome_choices = [
        ('S', 'Satisfactory'),
        ('A', 'Action Required'),
        ('U', 'Unsatisfactory'),
    ]
    outcome = models.CharField(max_length=1, choices=outcome_choices)
    follow_up_required = models.BooleanField(default=False)
    follow_up_notes = models.TextField(blank=True)

    def __str__(self):
        return f"EQA Sample {self.id} for {self.assessment}"