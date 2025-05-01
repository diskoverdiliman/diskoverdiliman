from .models import Category, Location, Image, Subarea, Tag
from django.db.models import Prefetch, Q
from rest_framework import serializers
import math


# Helper function to calculate distance between two lat/lng points
def distance_between(lat1, lng1, lat2, lng2):
    """
    Calculate the distance in meters between two lat/lng points using the Haversine formula.
    """
    lat1, lng1, lat2, lng2 = [math.radians(latlng) for latlng in (lat1, lng1, lat2, lng2)]
    R = 6371  # Radius of the earth in km
    dLat = abs(lat2 - lat1)
    dLng = abs(lng2 - lng1)
    a = math.pow(math.sin(dLat / 2), 2) + math.cos(lat1) * math.cos(lat2) * math.pow(math.sin(dLng / 2), 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = R * c  # Distance in km
    return d * 1000  # Return in meters


# Serializer for Category model
class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    """
    class Meta:
        model = Category
        fields = ('id', 'name', 'image', 'url', 'marker', 'route_marker', 'route_color')  # Use 'route_marker'


# Serializer for Tag model
class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tag model.
    """
    class Meta:
        model = Tag
        fields = ('id', 'name')


# Serializer for Image model
class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Image model.
    """
    class Meta:
        model = Image
        fields = ('img_url', 'id')


# Simplified Serializer for Location model
class LocationSimpleSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for the Location model.
    """
    class Meta:
        model = Location
        fields = ('id', 'name')


# Serializer for Location model (admin CRUD operations)
class LocationAdminCrudSerializer(serializers.ModelSerializer):
    """
    Serializer for Location model used in admin CRUD operations.
    """
    main_building = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'lat', 'lng', 'category', 'tags', 'subareas', 'main_building']

    def get_main_building(self, obj):
        # Check if the building relationship exists
        try:
            main_building = obj.building.first()
            return main_building.id if main_building else None
        except AttributeError:
            return None


# Serializer for Location model (admin image operations)
class LocationAdminImageSerializer(serializers.ModelSerializer):
    """
    Serializer for Location model used in admin image operations.
    """
    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        """
        Get images associated with the location.
        """
        images = obj.images.all()
        return ImageSerializer(images, many=True).data

    class Meta:
        model = Location
        fields = ('id', 'name', 'images')
        depth = 1


# Serializer for Location model (retrieve operations)
class LocationRetrieveSerializer(serializers.ModelSerializer):
    """
    Serializer for Location model used in retrieve operations.
    """
    category = serializers.SlugRelatedField(slug_field='name', read_only=True)
    tags = serializers.SlugRelatedField(slug_field='name', read_only=True, many=True)
    marker_icon = serializers.SerializerMethodField()
    subareas = serializers.SerializerMethodField()
    main_building = serializers.SerializerMethodField()
    nearby_locations = serializers.SerializerMethodField()
    img_urls = serializers.SerializerMethodField()

    DISTANCE_THRESHOLD = 150  # Distance threshold in meters

    def get_marker_icon(self, obj):
        """
        Get the marker icon for the location's category.
        """
        return obj.category.marker if obj.category else None

    def get_subareas(self, obj):
        """
        Get subareas grouped by category.
        """
        subarea_dict = {}
        categories = Category.objects.exclude(name="Buildings").prefetch_related(
            Prefetch('locations', queryset=Location.objects.filter(building__building=obj))
        )
        for category in categories:
            subarea_dict[category.name] = LocationSimpleSerializer(category.locations.all(), many=True).data or None
        return subarea_dict

    def get_main_building(self, obj):
        """
        Get the main building associated with the location.
        """
        try:
            main_building = obj.building.first()
            return LocationSimpleSerializer(main_building).data if main_building else None
        except AttributeError:
            return None

    def get_nearby_locations(self, obj):
        """
        Get nearby locations within the distance threshold.
        """
        queryset = Location.objects.filter(~Q(category__name="Rooms"))
        nearby_locations = []
        for location in queryset:
            distance = distance_between(obj.lat, obj.lng, location.lat, location.lng)
            if obj.name != location.name and distance < self.DISTANCE_THRESHOLD:
                nearby_locations.append({'name': location.name, 'id': location.id})
        return nearby_locations

    def get_img_urls(self, obj):
        """
        Get image URLs associated with the location.
        """
        images = obj.images.all()
        return [image.img_url for image in images]

    class Meta:
        model = Location
        fields = ('id', 'name', 'category', 'tags', 'marker_icon', 'description', 'more_info', 'lat', 'lng',
                  'subareas', 'main_building', 'nearby_locations', 'img_urls')


# Serializer for Location model (list operations)
class LocationListSerializer(serializers.ModelSerializer):
    """
    Serializer for Location model used in list operations.
    """
    thumbnail_url = serializers.SerializerMethodField()
    marker_icon = serializers.SerializerMethodField()

    def get_thumbnail_url(self, obj):
        """
        Get the thumbnail URL for the location.
        """
        image = obj.images.first()
        return image.img_url if image else None

    def get_marker_icon(self, obj):
        """
        Get the marker icon for the location's category.
        """
        return obj.category.marker if obj.category else None

    class Meta:
        model = Location
        fields = ('id', 'name', 'description', 'lat', 'lng', 'thumbnail_url', 'marker_icon')