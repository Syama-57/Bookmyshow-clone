from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration_minutes = models.IntegerField()
    language = models.CharField(max_length=100)
    release_date = models.DateField()

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