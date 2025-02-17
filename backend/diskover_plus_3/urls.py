"""
URL configuration for diskover_plus_3 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('diskover_api/', include('diskover_api.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    
    # Updated JWT endpoints
    path('diskover_api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('diskover_api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('diskover_api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    re_path(r'^(?P<path>.*)/$', TemplateView.as_view(template_name='index.html')),     
]
#uncomment the last urlpattern if running vue-router on history mode instead of hash mode