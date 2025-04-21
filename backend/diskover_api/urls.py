from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'admin/tags', views.TagViewSet)
router.register(r'admin/categories', views.CategoryViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'admin/locations/images', views.AdminLocationImageViewSet, basename='admin_location_images')
router.register(r'admin/locations', views.AdminLocationViewSet, basename='admin_locations')
router.register(r'admin/images', views.AdminImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.SearchView.as_view(), name='search'),  # Use path() for SearchView
]
