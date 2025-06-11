# # assessments/views.py

# class AssessmentViewSet(viewsets.ModelViewSet):
#     # ... (keep existing code)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_update(serializer)
#             return Response(serializer.data)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

# class QuestionViewSet(viewsets.ModelViewSet):
#     # ... (keep existing code)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_update(serializer)
#             return Response(serializer.data)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

# class RubricViewSet(viewsets.ModelViewSet):
#     # ... (keep existing code)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_update(serializer)
#             return Response(serializer.data)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

# class AssessmentAttachmentViewSet(
#     mixins.CreateModelMixin,
#     mixins.RetrieveModelMixin,
#     mixins.DestroyModelMixin,
#     mixins.ListModelMixin,
#     viewsets.GenericViewSet
# ):
#     # ... (keep existing code)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

# class AssessmentSubmissionViewSet(viewsets.ModelViewSet):
#     # ... (keep existing code)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_update(serializer)
#             return Response(serializer.data)
#         except ValidationError as e:
#             return Response(
#                 {
#                     'status': 'error',
#                     'message': 'Validation error',
#                     'errors': e.detail
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )