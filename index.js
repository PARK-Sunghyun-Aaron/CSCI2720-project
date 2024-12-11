import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { model } from 'mongoose';

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
                  <Link to="/favourite" className="nav-link text-primary">Favourite</Link>{' '}
                </li>
                <li className="nav-item">
                  {' '}
                  <Link to="/noidea" className="nav-link text-primary">No Idea?</Link>{' '}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Locations />} />
          <Route path="/event" element={<Events />} />

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

    fetch('http://localhost:5000/event').then(res => res.json())
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
      venues: [], //this array is for display, can be modified
      modelArray: [], // this array save 10 venues, will not be modified
      input: ''

    }
  }


  async fetchVenues() {

    fetch('http://localhost:5000/location').then(res => res.json())
      .then(data => {
        this.setState({
          modelArray: data,
          venues: data
        });
      })


  }

  //sort the array from small to large
  small2Large = () => {
    const array = [...this.state.modelArray].sort((x, y) => x.count - y.count);
    // Update state with sorted array
    this.setState({
      venues: array,
      modelArray: array
    });
  }

  //sort the array from large to small
  large2Small = () => {
    const array = [...this.state.modelArray].sort((x, y) => y.count - x.count);
    // Update state with sorted array
    this.setState({
      venues: array,
      modelArray: array
    });
  }

  componentDidMount() {
    this.fetchVenues(); // Fetch events when the component mounts
  }

  //search location
  searchLocation = (event) => {
    this.setState({ input: event.target.value.toLowerCase() }, () => {
      if (event.target.value != '') {
        this.setState({
          venues: this.state.modelArray.filter(e => e.location.toLowerCase().includes(this.state.input))
        })
      } else {
        this.setState({ venues: this.state.modelArray })
      }
    }

    );
  }

  render() {
    let { venues } = this.state;
    return (
      <div>
        <nav class="navbar navbar-expand-sm bg-body-tertiary">
          <div class="container-fluid">

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <h1>Locations</h1>
                </li>
                <li class="nav-item">

                </li>

                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>
                <li class="nav-item">

                </li>
              </ul>
              <div class="d-flex">
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                    height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg></span>
                  <input type="text" class="form-control" placeholder="Search" aria-label="search"
                    aria-describedby="basic-addon1" onInput={event => this.searchLocation(event)} />
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

                <svg style={{ position: 'relative', top: '-12px', left: '10px' }} onClick={this.small2Large} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" >
                  <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z" />
                </svg>
                <svg style={{ position: 'relative', top: '7px', left: '-6px' }} onClick={this.large2Small} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                </svg>

              </th>
              <th scope="col">Add to Favourite</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue, index) =>
              <tr key={index}>
                <th scope="row">{venue.venueid}</th>
                <th>{venue.location}</th>
                <th>{venue.count}</th>
                <th>
                  <input type="checkbox" />
                </th>

              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}



const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);
