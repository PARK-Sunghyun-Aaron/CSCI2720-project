//npm install react react-dom react-scripts react-router-dom bootstrap --legacy-peer-deps
import ReactDOM from 'react-dom/client';
import React, {useEffect, useState, useRef} from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation} from 'react-router-dom';
import { model } from 'mongoose';
import GoogleMapReact from 'google-map-react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

let venueShown = [];
const venuesArray = [
  {
      "_id": "675c4abbbdb5ce79de90ca18",
      "venueid": "36311771",
      "location": "Sha Tin Town Hall (Music Studio)",
      "latitude": "22.38136",
      "longitude": "114.18990",
      "count": 40,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca16",
      "venueid": "3110267",
      "location": "North District Town Hall (Function Room 2)",
      "latitude": "22.501639",
      "longitude": "114.128911",
      "count": 29,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca17",
      "venueid": "50110014",
      "location": "Hong Kong Cultural Centre (Concert Hall)",
      "latitude": "22.29386",
      "longitude": "114.17053",
      "count": 14,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca19",
      "venueid": "36310037",
      "location": "Sha Tin Town Hall (Exhibition Gallery)",
      "latitude": "22.38136",
      "longitude": "114.18990",
      "count": 3,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca1a",
      "venueid": "76810294",
      "location": "Tuen Mun Town Hall (Dance Studio)",
      "latitude": "22.391810",
      "longitude": "113.976771",
      "count": 18,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca1d",
      "venueid": "36310566",
      "location": "Sha Tin Town Hall (Conference Room)",
      "latitude": "22.38136",
      "longitude": "114.18990",
      "count": 29,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca1e",
      "venueid": "76810295",
      "location": "Tuen Mun Town Hall (Music Studio)",
      "latitude": "22.391810",
      "longitude": "113.976771",
      "count": 23,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca1f",
      "venueid": "87311966",
      "location": "Yuen Long Theatre (Function Room)",
      "latitude": "22.44152",
      "longitude": "114.02289",
      "count": 13,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca1b",
      "venueid": "36310035",
      "location": "Sha Tin Town Hall (Auditorium)",
      "latitude": "22.38136",
      "longitude": "114.18990",
      "count": 17,
      "__v": 0
  },
  {
      "_id": "675c4abbbdb5ce79de90ca1c",
      "venueid": "87210045",
      "location": "Tsuen Wan Town Hall (Auditorium)",
      "latitude": "22.37109",
      "longitude": "114.11277",
      "count": 9,
      "__v": 0
  }
]

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  {' '}
                  <Link to="/" className="nav-link text-primary">Home</Link>{' '}
                </li>
                <li className="nav-item">
                  {' '}
                  <Link to="/location" className="nav-link text-primary">List of Locations</Link>{' '}
                </li>
                <li className="nav-item">
                  {' '}
                  <Link to="/event" className="nav-link text-primary">List of Events</Link>{' '}
                </li>

                <li classNames="nav-item">
                  {' '}
                  <Link to="/map" className="nav-link text-primary">Map</Link>{' '}
                </li>
                <li classNames="nav-item">
                  {' '}
                  <Link to="/favorites" className="nav-link text-primary">Favourite</Link>{' '}
                </li>
              </ul>
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
        <span className="navbar-text me-3">Hello, user</span>
        <button className="btn btn-outline-danger">Logout</button>
        </li>
      </ul>
            </div>
          </div>
        </nav>
        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Locations />} />
          <Route path="/map" element={<Map />} />
           <Route path="/favorites" element={<Favorites />} />
          <Route path="/event" element={<Events />} />
          <Route path="/location/:id" element={<LocationDetail venuesArray={venuesArray} />} />

        </Routes>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component {

  render() {
    return (
      <div>
        <div className="container">
          <div className="row" style={{ padding: '100px' }}>
            <div className="col-sm">
              <a href='/event'>
                <img src="./images/event.jpg" alt="Event" width="450" height="250" /></a>
              <a href='/event' style={{ position: 'relative', right: '250px', top: '170px', fontSize: '30px' }}>Event</a>
            </div>

            <div className="col-sm">
              <a href='/location'>
                <img src="./images/location.jpg" alt="Event" width="450" height="250" /></a>
              <a a href='location' style={{ position: 'relative', left: '160px', top: '10px', fontSize: '30px' }}>Location</a>
            </div>
          </div>

          <div className="row" style={{ padding: '20px 100px 20px 100px' }}>
            <div className="col-sm">
              <a href='/map'>
                <img src="./images/map.jpg" alt="Event" width="450" height="250" /></a>
              <a a href='/map' style={{ position: 'relative', right: '250px', top: '160px', fontSize: '30px' }}>Map</a>
            </div>

            <div className="col-sm">
              <a href='/favourite'>
                <img src="./images/favourite.jpg" alt="Event" width="450" height="250" /></a>
              <a a href='/favourite' style={{ position: 'relative', left: '160px', top: '10px', fontSize: '30px' }}>Favourite</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Locations extends React.Component {
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <LocationList />
      </div>
    );
  }
}





class Events extends React.Component {
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <EventHeader />
        <EventList />
      </div>
    );
  }
}

