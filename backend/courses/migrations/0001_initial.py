# Generated by Django 5.2 on 2025-04-20 13:29

import courses.models
import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(blank=True, max_length=200, unique=True)),
                ('code', models.CharField(max_length=50, unique=True)),
                ('description', models.TextField()),
                ('short_description', models.CharField(blank=True, max_length=300)),
                ('level', models.CharField(choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')], default='Beginner', max_length=20)),
                ('status', models.CharField(choices=[('Draft', 'Draft'), ('Published', 'Published'), ('Archived', 'Archived')], default='Draft', max_length=20)),
                ('duration', models.CharField(blank=True, max_length=100)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('discount_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('currency', models.CharField(choices=[('NGN', 'Naira (₦)'), ('USD', 'Dollar ($)'), ('EUR', 'Euro (€)')], default='NGN', max_length=3)),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to=courses.models.course_thumbnail_path)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('completion_hours', models.PositiveIntegerField(default=0, help_text='Estimated hours to complete the course')),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='courses.category')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_courses', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CertificateTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=False)),
                ('template', models.CharField(choices=[('default', 'Default'), ('modern', 'Modern'), ('elegant', 'Elegant'), ('custom', 'Custom')], default='default', max_length=20)),
                ('custom_text', models.TextField(default='Congratulations on completing the course!')),
                ('logo', models.ImageField(blank=True, null=True, upload_to=courses.models.certificate_logo_path)),
                ('signature', models.ImageField(blank=True, null=True, upload_to=courses.models.certificate_signature_path)),
                ('signature_name', models.CharField(default='Course Instructor', max_length=100)),
                ('show_date', models.BooleanField(default=True)),
                ('show_course_name', models.BooleanField(default=True)),
                ('show_completion_hours', models.BooleanField(default=True)),
                ('course', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='certificate_settings', to='courses.course')),
            ],
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enrolled_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='courses.course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'course')},
            },
        ),
        migrations.CreateModel(
            name='Certificate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('issued_at', models.DateTimeField(auto_now_add=True)),
                ('certificate_id', models.CharField(max_length=50, unique=True)),
                ('pdf_file', models.FileField(blank=True, null=True, upload_to='certificates/pdfs/')),
                ('enrollment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='certificate', to='courses.enrollment')),
            ],
        ),
        migrations.CreateModel(
            name='Instructor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True)),
                ('is_active', models.BooleanField(default=True)),
                ('expertise', models.ManyToManyField(blank=True, to='courses.category')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='instructor_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LearningOutcome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=200)),
                ('order', models.PositiveIntegerField(default=0)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='learning_outcomes', to='courses.course')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='LearningPath',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('courses', models.ManyToManyField(related_name='learning_paths', to='courses.course')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_published', models.BooleanField(default=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modules', to='courses.course')),
            ],
            options={
                'ordering': ['order'],
                'unique_together': {('course', 'order')},
            },
        ),
        migrations.CreateModel(
            name='Prerequisite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=200)),
                ('order', models.PositiveIntegerField(default=0)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prerequisites', to='courses.course')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('resource_type', models.CharField(choices=[('link', 'Web Link'), ('pdf', 'PDF Document'), ('video', 'Video'), ('file', 'File')], max_length=20)),
                ('url', models.URLField(blank=True)),
                ('file', models.FileField(blank=True, null=True, upload_to=courses.models.resource_file_path)),
                ('order', models.PositiveIntegerField(default=0)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='courses.course')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='SCORMxAPISettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=False)),
                ('standard', models.CharField(choices=[('scorm12', 'SCORM 1.2'), ('scorm2004', 'SCORM 2004'), ('xapi', 'xAPI (Tin Can)')], default='scorm12', max_length=20)),
                ('version', models.CharField(default='1.2', max_length=20)),
                ('completion_threshold', models.PositiveIntegerField(default=80, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('score_threshold', models.PositiveIntegerField(default=70, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('track_completion', models.BooleanField(default=True)),
                ('track_score', models.BooleanField(default=True)),
                ('track_time', models.BooleanField(default=True)),
                ('track_progress', models.BooleanField(default=True)),
                ('package', models.FileField(blank=True, null=True, upload_to=courses.models.scorm_package_path)),
                ('course', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='scorm_settings', to='courses.course')),
            ],
        ),
        migrations.CreateModel(
            name='CourseRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('review', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to='courses.course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_ratings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'course')},
            },
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('lesson_type', models.CharField(choices=[('video', 'Video'), ('quiz', 'Quiz'), ('assignment', 'Assignment'), ('text', 'Text'), ('file', 'File')], default='video', max_length=20)),
                ('duration', models.PositiveIntegerField(default=0, help_text='Duration in minutes')),
                ('content_url', models.URLField(blank=True)),
                ('content_file', models.FileField(blank=True, null=True, upload_to='lessons/files/')),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_published', models.BooleanField(default=True)),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='courses.module')),
            ],
            options={
                'ordering': ['order'],
                'unique_together': {('module', 'order')},
            },
        ),
        migrations.CreateModel(
            name='CourseInstructor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_type', models.CharField(choices=[('all', 'Entire Course'), ('specific', 'Specific Modules')], default='all', max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_instructors', to='courses.course')),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_courses', to='courses.instructor')),
                ('modules', models.ManyToManyField(blank=True, to='courses.module')),
            ],
            options={
                'unique_together': {('course', 'instructor')},
            },
        ),
    ]
