from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'admin/tags', views.TagViewSet)  # Admin tags
router.register(r'admin/categories', views.CategoryViewSet)  # Admin categories
router.register(r'locations', views.LocationViewSet)
router.register(r'admin/locations/images', views.AdminLocationImageViewSet, basename='admin_location_images')
router.register(r'admin/locations', views.AdminLocationViewSet, basename='admin_locations')
router.register(r'admin/images', views.AdminImageViewSet)

# Add non-admin endpoints
router.register(r'tags', views.PublicTagViewSet, basename='public_tags')  # Public tags
router.register(r'categories', views.PublicCategoryViewSet, basename='public_categories')  # Public categories

urlpatterns = [
    path('', include(router.urls)),
]