class EventHeader extends React.Component {
  render() {
    return (
      <header>
        <h1 style={{ backgroundColor: 'rgb(255, 230, 133)' }}>Events</h1>

      </header>
    );
  }
}


class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventshown: [],
      selectedid: null

    }
  }
  async fetchEvents() {

    fetch('http://localhost:5001/event').then(res => res.json())
      .then(data => {
        this.setState({ events: data }, () => {
          // This callback function runs after `events` has been set
          const array = this.state.events.slice(0, 10);
          this.setState({ eventshown: array });
        });
      })


  }

  refresh = () => {
    this.setState({
      eventshown: this.state.events.sort(() => 0.5 - Math.random()).slice(0, 10)
    })
  }

  addDescription = (id) => {
    this.setState({ selectedid: id })

  }

  componentDidMount() {
    this.fetchEvents(); // Fetch events when the component mounts

  }

  render() {
    let { eventshown } = this.state;
    const selectedEvent = this.state.events.find(event => event.eventid === this.state.selectedid);
    return (
      <div>
        <table className="table table-warning table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Date</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {eventshown.map((event, index) =>
              <tr key={index}>
                <th scope="row">{event.eventid}</th>
                <th>{event.title} <button type="button" className="btn btn-outline-primary" onClick={() => this.addDescription(event.eventid)}>description</button></th>
                <th>{event.date}</th>
                <th>
                  {event.duration}
                </th>

              </tr>)}
          </tbody>
        </table>
        <button style={{ position: 'relative', left: '1500px' }} onClick={this.refresh}>New events</button>

        {selectedEvent && (
          <div style={{ position: 'relative', top: '30px' }}>
            <h2 style={{ backgroundColor: 'rgb(255, 230, 133)' }}>Event Description:</h2>
            <table className='table table-warning table-striped'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{selectedEvent.eventid}</th>
                  <th>{selectedEvent.descre}</th>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    );
  }

}

class LocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: [], // this array is for display, can be modified
      modelArray: [], // this array save 10 venues, will not be modified
      input: '',
      favorites: JSON.parse(localStorage.getItem('favorites')) || [] // Track favorite venues
    };
  }

  async fetchVenues() {
    fetch('http://localhost:5001/location')
      .then(res => res.json())
      .then(data => {
        this.setState({
          modelArray: data,
          venues: data
        });
      });
  }

  // Sort the array from small to large
  small2Large = () => {
    const array = [...this.state.modelArray].sort((x, y) => x.count - y.count);
    this.setState({
      venues: array,
      modelArray: array
    });
  }

  // Sort the array from large to small
  large2Small = () => {
    const array = [...this.state.modelArray].sort((x, y) => y.count - x.count);
    this.setState({
      venues: array,
      modelArray: array
    });
  }

  componentDidMount() {
    this.fetchVenues(); // Fetch events when the component mounts
  }

  // Search location
  searchLocation = (event) => {
    this.setState({ input: event.target.value.toLowerCase() }, () => {
      if (event.target.value !== '') {
        this.setState({
          venues: this.state.modelArray.filter(e => e.location.toLowerCase().includes(this.state.input))
        });
      } else {
        this.setState({ venues: this.state.modelArray });
      }
    });
  }

  render() {
    const { venues, favorites } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand-sm bg-body-tertiary">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <h1>Locations</h1>
                </li>
              </ul>
              <div className="d-flex">
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                  </span>
                  <input type="text" className="form-control" placeholder="Search" aria-label="search" aria-describedby="basic-addon1" onInput={this.searchLocation} />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <table className="table table-success table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Location</th>
              <th scope="col">Number of Events
                <svg style={{ position: 'relative', top: '-12px', left: '10px' }} onClick={this.small2Large} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z" />
                </svg>
                <svg style={{ position: 'relative', top: '7px', left: '-6px' }} onClick={this.large2Small} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue, index) => (
              <tr key={index}>
                <th scope="row">{venue.venueid}</th>
                <th><Link to={`/location/${venue.venueid}`}>{venue.location}</Link></th>
                <th>{venue.count}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

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
                <li><a href="/location/36311771">Sha Tin Town Hall (Music Studio)</a></li>
                <li><a href="/location/36310037">Sha Tin Town Hall (Exhibition Gallery)</a></li>
                <li><a href="/location/36310566">Sha Tin Town Hall (Conference Room)</a></li>
                <li><a href="/location/36310035">Sha Tin Town Hall (Auditorium)</a></li>
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
                <li><a href="/location/3110267">North District Town Hall (Function Room 2)</a></li>
              </ul>
            </div>
          `,
        },
        {
          position: { lat: 22.293848, lng: 114.170320 },
          content: `
            <div>
              <h3>Venues at this location:</h3>
              <ul>
                <li><a href="/location/50110014">Hong Kong Cultural Centre (Concert Hall)</a></li>
              </ul>
            </div>
          `,
        },
        {
          position: { lat: 22.391904, lng: 113.976695},
          content: `
            <div>
              <h3>Venues at this location:</h3>
              <ul>
                <li><a href="/location/76810294">Tuen Mun Town Hall (Dance Studio)</a></li>
              </ul>
              <ul>
                <li><a href="/location/76810295">Tuen Mun Town Hall (Music Studio)</a></li>
              </ul>
            </div>
          `,
        },
        {
          position: { lat: 22.441739, lng: 114.022941},
          content: `
            <div>
              <h3>Venues at this location:</h3>
              <ul>
                <li><a href="/location/87311966">Yuen Long Theatre (Function Room)</a></li>
              </ul>
            </div>
          `,
        },
        {
          position: { lat: 22.371036, lng: 114.112746},
          content: `
            <div>
              <h3>Venues at this location:</h3>
              <ul>
                <li><a href="/location/87210045">Tsuen Wan Town Hall (Auditorium)</a></li>
              </ul>
            </div>
          `,
        }
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
    const toastElement = toastRef.current;
    if (toastElement && window.bootstrap && window.bootstrap.Toast) {
      const toast = new window.bootstrap.Toast(toastElement);
      toast.show();

      const timer = setTimeout(() => {
        toast.hide();
        if (onClose) {
          onClose();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
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


const LocationDetail = ({ venuesArray }) => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [toast, setToast] = useState(null);
  const [newComment, setNewComment] = useState({
    email: "",
    text: "",
    color: "red",
  });

  useEffect(() => {
    if (venuesArray.length > 0) {
      const foundLocation = venuesArray.find((venue) => venue.venueid === id);
      setLocation(foundLocation);
      setLoading(false);

      const savedComments = JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
      setComments(savedComments);
    }

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

    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));

    setNewComment({ email: "", text: "" });
    setToast({
      message: "Comment posted successfully!",
      type: "success",
      style: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
      },
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
      setToast({
        message: "Removed from favorites!",
        type: "danger",
        style: { position: "fixed", top: "20px", right: "20px", zIndex: 1050 },
      });
    } else {
      const newFavorite = {
        id: location.venueid,
        location: location.location,
        latitude: location.latitude,
        longitude: location.longitude,
        count: location.count,
      };
      const updatedFavorites = [...favorites, newFavorite];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      setToast({
        message: "Added to favorites!",
        type: "success",
        style: { position: "fixed", top: "20px", right: "20px", zIndex: 1050 },
      });
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
      <button className="btn btn-primary" onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Event Count: {location.count}</p>

      <h2>{location.location}</h2>
      <div id="map" style={{ width: "100%", height: "400px", marginBottom: "20px" }}></div>

      {location.latitude && location.longitude && (
        <GoogleMap
          latitude={parseFloat(location.latitude)}
          longitude={parseFloat(location.longitude)}
        />
      )}

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

      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={index} style={{ color: comment.color }}>
              ({comment.date}): {comment.text}
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
              <strong>{fav.location}</strong> (Lat: {fav.latitude}, Lng: {fav.longitude}, Count: {fav.count})
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
