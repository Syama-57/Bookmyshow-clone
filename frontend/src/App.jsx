import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);
  
  // New States for Seating Layout
  const [selectedShow, setSelectedShow] = useState(null);
  const [chosenSeats, setChosenSeats] = useState([]);

  // Default layout structure: 5 rows (A-E), 8 seats per row
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/movies/')
      .then(response => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setSelectedShow(null); // Reset show selection
    setChosenSeats([]);
    setLoadingShows(true);

    axios.get(`http://127.0.0.1:8000/api/movies/${movie.id}/shows/`)
      .then(response => {
        setShows(response.data);
        setLoadingShows(false);
      })
      .catch(error => {
        console.error("Error fetching shows:", error);
        setLoadingShows(false);
      });
  };

  // Toggle seat selection
  const handleSeatClick = (seatId) => {
    if (chosenSeats.includes(seatId)) {
      setChosenSeats(chosenSeats.filter(seat => seat !== seatId));
    } else {
      setChosenSeats([...chosenSeats, seatId]);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Movies...</div>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #f84464', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ color: '#f84464', margin: 0, cursor: 'pointer' }} onClick={() => { setSelectedMovie(null); setSelectedShow(null); }}>
          🎟️ BookMyShow Clone
        </h1>
      </header>

      <main>
        <h2>Now Showing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {movies.map(movie => (
            <div key={movie.id} style={{ border: movie.id === selectedMovie?.id ? '2px solid #f84464' : '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>{movie.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{movie.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', fontWeight: 'bold', marginBottom: '15px' }}>
                <span>⏱️ {movie.duration_minutes} mins</span>
                <span>🌐 {movie.language}</span>
              </div>
              <button 
                onClick={() => handleSelectMovie(movie)}
                style={{ backgroundColor: '#f84464', color: 'white', border: 'none', width: '100%', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Select Show
              </button>
            </div>
          ))}
        </div>

        {/* Showtimes Section */}
        {selectedMovie && (
          <section style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h2>Available Shows for <span style={{ color: '#f84464' }}>{selectedMovie.title}</span></h2>
            {loadingShows ? (
              <p>Loading showtimes...</p>
            ) : shows.length === 0 ? (
              <p>No shows scheduled.</p>
            ) : (
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                {shows.map(show => (
                  <button 
                    key={show.id}
                    onClick={() => { setSelectedShow(show); setChosenSeats([]); }}
                    style={{ 
                      padding: '15px', 
                      borderRadius: '6px', 
                      border: selectedShow?.id === show.id ? '2px solid #f84464' : '1px solid #ccc',
                      backgroundColor: selectedShow?.id === show.id ? '#fff0f2' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <strong style={{ display: 'block' }}>{show.theatre_name} ({show.screen_name})</strong>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      ⏱️ {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ display: 'block', marginTop: '5px', color: '#2e7d32', fontWeight: 'bold' }}>₹{show.price}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Seating Layout Map Section */}
        {selectedShow && (
          <section style={{ marginTop: '40px', padding: '30px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Select Your Seats for {selectedShow.theatre_name}</h3>
            <p style={{ color: '#777', fontSize: '14px' }}>Ticket Price: <strong>₹{selectedShow.price}</strong></p>
            
            {/* The Screen Visual Vector */}
            <div style={{ width: '60%', height: '8px', backgroundColor: '#bbb', margin: '20px auto 40px auto', borderRadius: '4px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <small style={{ display: 'block', color: '#999', marginTop: '12px' }}>SCREEN THIS WAY</small>
            </div>

            {/* Grid Map */}
            <div style={{ display: 'inline-block', margin: '0 auto' }}>
              {rows.map(row => (
                <div key={row} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                  <strong style={{ width: '20px', marginRight: '10px' }}>{row}</strong>
                  {seatNumbers.map(num => {
                    const seatId = `${row}${num}`;
                    const isSelected = chosenSeats.includes(seatId);
                    
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          backgroundColor: isSelected ? '#f84464' : '#ffffff',
                          color: isSelected ? 'white' : '#333',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Selection Summary Overlay */}
            {chosenSeats.length > 0 && (
              <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <p>Selected Seats: <strong style={{ color: '#f84464' }}>{chosenSeats.join(', ')}</strong></p>
                <p style={{ fontSize: '18px' }}>Total Amount: <strong>₹{chosenSeats.length * parseFloat(selectedShow.price)}</strong></p>
                <button 
  style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
  onClick={() => {
    // Make a real POST API call to Django backend
    axios.post('http://127.0.0.1:8000/api/bookings/create/', {
      show_id: selectedShow.id,
      seats: chosenSeats
    })
    .then(response => {
      alert(`🎉 Success! ${response.data.message}\nBooking ID: #00${response.data.booking_id}`);
      setChosenSeats([]); // Clear selected seats grid
    })
    .catch(error => {
      console.error("Booking error details:", error);
      alert("Failed to create booking. Please check console.");
    });
  }}
>
  Confirm & Book Tickets
</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;