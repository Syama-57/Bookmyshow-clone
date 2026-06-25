from django.contrib import admin
from .models import Movie, Theatre, Show, Booking

# 1. Register the core relational models with basic configurations
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'language', 'duration_minutes']
    search_fields = ['title', 'language']

@admin.register(Theatre)
class TheatreAdmin(admin.ModelAdmin):
    list_display = ['name', 'city']
    search_fields = ['name', 'city']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'show', 'seats_booked', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['seats_booked']


# 2. Define the automation action to duplicate shows for a full week
@admin.action(description='🔁 Duplicate selected shows for the next 1 week (7 Days)')
def repeat_shows_one_week(modeladmin, request, queryset):
    total_created = 0
    for show in queryset:
        # Calls the .bulk_repeat_show helper function written in models.py
        created_list = show.bulk_repeat_show(number_of_days=7)
        # Deduct 1 to exclude the original source show from the new addition count
        total_created += (len(created_list) - 1)
        
    modeladmin.message_user(
        request, 
        f"🎉 Success! Automatically scheduled {total_created} companion show times across the upcoming week."
    )


# 3. Register the Show model with the custom action dropdown toolbar attached
@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ['id', 'movie', 'theatre', 'screen_name', 'start_time', 'price']
    list_filter = ['theatre', 'screen_name', 'start_time']
    ordering = ['start_time']
    actions = [repeat_shows_one_week] # 👈 Hooks our bulk generation function into the admin UI