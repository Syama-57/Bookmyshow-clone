import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);
  
  const [selectedShow, setSelectedShow] = useState(null);
  const [chosenSeats, setChosenSeats] = useState([]);

  // Search & Navigation Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal State for Ticket Quantity Selector
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selectedQty, setSelectedQty] = useState(2);
  const [pendingShow, setPendingShow] = useState(null);

  const searchInputRef = useRef(null);

  // Seat Configuration Tiers
  const executiveRows = ['AA', 'AB', 'AC', 'AD', 'AE'];
  const dressCircleRows = ['E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const seatNumbers = Array.from({ length: 26 }, (_, i) => i + 1);
  
  // Authentication States
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoggingIn, setIsLoggingIn] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/api/movies/?search=${searchTerm}&language=${selectedLanguage}`)
      .then(response => {
        setMovies(response.data);
        setLoading(false);
        setTimeout(() => { if (searchInputRef.current) searchInputRef.current.focus(); }, 0);
      })
      .catch(error => {
        console.error("Error fetching filtered movies:", error);
        setLoading(false);
      });
  }, [searchTerm, selectedLanguage]);

  useEffect(() => {
    if (selectedMovie) {
      setLoadingShows(true);
      setSelectedShow(null);
      setChosenSeats([]);
      fetchShowtimes();
    }
  }, [selectedDate, selectedMovie]);

  const fetchShowtimes = () => {
    axios.get(`http://127.0.0.1:8000/api/movies/${selectedMovie.id}/shows/?date=${selectedDate}`)
      .then(response => {
        setShows(response.data);
        setLoadingShows(false);
      })
      .catch(error => {
        console.error("Error updating shows:", error);
        setLoadingShows(false);
      });
  };

  const handleSelectMovie = (movie) => {
    if (!token) {
    alert("Please sign in to view movie details and book tickets!");
    setIsLoggingIn(true); // Redirects them straight to the login/signup view
    return;
  }
    
    setSelectedMovie(movie);
    setSelectedShow(null);
    setChosenSeats([]);
  };

  const handleShowtimeClick = (show) => {
    setPendingShow(show);
    setShowQtyModal(true);
  };

  const confirmQtySelection = () => {
    setSelectedShow(pendingShow);
    setChosenSeats([]);
    setShowQtyModal(false);
  };

  const handleSeatClick = (seatId) => {
    if (chosenSeats.includes(seatId)) {
      setChosenSeats(chosenSeats.filter(seat => seat !== seatId));
    } else {
      if (chosenSeats.length >= selectedQty) {
        setChosenSeats([seatId]); 
      } else {
        setChosenSeats([...chosenSeats, seatId]);
      }
    }
  };

  const renderSeatRow = (row) => {
    return (
      <div key={row} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
        <strong style={{ width: '30px', textAlign: 'left', fontSize: '12px', color: '#aaa' }}>{row}</strong>
        <div style={{ display: 'flex', gap: '5px' }}>
          {seatNumbers.map(num => {
            const seatId = `${row}${num}`;
            const isSelected = chosenSeats.includes(seatId);
            const isTaken = selectedShow?.taken_seats?.includes(seatId);
            const hasAisleGap = num === 2 || num === 12 || num === 15;

            return (
              <React.Fragment key={seatId}>
                <button
                  disabled={isTaken}
                  onClick={() => handleSeatClick(seatId)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '3px',
                    border: isSelected ? '1px solid #24ae5f' : '1px solid #1ea83c',
                    backgroundColor: isTaken ? '#eeeeee' : isSelected ? '#24ae5f' : '#ffffff',
                    color: isTaken ? '#d6d6d6' : isSelected ? '#ffffff' : '#1ea83c',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    cursor: isTaken ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {num}
                </button>
                {hasAisleGap && <div style={{ width: '20px' }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    axios.post('http://127.0.0.1:8000/api/token/', {
      username: username,
      password: password
    })
    .then(response => {
      const accessToken = response.data.access;
      setToken(accessToken);
      localStorage.setItem('token', accessToken); 
      setIsLoggingIn(false); 
      setUsername('');
      setPassword('');
    })
    .catch(err => {
      console.error("Login authentication failed:", err);
      setAuthError('Invalid username or password. Please try again.');
    });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setSelectedMovie(null);
    setSelectedShow(null);
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#f2f2f2', minHeight: '100vh', margin: 0, paddingBottom: '100px' }}>
      
      {/* Premium Main Header Navbar */}
      <nav style={{ backgroundColor: '#333545', padding: '15px 50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', width: '70%' }}>
            <h1 style={{ color: '#ffffff', margin: 0, fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' }} onClick={() => { setSelectedMovie(null); setSelectedShow(null); setIsLoggingIn(false); }}>
              book<span style={{ color: '#f84464' }}>my</span>show
            </h1>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search for Movies, Events, Plays, Sports and Activities" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 15px', borderRadius: '4px', border: 'none', width: '60%', fontSize: '14px', outline: 'none' }}
            />
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #555', fontSize: '14px', cursor: 'pointer' }}
            >
              <option value="" style={{color: '#333'}}>All Languages</option>
              <option value="Malayalam" style={{color: '#333'}}>Malayalam</option>
              <option value="English" style={{color: '#333'}}>English</option>
              <option value="Hindi" style={{color: '#333'}}>Hindi</option>
              <option value="Tamil" style={{color: '#333'}}>Tamil</option>
            </select>
          </div>
          
          {/* Dynamic Auth Action Button */}
          <div>
            {token ? (
              <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #ffffffaa', padding: '7px 18px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                Logout
              </button>
            ) : (
              <button onClick={() => setIsLoggingIn(true)} style={{ backgroundColor: '#f84464', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT VIEW LAYER */}
      {isLoggingIn ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 25px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>Welcome Back</h2>
            
            {authError && (
              <div style={{ backgroundColor: '#fde8ec', color: '#f84464', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', border: '1px solid #fcd2db', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>Username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button type="submit" style={{ backgroundColor: '#f84464', color: '#fff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(248, 68, 100, 0.25)' }}>
                Log In
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => setIsLoggingIn(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
                Back to Movies
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Recommended Movies Dashboard */}
          {!selectedMovie ? (
            <div style={{ padding: '40px 50px' }}>
              <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>Recommended Movies</h2>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading cinema entries...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
                  {movies.map(movie => (
                    <div key={movie.id} onClick={() => handleSelectMovie(movie)} style={{ cursor: 'pointer' }}>
                      <div style={{ width: '100%', height: '320px', backgroundColor: '#e4e4e4', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden' }}>
                        {movie.image_url && String(movie.image_url).trim() !== "" ? (
                          <img 
                            src={movie.image_url} 
                            alt={movie.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              console.warn("Source blocked. Reverting to local asset.");
                              e.target.src = "/balan.jpg"; 
                            }}
                          />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '50px' }}>🎬</div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000000cc', padding: '8px', color: '#fff', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>👍 17.4K+ Likes</span>
                          <span>🌐 {movie.language}</span>
                        </div>
                      </div>
                      <h3 style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#222', fontWeight: 'bold' }}>{movie.title}</h3>
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{movie.duration_minutes} mins • Drama/Thriller</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Hero Movie Details Banner Section */}
              <div style={{ backgroundColor: '#1f2533', padding: '40px 50px', color: '#ffffff', display: 'flex', gap: '30px', alignItems: 'center' }}>
                <div style={{ width: '220px', height: '300px', backgroundColor: '#333', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 6px 12px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {selectedMovie.image_url && String(selectedMovie.image_url).trim() !== "" ? (
                    <img 
                      src={selectedMovie.image_url} 
                      alt={selectedMovie.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.src = "/balan.jpg"; }}
                    />
                  ) : (
                    <span style={{ fontSize: '40px' }}>🎬</span>
                  )}
                </div>
                <div>
                  <h1 style={{ fontSize: '36px', margin: '0 0 15px 0', fontWeight: 'bold' }}>{selectedMovie.title}</h1>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ backgroundColor: '#ffffff22', padding: '4px 8px', borderRadius: '3px', fontSize: '12px' }}>2D</span>
                    <span style={{ backgroundColor: '#ffffff22', padding: '4px 8px', borderRadius: '3px', fontSize: '12px' }}>{selectedMovie.language}</span>
                  </div>
                  <p style={{ fontSize: '15px', color: '#ccc', maxWidth: '600px', margin: '0 0 20px 0' }}>{selectedMovie.description}</p>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setSelectedMovie(null)} style={{ backgroundColor: '#f84464', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                      Change Movie
                    </button>
                    {selectedMovie.trailer_url && (
                      <button 
                        onClick={() => window.open(selectedMovie.trailer_url, '_blank')} 
                        style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
                      >
                        ▶ Watch Trailer
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Date Selector Timeline Strip */}
              <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '10px 50px', display: 'flex', gap: '15px' }}>
                {[0, 1, 2, 3, 4, 5].map(offset => {
                  const dateObj = new Date();
                  dateObj.setDate(dateObj.getDate() + offset);
                  const dateStr = dateObj.toISOString().split('T')[0];
                  const isActive = selectedDate === dateStr;

                  return (
                    <button key={dateStr} onClick={() => setSelectedDate(dateStr)} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: isActive ? '#f84464' : 'transparent', color: isActive ? '#fff' : '#333', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>{dateObj.toLocaleDateString([], { weekday: 'short' })}</div>
                      <div style={{ fontSize: '18px' }}>{dateObj.getDate()}</div>
                    </button>
                  );
                })}
              </div>

              {/* Theater Showtime Cards Layout */}
              {!selectedShow && (
                <div style={{ padding: '30px 50px', maxWidth: '1000px', margin: '0 auto' }}>
                  {loadingShows ? (
                    <p>Loading active theater allocations...</p>
                  ) : shows.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#777', fontStyle: 'italic' }}>ℹ️ No shows scheduled for this specific calendar day.</p>
                  ) : (
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', padding: '20px' }}>
                      {shows.map(show => (
                        <div key={show.id} style={{ display: 'flex', padding: '25px 0', borderBottom: '1px solid #f2f2f2', alignItems: 'center' }}>
                          <div style={{ width: '350px' }}>
                            <strong style={{ fontSize: '16px', color: '#333' }}>{show.theatre_name}</strong>
                            <div style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>{show.screen_name} • Cancellation Available</div>
                          </div>
                          <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => handleShowtimeClick(show)} style={{ padding: '10px 20px', border: '1px solid #49ba6f', borderRadius: '4px', backgroundColor: 'transparent', color: '#49ba6f', fontWeight: 'bold', cursor: 'pointer' }}>
                              {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              <div style={{ fontSize: '10px', color: '#999', fontWeight: 'normal', marginTop: '2px' }}>₹{show.price}</div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Multi-Tier Seating Grid Dashboard */}
              {selectedShow && (
                <div style={{ backgroundColor: '#ffffff', padding: '40px 20px', marginTop: '20px', borderTop: '1px solid #ddd' }}>
                  <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '20px', margin: 0 }}>{selectedShow.theatre_name} - {selectedShow.screen_name}</h2>
                    <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 30px 0' }}>
                      ⏱️ {new Date(selectedShow.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Selected Seats: <strong>{chosenSeats.length} / {selectedQty}</strong>
                    </p>

                    <div style={{ overflowX: 'auto', padding: '20px 0', backgroundColor: '#fcfcfc', borderRadius: '8px', border: '1px dashed #ddd', marginBottom: '30px' }}>
                      {/* TIER 1: EXECUTIVE */}
                      <div style={{ borderBottom: '1px dashed #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '11px', color: '#999', textAlign: 'left', marginLeft: '50px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
                          EXECUTIVE - ₹{selectedShow.price}
                        </div>
                        {executiveRows.map(row => renderSeatRow(row))}
                      </div>

                      {/* TIER 2: DRESS CIRCLE */}
                      <div>
                        <div style={{ fontSize: '11px', color: '#999', textAlign: 'left', marginLeft: '50px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
                          DRESS CIRCLE - ₹105.00
                        </div>
                        {dressCircleRows.map(row => renderSeatRow(row))}
                      </div>

                      {/* Screen Projection Vector Element */}
                      <div style={{ width: '50%', margin: '60px auto 10px auto' }}>
                        <div style={{ height: '4px', backgroundColor: '#999', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', borderRadius: '2px' }} />
                        <small style={{ display: 'block', color: '#aaa', marginTop: '8px', fontSize: '11px', letterSpacing: '2px' }}>ALL EYES THIS WAY (SCREEN)</small>
                      </div>
                    </div>

                    {/* Sticky Payment Summary Bar */}
                    {chosenSeats.length > 0 && (
                      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', padding: '15px 50px', boxShadow: '0 -4px 15px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
                        <div>
                          <div style={{ fontSize: '14px', color: '#555' }}>Selected Seats: <strong style={{ color: '#f84464' }}>{chosenSeats.join(', ')}</strong></div>
                          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', marginTop: '2px' }}>Total Amount: ₹{chosenSeats.length * parseFloat(selectedShow.price)}</div>
                        </div>
                        <button 
                          onClick={() => {
                            axios.post(
                              'http://127.0.0.1:8000/api/bookings/create/', 
                              { show_id: selectedShow.id, seats: chosenSeats },
                              { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
                            )
                            .then(response => {
                              alert(`🎉 Booking Confirmed!\nBooking ID: #BMS-${response.data.booking_id}\nSeats: ${chosenSeats.join(', ')}`);
                              setChosenSeats([]);
                              setSelectedShow(null);
                              fetchShowtimes();
                            })
                            .catch(err => alert("Failed to book coordinates. Please check your login session."));
                          }}
                          style={{ backgroundColor: '#f84464', color: 'white', border: 'none', padding: '15px 45px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 8px rgba(248, 68, 100, 0.3)' }}
                        >
                          Proceed to Pay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pop-Up Modal: Ticket Quantity Selector */}
      {showQtyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000088', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', width: '450px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#222' }}>How many seats?</h3>
            <div style={{ fontSize: '60px', margin: '20px 0' }}>🛵</div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '25px 0' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedQty(num)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                    backgroundColor: selectedQty === num ? '#f84464' : '#ffffff',
                    color: selectedQty === num ? '#ffffff' : '#333',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.1s'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #eee', display: 'flex', gap: '15px', marginTop: '20px', paddingTop: '15px' }}>
              <button onClick={() => setShowQtyModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#666', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmQtySelection} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#f84464', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Select Seats</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;