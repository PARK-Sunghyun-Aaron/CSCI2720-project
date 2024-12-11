// copy Favourites, Map, Toast, GoogleMaps, LocationDetail
import ReactDOM from 'react-dom/client';
import React, {useEffect, useState, useRef} from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useParams , useLocation } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


//For storing event
let eventsArray = [];
//For storing all venues
let venuesArray = [];
//For storing venues with latitude and longitude
let newvenueArray =[];
//For storing 10 venues with events >=3
let venueShown = [];

// Map Component
const Map = () => {

  const navigate = useNavigate();
  React.useEffect(() => {
    // Load Google Maps script dynamically
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6SJqInCt0heffya0W622QSkiaoXDHKFA`;
    googleMapsScript.async = true;
    googleMapsScript.onload = initMap;
    document.body.appendChild(googleMapsScript);

    // Initialize the map
    function initMap() {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 22.444477, lng: 114.165562 },
        zoom: 11,
      });

      const markers = [
        {
          position: { lat: 22.38136, lng: 114.18990 },
          content: `
            <div>
              <h3>Venues at this location:</h3>
              <ul>
                <li><a href="/location/36310037">Sha Tin Town Hall (Exhibition Gallery)</a></li>
                <li><a href="/location/36310036">Sha Tin Town Hall (Cultural Activities Hall)</a></li>
                <li><a href="/location/36310035">Sha Tin Town Hall (Auditorium)</a></li>
                <li><a href="/location/36310593">Sha Tin Town Hall (Lecture Room 1)</a></li>
                <li><a href="/location/36310594">Sha Tin Town Hall (Lecture Room 2)</a></li>
                <li><a href="/location/36310304">Sha Tin Town Hall (Dance Studio)</a></li>
                <li><a href="/location/36310566">Sha Tin Town Hall (Conference Room)</a></li>
              </ul>
            </div>
          `,
        },
        {
          position: { lat: 22.501639, lng: 114.128911 },
          content: `
            <div>
              <h3>Venues at this location:</h3>
              <ul>
                <li><a href="/location/3110031">North District Town Hall (Auditorium)</a></li>
                <li><a href="/location/3110565">North District Town Hall (Function Room 1)</a></li>
                <li><a href="/location/3110267">North District Town Hall (Function Room 2)</a></li>
              </ul>
            </div>
          `,
        },
      ];

      //10 locations (latitude and longitude)
      const locations = [
        { lat: 22.38136, lng: 114.18990}, 
        { lat: 22.38136, lng: 114.18990}, 
        { lat: 22.38136, lng: 114.18990},
        { lat: 22.501639, lng:114.128911},
        { lat: 22.38136, lng: 114.18990},
        { lat: 22.38136, lng: 114.18990},
        { lat: 22.501639, lng:114.128911},
        { lat: 22.501639, lng:114.128911},
        { lat: 22.38136, lng: 114.18990},
        { lat: 22.38136, lng: 114.18990},
      ]

      // Add markers and InfoWindows to the map
      markers.forEach((markerData, index) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.content,
        });

      
              // Add mouseover event to show the InfoWindow
              marker.addListener('mouseover', () => {
                infoWindow.open(map, marker);
              });
      
              // Add click event to close the InfoWindow
              window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                const closeButton = document.getElementById('close-info-window');
                if (closeButton) {
                  closeButton.addEventListener('click', () => {
                    infoWindow.close();
                  });
                }
              });
      
            });
    }

    return () => {
      // Cleanup the script element on unmount
      document.body.removeChild(googleMapsScript);
    };
  }, [venueShown, navigate]);

  return <div id="map" style={{width:"50%", height: "75vh" }}></div>;
};

const Toast = ({ message, type, onClose, style }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    // Initialize the Bootstrap toast
    const toastElement = toastRef.current;
    const toast = new window.bootstrap.Toast(toastElement);
    toast.show();

    // Automatically close the toast after 3 seconds
    const timer = setTimeout(() => {
      toast.hide();
      if (onClose) {
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={toastRef}
      className={`toast align-items-center text-bg-${type} border-0`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ ...style, zIndex: 1050 }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

/// App Component
const App = () => {
  const [eventsArray, setEventsArray] = useState([]);
  const [venuesArray, setVenuesArray] = useState([]);
  const [venueShown, setVenueShown] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let events = []; // Define events array here

      try {
        const response = await fetch('https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml&time=20241204-1322');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName('event');
        events = Array.from(items).map(item => ({
          id: item.id,
          title: item.getElementsByTagName('titlee')[0].textContent,
          duration: item.getElementsByTagName('progtimee')[0].textContent,
          venue: item.getElementsByTagName('venueid')[0].textContent,
          descre: item.getElementsByTagName('desce')[0].textContent
        }));
        console.log('Fetched events:', events); // Log fetched events
        setEventsArray(events);
      } catch (error) {
        console.error('Error fetching XML data:', error);
      }

      try {
        const response = await fetch('https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml&time=20241204-1325');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName('venue');
        const venues = Array.from(items).map(item => ({
          id: item.id,
          venue: item.getElementsByTagName('venuee')[0].textContent,
          latitude: item.getElementsByTagName('latitude')[0].textContent,
          longitude: item.getElementsByTagName('longitude')[0].textContent,
          count: 0
        }));
        console.log('Fetched venues:', venues); // Log fetched venues
        setVenuesArray(venues);

        const newVenueArray = venues.filter(venue => venue.latitude !== "");
        newVenueArray.forEach(venue => {
          events.forEach(event => {
            if (venue.id === event.venue) {
              venue.count++;
            }
          });
        });

        const sortedVenues = newVenueArray.filter(venue => venue.count >= 3).slice(0, 10).sort((a, b) => a.count - b.count);
        console.log('Sorted venues:', sortedVenues); // Log sorted venues
        setVenueShown(sortedVenues);
      } catch (error) {
        console.error('Error fetching XML data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <ul className="list-group list-group-horizontal list-group-flush">
          <li className="list-group-item">
            <Link to="/">Home</Link>
          </li>
          <li className="list-group-item">
            <Link to="/gallery">List of Locations</Link>
          </li>
          <li className="list-group-item">
            <Link to="/slideshow">List of Ten Venues</Link>
          </li>
          <li className="list-group-item">
            <Link to="/map">Map</Link>
          </li>
          <li className="list-group-item">
            <Link to="/favorites">Favorites</Link> {/* Add this */}
          </li>
          <li className="list-group-item">
            <Link to="/slideshow">No Idea?</Link>
          </li>
        </ul>
      </div>

      <hr />

      <Routes>
        <Route path="/" element={<Home eventsArray={eventsArray} />} />
        <Route path="/gallery" element={<Gallery venuesArray={venuesArray} />} />
        <Route path="/slideshow" element={<Slideshow venueShown={venueShown} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/map" element={<Map venueShown={venueShown} />} />
        <Route path="/location/:id" element={<LocationDetail venuesArray={venuesArray} />} />
      </Routes>
    </BrowserRouter>
  );
};

const Home = ({ eventsArray }) => (
  <div>
    <h1>Events List</h1>
    <ul>
      {eventsArray.map((item, index) => (
        <li key={index}>
          ID: {item.id}, Title: {item.title}
        </li>
      ))}
    </ul>
  </div>
);

const Gallery = ({ venuesArray }) => (
  <div>
    <h1>Venues List</h1>
    <ul>
      {venuesArray.map((item, index) => (
        <li key={index}>
          ID: {item.id}, Venue: {item.venue}, Latitude: {item.latitude === "" ? 0 : item.latitude}, Longitude: {item.longitude}, Count: {item.count}
        </li>
      ))}
    </ul>
  </div>
);

const Slideshow = ({ venueShown }) => (
  <div>
    <h1>10 Venues List</h1>
    <ul>
      {venueShown.map((item, index) => (
        <li key={index}>
          ID: {item.id}, Venue: {item.venue}, Latitude: {item.latitude}, Longitude: {item.longitude}, Count: {item.count}
        </li>
      ))}
    </ul>
  </div>
);

const LocationDetail = ({ venuesArray }) => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // Track if the location is a favorite
  const [comments, setComments] = useState([]); // Store comments for the location
  const [toast, setToast] = useState(null); // Toast state
  const [newComment, setNewComment] = useState({
    email: "",
    text: "",
    color: "red",
  });

  useEffect(() => {
    // Find the location by ID
    
    if (venuesArray.length > 0) {
      const foundLocation = venuesArray.find((venue) => venue.id === id);
      setLocation(foundLocation);
      setLoading(false);

      // Load comments from localStorage
      const savedComments = JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
      setComments(savedComments);
    }

    // Check if this location is already in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some((fav) => fav.id === id));

  }, [venuesArray, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const updatedComments = [
      ...comments,
      {
        text: newComment.text,
        color: "blue",
        date: new Date().toLocaleString(),
      },
    ];

    // Save updated comments to state and localStorage
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));

    // Clear the comment form
    setNewComment({ email: "", text: ""});
    setToast({
      message: "Comment posted successfully!",
      type: "success",
      style: {
        
        position: "fixed",
        bottom: "20px",
        right: "20px",
      }
    });
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!location) {
    return <div>Location not found</div>;
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      setToast({ message: "Removed from favorites!", type: "danger", style: { position: "fixed", top: "20px", right: "20px", zIndex: 1050 }});
    } else {
      const newFavorite = {
        id: location.id,
        venue: location.venue,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const updatedFavorites = [...favorites, newFavorite];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      setToast({ message: "Added to favorites!", type: "success", style: { position: "fixed", top: "20px", right: "20px", zIndex: 1050 } });
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          style={toast.style}
        />
      )}
      <h1>{location.venue}</h1>
      {/* Favorite Button */}
      <button className="btn btn-primary" onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Event Count: {location.count}</p>

      <h2>Venue Location</h2>
      <div id="map" style={{ width: "100%", height: "400px", marginBottom: "20px" }}></div>

      {/* Load the Google Map */}
      {location.latitude && location.longitude && (
        <GoogleMap
          latitude={parseFloat(location.latitude)}
          longitude={parseFloat(location.longitude)}
        />
      )}


      {/* Comment Form */}
      <h2>Add a Comment</h2>
      <form onSubmit={handleCommentSubmit}>
        <div className="mb-4">
          <textarea
            className="form-control"
            id="text"
            name="text"
            value={newComment.text}
            onChange={handleInputChange}
            placeholder="Input your comment here..."
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Comment
        </button>
      </form>

      {/* Display Comments */}
      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={index} style={{ color: comment.color }}>
              <strong>{comment.email}</strong> ({comment.date}): {comment.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

// GoogleMap Component for displaying venue location
const GoogleMap = ({ latitude, longitude }) => {
  useEffect(() => {
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6SJqInCt0heffya0W622QSkiaoXDHKFA`;
    googleMapsScript.async = true;
    googleMapsScript.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      // Add a marker
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "Venue Location",
      });
    };
    document.body.appendChild(googleMapsScript);

    return () => {
      document.body.removeChild(googleMapsScript);
    };
  }, [latitude, longitude]);

  return null;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h1>Favorite Venues</h1>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.id}>
              <strong>{fav.venue}</strong> (Lat: {fav.latitude}, Lng: {fav.longitude})
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => removeFavorite(fav.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorite locations yet.</p>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);
