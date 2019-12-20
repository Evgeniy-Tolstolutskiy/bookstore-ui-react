import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import history from 'browserHistory';
import authenticationService from 'authenticationService';
import PrivateRoute from 'PrivateRoute';
import Books from 'Books';
import Cart from 'Cart';
import Login from 'Login';
import Orders from 'Orders';
import Profile from 'Profile';
import Book from 'Book';
import Users from 'Users';
import decode from 'jwt-decode';
import {logout} from "logout";

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          currentUser: null,
          tokenPayload: '',
          username: ''
      };

      this.initCurrentUserAndToken = this.initCurrentUserAndToken.bind(this);
  }

  componentDidMount() {
      this.initCurrentUserAndToken();
  }

  initCurrentUserAndToken() {
      authenticationService.currentUser.subscribe(x => this.setState({
          currentUser: x,
          tokenPayload: x ? decode(x.access_token) : '',
          username: x ? x.username : ''
      }));
  }

  render() {
      const { currentUser, tokenPayload, username } = this.state;
      return (
          <Router history={history}>
              {currentUser &&
                  <header>
                      <h2 className="helloMessage">Hello {username}</h2>
                      <nav className="navbar navbar-expand-md">
                          <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                              <ul className="navbar-nav mr-auto">
                                  <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                                  {tokenPayload.authorities[0] === 'ROLE_USER' && <li className="nav-item"><Link to="/cart" className="nav-link">Cart</Link></li>}
                                  {tokenPayload.authorities[0] === 'ROLE_USER' && <li className="nav-item"><Link to="/orders" className="nav-link">Orders</Link></li>}
                                  {tokenPayload.authorities[0] === 'ROLE_ADMIN' && <li className="nav-item"><Link to="/users" className="nav-link">Users</Link></li>}
                                  <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>
                                  <li className="nav-item"><a onClick={ () => { logout(this) }} className="nav-link">Logout</a></li>
                              </ul>
                          </div>
                      </nav>
                  </header>
              }
              <div className="container">
                  <PrivateRoute exact path="/" component={Books} />
                  <PrivateRoute path="/cart" component={Cart} />
                  <PrivateRoute path="/orders" component={Orders} />
                  <PrivateRoute path="/profile" component={Profile} context={this}/>
                  <PrivateRoute path="/users" component={Users} />
                  <PrivateRoute path="/book/:id?" component={Book} />
                  <Route path="/registration" component={Profile} />
                  <Route path="/login" render={(props) => <Login callbackFunction={this.initCurrentUserAndToken} {...props} />} />
              </div>
          </Router>
      );
  }
}

export default App;
