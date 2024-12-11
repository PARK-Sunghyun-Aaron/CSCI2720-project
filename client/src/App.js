import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile';

const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/admin" component={Admin} />
                <Route path="/user-profile" component={UserProfile} />
            </Switch>
        </Router>
    );
};

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);