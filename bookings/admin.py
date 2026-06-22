from django.contrib import admin
from .models import Movie, Theatre, Show, Booking

# Register your models so they appear in the admin panel
admin.site.register(Movie)
admin.site.register(Theatre)
admin.site.register(Show)
admin.site.register(Booking)