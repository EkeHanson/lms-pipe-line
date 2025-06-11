from django.contrib import admin

# Register your models here.
# assessments/admin.py
from django.contrib import admin
from .models import (
    Assessment, Question, QuestionOption, Rubric,
    AssessmentAttachment, AssessmentSubmission,
    QuestionResponse, RubricRating
)

class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 1

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    show_change_link = True
    inlines = [QuestionOptionInline]

class RubricInline(admin.TabularInline):
    model = Rubric
    extra = 1

class AssessmentAttachmentInline(admin.TabularInline):
    model = AssessmentAttachment
    extra = 1

class RubricRatingInline(admin.TabularInline):
    model = RubricRating
    extra = 1

class QuestionResponseInline(admin.TabularInline):
    model = QuestionResponse
    extra = 0
    readonly_fields = ['submission', 'question', 'text_response', 'score', 'feedback', 'is_correct']
    inlines = [RubricRatingInline]

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'assessment_type', 'status', 'due_date', 'created_by']
    list_filter = ['assessment_type', 'status', 'course']
    search_fields = ['title', 'description']
    inlines = [QuestionInline, RubricInline, AssessmentAttachmentInline]
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'edited_by']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        else:
            obj.edited_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'assessment', 'question_type', 'points', 'order']
    list_filter = ['question_type', 'assessment']
    search_fields = ['text']
    inlines = [QuestionOptionInline]
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'edited_by']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        else:
            obj.edited_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Rubric)
class RubricAdmin(admin.ModelAdmin):
    list_display = ['criterion', 'assessment', 'weight', 'order']
    list_filter = ['assessment']
    search_fields = ['criterion', 'description']
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'edited_by']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        else:
            obj.edited_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(AssessmentAttachment)
class AssessmentAttachmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'assessment', 'created_at']
    list_filter = ['assessment']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'created_by']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(AssessmentSubmission)
class AssessmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['assessment', 'user', 'status', 'score', 'submitted_at']
    list_filter = ['status', 'assessment', 'user']
    search_fields = ['feedback']
    inlines = [QuestionResponseInline]
    readonly_fields = ['created_at', 'updated_at', 'graded_at', 'graded_by']
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ['assessment', 'user', 'attempt_number']
        return self.readonly_fields

@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    list_display = ['submission', 'question', 'score', 'is_correct']
    list_filter = ['submission', 'question']
    inlines = [RubricRatingInline]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(RubricRating)
class RubricRatingAdmin(admin.ModelAdmin):
    list_display = ['response', 'rubric', 'rating']
    list_filter = ['rubric']
    readonly_fields = ['created_at', 'updated_at']