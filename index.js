import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul className="list-group list-group-horizontal list-group-flush">
            <li className="list-group-item">
              {' '}
              <Link to="/">Home</Link>{' '}
            </li>
            <li className="list-group-item"> 
              {' '}
              <Link to="/location">List of Locations</Link>{' '}
            </li>
            <li className="list-group-item">
              {' '}
              <Link to="/slideshow">List of Events</Link>{' '}
            </li>
            <li className="list-group-item">
              {' '}
              <Link to="/slideshow">Map</Link>{' '}
            </li>
            <li className="list-group-item">
              {' '}
              <Link to="/slideshow">Favourite</Link>{' '}
            </li>
            <li className="list-group-item">
              {' '}
              <Link to="/slideshow">No Idea?</Link>{' '}
            </li>
           
          </ul>
        </div>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Locations />} />
         
        </Routes>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component {
  
  render() {
    return (
      <div>
        
      
      </div>
    
  )
  }
}

class Locations extends React.Component {
  render() {
    return(
      <div style={{padding: '20px'}}>
          <LocationHeader />
          <LocationList />
      </div>
  );
  }
}

class LocationHeader extends React.Component {
  render() {
      return (
          <header>
              <h1>Locations</h1>
              
          </header>
      );
  }
}


class LocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      venues: []

    } // Regular array to hold events
}
 

async fetchVenues() {
  
      fetch('http://localhost:5000/location').then(res=>res.json())
      .then(data=>{
        this.setState({venues:data});
      })
      
  
}
small2Large= () =>{
  const array = [...this.state.venues].sort((x, y) => x.count - y.count);
  // Update state with sorted array
  this.setState({venues: array });
}

large2Small= () =>{
  const array = [...this.state.venues].sort((x, y) => y.count - x.count);
  // Update state with sorted array
  this.setState({venues: array });
}

componentDidMount() {
  this.fetchVenues(); // Fetch events when the component mounts
}

  render() {
    let {venues} = this.state;
      return (
          <div>
            <table className="table table-success table-striped">
              <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Location</th>
                <th scope="col">Number of Events
                  
                    <svg style={{position:'relative', top:'-12px', left:'10px'}} onClick={this.small2Large} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" >
                        <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
                    </svg>
                    <svg style={{position:'relative', top:'7px', left:'-6px'}} onClick={this.large2Small} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                    </svg>
                  
                </th>
                <th scope="col">Add to Favourite</th>
              </tr>
              </thead>
              <tbody>
              {venues.map((venue, index)=>
              <tr key={index}>
                <th  scope="row">{venue.venueid}</th>
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
