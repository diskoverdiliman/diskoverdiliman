from .serializers import *
from .models import Category, Location, Tag, Subarea
from rest_framework import viewsets, generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.serializers import ValidationError
from django.http.request import QueryDict
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Location
from .serializers import LocationListSerializer

# Viewset for Category
class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing categories (CRUD operations).
    """
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        """
        Handle POST requests to create a new category.
        """
        try:
            data = request.data
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=201)
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)

    def update(self, request, *args, **kwargs):
        """
        Handle PUT requests to update an existing category.
        """
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=200)
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)

    def destroy(self, request, *args, **kwargs):
        """
        Handle DELETE requests to delete a category.
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response({"message": "Category deleted successfully."}, status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tags (CRUD operations).
    """
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        """
        Handle POST requests to create a new tag.
        """
        try:
            data = request.data
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=201)
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)

    def update(self, request, *args, **kwargs):
        """
        Handle PUT requests to update an existing tag.
        """
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=200)
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)

    def destroy(self, request, *args, **kwargs):
        """
        Handle DELETE requests to delete a tag.
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response({"message": "Tag deleted successfully."}, status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class LocationPagination(PageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })

# Viewset for Location
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    pagination_class = LocationPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LocationRetrieveSerializer
        return LocationListSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Handle GET requests for a specific location.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def filter_queryset(self, queryset):
        search = self.request.query_params.get("search")
        queryset = self.filter_search(queryset, search)

        category = self.request.query_params.get("category")
        queryset = self.filter_category(queryset, category)

        ordering = self.request.query_params.get("ordering")
        queryset = self.filter_sort(queryset, ordering)

        tags = self.request.query_params.getlist("tag")
        queryset = self.filter_tags(queryset, tags)

        return queryset

    def filter_category(self, queryset, category):
        if category:
            filtered_queryset = queryset.filter(
                category__name__iexact=category)
            return filtered_queryset
        else:
            return queryset

    def filter_search(self, queryset, search):
        if search:
            filtered_queryset = queryset.filter(name__icontains=search)
            return filtered_queryset
        else:
            return queryset

    def filter_sort(self, queryset, ordering):
        if ordering:
            sorted_queryset = queryset.order_by(ordering)
            return sorted_queryset
        else:
            return queryset

    def filter_tags(self, queryset, tags):
        if tags:
            filtered_queryset = queryset
            for tag in tags:
                filtered_queryset = filtered_queryset.filter(
                    tags__name__iexact=tag)
            return filtered_queryset
        else:
            return queryset


# Viewset for locations that admin can CRUD
class AdminLocationViewSet(LocationViewSet):
    queryset = Location.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_serializer_class(self):
        if self.action == 'list':
            return LocationSimpleSerializer
        else:
            return LocationAdminCrudSerializer

    def validate_subareas(self, subarea_ids):
        """
        Validate that all subarea IDs correspond to existing Location objects.
        """
        invalid_ids = []
        for subarea_id in subarea_ids:
            if not Location.objects.filter(pk=subarea_id).exists():
                invalid_ids.append(subarea_id)
        if invalid_ids:
            raise ValidationError({"subareas": f"Invalid pk(s) {invalid_ids} - object(s) do not exist."})

    def create(self, request):
        requestDict = request.data
        if isinstance(requestDict, QueryDict):
            requestDict = self.parse_querydict(requestDict)

        # Validate subareas
        if 'subareas' in requestDict and requestDict['subareas']:
            self.validate_subareas(requestDict['subareas'])

        try:
            self.validate(requestDict)
        except ValidationError as e:
            return Response(e.detail)

        # Reset sequence id and use serializer to create with basic fields
        Location.reset_id_sequence()
        responseDict = super().create(request).data
        createdLocation = Location.objects.get(pk=responseDict['id'])

        # Add tags if there are any
        if 'tags' in requestDict and requestDict['tags']:
            createdLocation.tags.add(*requestDict['tags'])
            responseDict['tags'] = requestDict['tags']

        # Add building or subareas if there are any
        if 'main_building' in requestDict and requestDict['main_building']:
            Subarea.objects.update_or_create(sub=createdLocation, defaults={
                'building': Location.objects.get(pk=requestDict['main_building'])
            })
            responseDict['main_building'] = requestDict['main_building']
        elif 'subareas' in requestDict and requestDict['subareas']:
            subareaLocations = Location.objects.in_bulk(
                requestDict['subareas']).values()
            for subarea in subareaLocations:
                Subarea.objects.update_or_create(sub=subarea, defaults={
                    'building': createdLocation
                })
            responseDict['subareas'] = requestDict['subareas']

        return Response(responseDict)

    def partial_update(self, request, pk=None):
        requestDict = request.data
        if isinstance(requestDict, QueryDict):
            requestDict = self.parse_querydict(requestDict)

        # Validate subareas
        if 'subareas' in requestDict and requestDict['subareas']:
            self.validate_subareas(requestDict['subareas'])

        try:
            self.validate(requestDict)
        except ValidationError as e:
            return Response(e.detail)

        responseDict = super().partial_update(request, pk).data
        updatedLocation = Location.objects.get(pk=pk)

        # Handle inputs
        if 'tags' in requestDict and requestDict['tags']:
            updatedLocation.tags.clear()
            updatedLocation.tags.add(*requestDict['tags'])
            responseDict['tags'] = requestDict['tags']

        if 'main_building' in requestDict and requestDict['main_building']:
            Subarea.objects.filter(building=updatedLocation).delete()
            responseDict['subareas'] = None
            Subarea.objects.update_or_create(sub=updatedLocation, defaults={
                'building': Location.objects.get(pk=requestDict['main_building'])
            })
            responseDict['main_building'] = requestDict['main_building']
        elif 'subareas' in requestDict and requestDict['subareas']:
            Subarea.objects.filter(building=updatedLocation).delete()
            Subarea.objects.filter(sub=updatedLocation).delete()
            responseDict['main_building'] = None
            subareaLocations = Location.objects.in_bulk(
                requestDict['subareas']).values()
            for subarea in subareaLocations:
                Subarea.objects.update_or_create(sub=subarea, defaults={
                    'building': updatedLocation
                })
            responseDict['subareas'] = requestDict['subareas']

        # Handle null inputs
        if 'tags' in requestDict and not requestDict['tags']:
            updatedLocation.tags.clear()
            responseDict['tags'] = None
        if 'main_building' in requestDict and not requestDict['main_building']:
            Subarea.objects.filter(sub=updatedLocation).delete()
            responseDict['main_building'] = None
        if 'subareas' in requestDict and not requestDict['subareas']:
            Subarea.objects.filter(building=updatedLocation).delete()
            responseDict['subareas'] = None

        return Response(responseDict)

    # returns the dictionary version of input querydict, useful for handling multipart form data
    def parse_querydict(self, queryDict):
        parsedDict = dict(queryDict)
        parsedDict['name'] = parsedDict.get('name') and parsedDict['name'][0]
        parsedDict['category'] = parsedDict.get(
            'category') and int(parsedDict['category'][0])
        parsedDict['description'] = parsedDict.get(
            'description') and parsedDict['description'][0]
        parsedDict['more_info'] = parsedDict.get(
            'more_info') and parsedDict['more_info'][0]
        parsedDict['lat'] = parsedDict.get('lat') and int(parsedDict['lat'][0])
        parsedDict['lng'] = parsedDict.get('lng') and int(parsedDict['lng'][0])
        parsedDict['subareas'] = parsedDict.get(
            'subareas') and [int(sub) for sub in parsedDict['subareas']]
        parsedDict['main_building'] = parsedDict.get(
            'main_building') and int(parsedDict['main_building'][0])
        parsedDict['tags'] = parsedDict.get(
            'tags') and [int(tag) for tag in parsedDict['tags']]
        return parsedDict

    def validate(self, requestDict):
        # assume it's valid first
        isValid = True
        # error dict starts empty because assumed valid
        errorDict = {}
        # validate main_building
        main_building = requestDict.get('main_building')
        if main_building and not isinstance(main_building, int):
            isValid = False
            errorDict['main_building'] = "should be an integer"

        # validate subareas
        subareas = requestDict.get('subareas')
        if subareas and not(isinstance(subareas, list) and all([isinstance(sub, int) for sub in subareas])):
            isValid = False
            errorDict['subareas'] = "should be an array of integers"

        # validate tags
        tags = requestDict.get('tags')
        if tags and not(isinstance(tags, list) and all([isinstance(tag, int) for tag in tags])):
            isValid = False
            errorDict['tag'] = "should be an array of integers"

        if not isValid:
            raise ValidationError(errorDict)

    # OVERRIDE DESTROY HOOK FOR HANDLING DELETE REQUESTS
    def destroy(self, request, pk=None):
        try:
            deletedLocation = Location.objects.get(pk=pk)
        except:
            return Response({
                'info': "cannot find location with id {}".format(pk)
            })
        deleteData = LocationAdminCrudSerializer(instance=deletedLocation).data
        deleteNum, deleteInfo = deletedLocation.delete()
        
        return Response({
            'data': deleteData,
            'info': deleteInfo
        })


# folder to store the saved images to
SAVED_IMAGES_PATH = "diskover_api/static/images/locations/"
SERVED_IMAGES_PATH = "static/images/locations/"

# input imageFiles list and writes them to static/images directory
def handle_image_uploads(imageFiles):
    savedFileNames = []
    for imageFile in imageFiles:
        copyCount = 1
        fileName, fileExt = os.path.splitext(imageFile.name)
        newFileName = fileName
        # loop to prevent duplicate fileNames
        while True:
            filePath = SAVED_IMAGES_PATH + newFileName + fileExt
            if not os.path.exists(filePath):
                break
            newFileName = "{}_{}".format(fileName, copyCount)
            copyCount += 1

        # write in PATH TO SAVE IMAGES
        os.makedirs(os.path.dirname(filePath), exist_ok=True)        
        with open(filePath, 'wb+') as destination:
            for chunk in imageFile.chunks():
                destination.write(chunk)
        # write in PATH TO SERVE IMAGES
        filePath = SERVED_IMAGES_PATH + newFileName + fileExt
        os.makedirs(os.path.dirname(filePath), exist_ok=True)        
        with open(filePath, 'wb+') as destination:
            for chunk in imageFile.chunks():
                destination.write(chunk)
        savedFileNames.append(newFileName + fileExt)
    return savedFileNames

def handle_image_deletions(imageUrl):
    filesDeleted = []
    # delete in PATH TO SAVE IMAGES
    filePath = SAVED_IMAGES_PATH + imageUrl
    if os.path.exists(filePath):
        os.remove(filePath)
        filesDeleted.append(filePath)

    # delete in PATH TO SERVE IMAGES
    filePath = SERVED_IMAGES_PATH + imageUrl
    if os.path.exists(filePath):
        os.remove(filePath)
        filesDeleted.append(filePath)

    return filesDeleted
      
class AdminLocationImageViewSet(LocationViewSet):
    queryset = Location.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_serializer_class(self):
        return LocationAdminImageSerializer

    # returns the dictionary version of input querydict, useful for handling multipart form data
    def parse_querydict(self, queryDict):
        parsedDict = dict(queryDict)
        try:
            parsedDict['image_ids'] = parsedDict.get('image_ids') and [int(id) for id in parsedDict['image_ids']]
        except:
            parsedDict['image_ids'] = [0]
        return parsedDict

    # OVERRIDE PARTIAL_UPDATE HOOK FOR HANDLING PATCH REQUESTS
    def partial_update(self, request, pk=None):
        requestDict = request.data
        # if multipart/form data, parse it into native Python dict
        if isinstance(requestDict, QueryDict):
            requestDict = self.parse_querydict(requestDict)
        print(requestDict)

        updatedLocation = Location.objects.get(pk=pk)

        # handle binding of new image id set
        if 'image_ids' in requestDict:
            updatedLocation.images.clear()
            if requestDict['image_ids']:        
                updatedLocation.images.add(*requestDict['image_ids'])
 
        # if image files uploaded, parse them and save to static directory
        filesDict = dict(request.FILES)
        savedFileNames = []
        if filesDict.get('images'):
            savedFileNames = handle_image_uploads(filesDict['images'])
        
        # bind new image uploads to corresponding location
        Image.reset_id_sequence()
        savedFileImages = [Image(img_url=fileName) for fileName in savedFileNames]
        Image.objects.bulk_create(savedFileImages)
        updatedLocation.images.add(*savedFileImages)

        responseDict = {
            'images': []
        }
        newImageSet = ImageSerializer(instance=updatedLocation.images.all(), many=True)
        responseDict['images'].extend(newImageSet.data)

        return Response(responseDict)


    def create(self, request):
        return Response({
            'locations/images': 'POST requests not allowed'
        })

    def update(self, request, pk=None):
        return Response({
            'locations/images': 'PUT requests not allowed'
        })

    def destroy(self, request, pk=None):
        return Response({
            'locations/images': 'DELETE requests not allowed'
        })


class AdminImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, queryset):
        locationId = self.request.query_params.get("location_id")
        print(locationId)
        try:
            locationId = int(locationId)
            if locationId:
                return queryset.filter(location__id=locationId)
            else:
                return queryset.filter(location=None)
        except:
            return queryset


    # OVERRIDE METHOD FOR HANDLING POST
    def create(self, request):
        # if image files uploaded, parse them and save to static directory
        filesDict = dict(request.FILES)
        savedFileNames = []
        if filesDict.get('images'):
            savedFileNames = handle_image_uploads(filesDict['images'])

        # add images to database
        Image.reset_id_sequence()
        savedFileImages = [Image(img_url=fileName) for fileName in savedFileNames]
        Image.objects.bulk_create(savedFileImages)

        # create response
        newImageSet = ImageSerializer(instance=savedFileImages, many=True)
        responseDict = {
            'images': newImageSet.data
        }
        return Response(responseDict)

    # OVERRIDE METHOD FOR HANDLING DELETE
    def destroy(self, request, pk=None):
        # validate first if image to be deleted exists
        try:
            imageObj = Image.objects.get(pk=pk)
        except:
            return Response({
                 'info': "cannot find image with id {}".format(pk)
            })

        # delete image from storage
        filesDeleted = handle_image_deletions(imageObj.img_url)

        # save image in variable before deletion
        deleteData = ImageSerializer(instance=imageObj).data
        # delete image from database
        deleteNum, deleteInfo = imageObj.delete()

        return Response({
            'data': deleteData,
            'info': deleteInfo,
            'file_deleted': filesDeleted
        })

    # OVERRIDE PUTS AND PATCH TO DO NOTHING
    def update(self, request, pk=None):
        return Response({
            'images': 'PUT requests not allowed'
        })

    def partial_update(self, request, pk=None):
        return Response({
            'images': 'PATCH requests not allowed'
        })

# Non-admin ViewSet for Tags
class PublicTagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for retrieving tag details.
    """
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer
    permission_classes = [AllowAny]  # Allow anyone to access this endpoint

# Non-admin ViewSet for Categories
class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for retrieving category details.
    """
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allow anyone to access this endpoint
