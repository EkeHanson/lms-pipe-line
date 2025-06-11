from rest_framework import permissions

class IsIQA(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='IQA').exists()

class IsEQA(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='EQA').exists()

class IsAssessor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Assessor').exists()

class IsLearnerOrAssessor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name__in=['Learner', 'Assessor']).exists()

    def has_object_permission(self, request, view, obj):
        if request.user.groups.filter(name='Assessor').exists():
            return obj.assessor.user == request.user
        elif request.user.groups.filter(name='Learner').exists():
            return obj.learner.user == request.user
        return False