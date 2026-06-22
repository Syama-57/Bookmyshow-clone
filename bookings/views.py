from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from .models import Movie, Show  # Make sure Movie and Show are both imported
from .serializers import MovieSerializer
from .models import Movie, Show, Booking  # 1. Double check Booking is imported here
from django.contrib.auth.models import User

# 1. Your original movie list view
@api_view(['GET'])
def movie_list(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

# 2. The Serializer for Shows
class ShowSerializer(serializers.ModelSerializer):
    theatre_name = serializers.CharField(source='theatre.name', read_only=True)
    theatre_city = serializers.CharField(source='theatre.city', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)

    class Meta:
        model = Show
        fields = ['id', 'movie_title', 'theatre_name', 'theatre_city', 'screen_name', 'start_time', 'price']

# 3. Your dynamic show list view
@api_view(['GET'])
def show_list_by_movie(request, movie_id):
    shows = Show.objects.filter(movie_id=movie_id)
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