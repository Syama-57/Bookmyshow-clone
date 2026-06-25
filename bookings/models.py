from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta  # 👈 Make sure to import timedelta at the top
class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration_minutes = models.IntegerField()
    language = models.CharField(max_length=100)
    release_date = models.DateField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    trailer_url = models.URLField(max_length=500, blank=True, null=True)


    def __str__(self):
        return self.title

class Theatre(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return f"{self.name} ({self.city})"

class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='shows')
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE, related_name='shows')
    screen_name = models.CharField(max_length=100) # e.g., "Screen 1", "IMAX"
    start_time = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.movie.title} at {self.theatre.name} - {self.start_time.strftime('%d %b, %I:%M %p')}"
    
    def bulk_repeat_show(self, number_of_days=7):
        """
        Generates consecutive daily showtime entries with live console logging.
        """
        created_shows = [self]
        
        print(f"\n--- 🚀 STARTING BULK DUPLICATION FOR SHOW ID {self.id} ---")
        print(f"Base show time is: {self.start_time}")
        
        for day in range(1, number_of_days):
            next_date = self.start_time + timedelta(days=day)
            date_only_string = next_date.strftime('%Y-%m-%d')
            
            duplicate_exists = Show.objects.filter(
                movie=self.movie,
                theatre=self.theatre,
                screen_name=self.screen_name,
                start_time__date=next_date.date()
            ).exists()
            
            if not duplicate_exists:
                print(f"-> Day {day}: Creating new showtime for {next_date}")
                new_show = Show.objects.create(
                    movie=self.movie,
                    theatre=self.theatre,
                    screen_name=self.screen_name,
                    start_time=next_date,
                    price=self.price
                )
                created_shows.append(new_show)
            else:
                print(f"-> Day {day}: Skipped. A show already exists on {date_only_string}")
                
        print(f"--- ✅ FINISHED. TOTAL SHOWS IN SYSTEM FOR THIS BLOCK: {len(created_shows)} ---\n")
        return created_shows


class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='bookings')
    seats_booked = models.CharField(max_length=255) # Store as comma-separated values like "A1,A2"
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} by {self.user.username} for {self.show.movie.title}"

