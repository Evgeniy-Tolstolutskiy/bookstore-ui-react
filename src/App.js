import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import history from './history';
import authenticationService from './authenticationService';
import PrivateRoute from './PrivateRoute';
import Books from './books/Books';
import Cart from './cart/Cart';
import Login from './login/Login';
import Orders from './orders/Orders';
import Profile from './profile/Profile';
import Book from './book/Book';
import Users from './users/Users';
import decode from 'jwt-decode';
import {logout} from "./logout";

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          currentUser: null,
          tokenPayload: ''
      };

      this.initCurrentUserAndToken = this.initCurrentUserAndToken.bind(this);
  }

  componentDidMount() {
      this.initCurrentUserAndToken();
  }

  initCurrentUserAndToken() {
      authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x, tokenPayload: x ? decode(x.access_token) : '' }));
  }

  render() {
      const { currentUser, tokenPayload } = this.state;
      return (
          <Router history={history}>
              <div>
                  {currentUser &&
                      <nav className="navbar navbar-expand navbar-dark bg-dark">
                          <div className="navbar-nav">
                              <Link to="/" className="nav-item nav-link">Home</Link>
                              {tokenPayload.authorities[0] === 'ROLE_USER' && <Link to="/cart" className="nav-item nav-link">Cart</Link>}
                              {tokenPayload.authorities[0] === 'ROLE_USER' && <Link to="/orders" className="nav-item nav-link">Orders</Link>}
                              {tokenPayload.authorities[0] === 'ROLE_ADMIN' && <Link to="/users" className="nav-item nav-link">Users</Link>}
                              <Link to="/profile" className="nav-item nav-link">Profile</Link>
                              <a onClick={ () => { logout(this) }} className="nav-item nav-link">Logout</a>
                          </div>
                      </nav>
                  }
                  <div className="container">
                      <div className="row">
                          <div className="col-md-6 offset-md-3">
                              <PrivateRoute exact path="/" component={Books} />
                              <PrivateRoute path="/cart" component={Cart} />
                              <PrivateRoute path="/orders" component={Orders} />
                              <PrivateRoute path="/profile" component={Profile} context={this}/>
                              <PrivateRoute path="/users" component={Users} />
                              <PrivateRoute path="/book/:id?" component={Book} />
                              <Route path="/registration" component={Profile} />
                              <Route path="/login" render={(props) => <Login callbackFunction={this.initCurrentUserAndToken} {...props} />} />
                          </div>
                      </div>
                  </div>
              </div>
          </Router>
      );
  }
}

export default App;
