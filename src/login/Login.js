import React from 'react';
import { Link } from 'react-router-dom';

import authenticationService from '../authenticationService';

class Login extends React.Component {
    constructor(props) {
        super(props);

        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }

        this.state = {login: '', password: '', currentUser: false};

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        authenticationService.login(this.state.login, this.state.password)
            .then(
                user => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from);
                    this.props.callbackFunction();
                },
                error => {

                }
            );
            event.preventDefault();
    }

    onChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
              <form onSubmit={this.onSubmit}>
                <p><label> Email: <input type="text" name="login" value={this.state.login}
                                 onChange={this.onChange}/></label></p>
                <p><label> Password: <input type="password" name="password" value={this.state.password}
                                  onChange={this.onChange}/></label></p>
                <p><input type="submit" value="Submit" /></p>
              </form>
              <Link to="/registration">Registration</Link>
            </div>
        )
    }
}

export default Login;
