"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path`nfrom django.http import JsonResponse, HttpResponse
from django.http import JsonResponse, HttpResponse  # <-- ADDED THIS LINE
from bookings.views import movie_list, show_list_by_movie, create_booking

# 1. Import the JWT views from rest_framework_simplejwt
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
 
def home_view(request):
    return JsonResponse({"message": "Welcome to the BookMyShow Clone API!"})

def ignore_favicon(request):
    return HttpResponse(status=204)

urlpatterns = [
    path('favicon.ico', ignore_favicon),
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/movies/', movie_list),
    path('api/movies/<int:movie_id>/shows/', show_list_by_movie),
    path('api/bookings/create/', create_booking),
    
    # 2. Add these paths so React can authenticate successfully
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
