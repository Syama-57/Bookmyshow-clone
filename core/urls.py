"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse, HttpResponse
from bookings.views import movie_list, show_list_by_movie, create_booking

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
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
