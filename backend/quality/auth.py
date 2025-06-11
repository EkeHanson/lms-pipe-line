from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Assessment, IQASample, EQASample

@receiver(post_migrate)
def create_groups_and_permissions(sender, **kwargs):
    # Create groups
    iqa_group, created = Group.objects.get_or_create(name='IQA')
    eqa_group, created = Group.objects.get_or_create(name='EQA')
    assessor_group, created = Group.objects.get_or_create(name='Assessor')
    learner_group, created = Group.objects.get_or_create(name='Learner')

    # Get content types
    assessment_content_type = ContentType.objects.get_for_model(Assessment)
    iqa_sample_content_type = ContentType.objects.get_for_model(IQASample)
    eqa_sample_content_type = ContentType.objects.get_for_model(EQASample)

    # Create permissions
    # IQA Permissions
    Permission.objects.get_or_create(
        codename='view_assessment',
        name='Can view assessments',
        content_type=assessment_content_type
    )
    Permission.objects.get_or_create(
        codename='add_iqasample',
        name='Can add IQA samples',
        content_type=iqa_sample_content_type
    )
    Permission.objects.get_or_create(
        codename='view_iqasample',
        name='Can view IQA samples',
        content_type=iqa_sample_content_type
    )
    Permission.objects.get_or_create(
        codename='change_iqasample',
        name='Can change IQA samples',
        content_type=iqa_sample_content_type
    )
    
    # EQA Permissions (read-only)
    Permission.objects.get_or_create(
        codename='view_assessment',
        name='Can view assessments',
        content_type=assessment_content_type
    )
    Permission.objects.get_or_create(
        codename='view_iqasample',
        name='Can view IQA samples',
        content_type=iqa_sample_content_type
    )
    Permission.objects.get_or_create(
        codename='view_eqasample',
        name='Can view EQA samples',
        content_type=eqa_sample_content_type
    )
    
    # Assign permissions to groups
    # IQA Group
    iqa_group.permissions.add(
        Permission.objects.get(codename='view_assessment'),
        Permission.objects.get(codename='add_iqasample'),
        Permission.objects.get(codename='view_iqasample'),
        Permission.objects.get(codename='change_iqasample')
    )
    
    # EQA Group
    eqa_group.permissions.add(
        Permission.objects.get(codename='view_assessment'),
        Permission.objects.get(codename='view_iqasample'),
        Permission.objects.get(codename='view_eqasample')
    )