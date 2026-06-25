from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from .models import Movie, Show  # Make sure Movie and Show are both imported
from .serializers import MovieSerializer
from .models import Movie, Show, Booking  # 1. Double check Booking is imported here
from django.contrib.auth.models import User
from django.db.models import Q  # Import Q for complex search queries
from datetime import datetime
from django.utils import timezone

# 1. Your original movie list view
@api_view(['GET'])
def movie_list(request):
    # Get filter values sent from React URL parameters
    search_query = request.GET.get('search', '')
    language_filter = request.GET.get('language', '')

    # Start with all movies
    movies = Movie.objects.all()

    # If the user typed a search query, filter by title or description (case-insensitive)
    if search_query:
        movies = movies.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)
        )

    # If the user selected a specific language, filter by it
    if language_filter:
        movies = movies.filter(language__iexact=language_filter)

    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)
# 2. The Serializer for Shows
class ShowSerializer(serializers.ModelSerializer):
    theatre_name = serializers.CharField(source='theatre.name', read_only=True)
    theatre_city = serializers.CharField(source='theatre.city', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    taken_seats = serializers.SerializerMethodField()

    class Meta:
        model = Show
        # Explicitly list the fields to make sure everything transfers cleanly
        fields = ['id', 'movie_title', 'theatre_name', 'theatre_city', 'screen_name', 'start_time', 'price', 'taken_seats']

    def get_taken_seats(self, obj):
        # We look up bookings using the 'show' field on the Booking model
        bookings = Booking.objects.filter(show=obj, status='CONFIRMED')
        seats_list = []
        for booking in bookings:
            if booking.seats_booked:
                # Clean up any accidental spaces and split by comma
                individual_seats = [seat.strip() for seat in booking.seats_booked.split(',') if seat.strip()]
                seats_list.extend(individual_seats)
        return seats_list
# 3. Your dynamic show list view
@api_view(['GET'])
@api_view(['GET'])
def show_list_by_movie(request, movie_id):
    # Get the date string query parameter from React (e.g., ?date=2026-06-24)
    date_str = request.GET.get('date', None)
    
    # Filter shows belonging to this specific movie
    shows = Show.objects.filter(movie_id=movie_id)
    
    if date_str:
        try:
            # Parse the incoming string format cleanly into a Python date object
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # 🎯 FIX: Explicitly look at ONLY the calendar date portion (__date) 
            # of the start_time field to catch all hours, morning or night!
            shows = shows.filter(start_time__date=target_date)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)
            
    # Order them chronologically so morning shows come first
    shows = shows.order_by('start_time')
    
    serializer = ShowSerializer(shows, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_booking(request):
    try:
        # Read the data sent from React
        show_id = request.data.get('show_id')
        seats_list = request.data.get('seats') # Expecting an array like ['E3', 'E4', 'E5']
        
        # 1. Fetch the show details from the database
        try:
            show = Show.objects.get(id=show_id)
        except Show.DoesNotExist:
            return Response({"error": "Show not found"}, status=404)
        
        if not seats_list or len(seats_list) == 0:
            return Response({"error": "No seats selected"}, status=400)
            
        # 2. Get or create a user to assign the booking to
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.create_user(username='dummy_user', password='password123')
            
        # 3. Calculate total price safely on the backend server
        total_price = show.price * len(seats_list)
        
        # Convert ['E3', 'E4', 'E5'] into a clean string format "E3,E4,E5"
        seats_string = ",".join(seats_list)
        
        # 4. Save the booking in the database
        booking = Booking.objects.create(
            user=user,
            show=show,
            seats_booked=seats_string,
            total_price=total_price,
            status='CONFIRMED'
        )
        
        return Response({
            "message": "Ticket booked successfully!",
            "booking_id": booking.id,
            "total_paid": float(total_price)
        }, status=201)
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET'])
def show_list_by_movie(request, movie_id):
    # Get the date query parameter from the React URL (e.g., ?date=2026-06-22)
    date_str = request.GET.get('date', None)
    
    # Filter shows belonging to this specific movie
    shows = Show.objects.filter(movie_id=movie_id)
    
    if date_str:
        try:
            # Parse the incoming string into a Python date object
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            # Filter rows where the start_time field matches that specific day
            shows = shows.filter(start_time__date=target_date)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)
            
    serializer = ShowSerializer(shows, many=True)
    return Response(serializer.data)    