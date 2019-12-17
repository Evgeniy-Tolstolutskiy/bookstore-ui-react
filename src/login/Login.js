import React from 'react';
import { Link } from 'react-router-dom';

import authenticationService from '../authenticationService';

class Login extends React.Component {
    constructor(props) {
        super(props);

        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }

        this.state = {
            login: '',
            password: '',
            currentUser: false,
            failure: '',
            formErrors: { login: '', password: '' },
            formValid: false,
            submitted: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({
            failure: '',
            submitted: true
        });

        if (!this.state.formValid) {
            return;
        }

        authenticationService.login(this.state.login, this.state.password)
            .then(
                () => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from);
                    this.props.callbackFunction();
                },
                () => {
                    this.setState({
                        failure: 'Login or password is incorrect.'
                    });
                }
            );
    }

    onChange(event){
        this.setState({[event.target.name]: event.target.value});
        this.validateField(event.target.name, event.target.value);
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        switch(fieldName) {
            case 'login':
                fieldValidationErrors.username = value !== '' ? '' : 'Email is required';
                break;
            case 'password':
                fieldValidationErrors.password = value !== '' ? '' : 'Password is required';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors, formValid:
            !fieldValidationErrors.login && !fieldValidationErrors.password});
    }

    render() {
        return (
            <div className="container" style={{width: '25%'}}>
                <h2>Login</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="login">Email</label>
                        <input type="text" name="login" className="form-control" value={this.state.login} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.login}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.password}</div> }
                    </div>
                    <div className="form-group">
                        <input type="submit" className="btn btn-primary" value="Submit" />
                    </div>
                </form>
                <Link to="/registration">Registration</Link>
                <div className="text-danger">{this.state.failure}</div>
            </div>
        )
    }
}

export default Login;
