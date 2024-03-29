import React from 'react';
import moment from 'moment';
import authenticationService from 'authenticationService';
import handleResponse from 'handleResponse';
import authHeader from 'authHeader';
import Modal from "react-modal";
import {logout} from "logout";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            birthday: '',
            gender: 'M',
            success: '',
            failure: '',
            formErrors: { username: '', password: '', confirmPassword: '', email: '', birthday: '', gender: '' },
            formValid: false,
            submitted: false,
            isModalOpened: false
        };

        this.removeCurrentUser = this.removeCurrentUser.bind(this);
        this.loadUser = this.loadUser.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (authenticationService.currentUserValue) {
            this.loadUser();
        }
    }

    loadUser() {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        fetch(`${process.env.API_URL}/users/me`, requestOptions)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    id: response.id,
                    username: response.username,
                    password: '',
                    confirmPassword: '',
                    email: response.email,
                    birthday: moment(new Date(response.birthday)).format('YYYY-MM-DD'),
                    gender: response.gender
                });
            });
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
        this.validateField(event.target.name, event.target.value);
    }

    validateConfirmPassword(password, confirmPassword, fieldValidationErrors) {
        if (password !== confirmPassword) {
            fieldValidationErrors.confirmPassword = 'Passwords are not equal';
        } else {
            fieldValidationErrors.confirmPassword = '';
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        switch(fieldName) {
            case 'username':
                fieldValidationErrors.username = value !== '' ? '' : 'Username is required';
                break;
            case 'password':
                if (!value) {
                    fieldValidationErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    fieldValidationErrors.password = 'Password is too short';
                } else {
                    fieldValidationErrors.password = '';
                }

                this.validateConfirmPassword(value, this.state.confirmPassword, fieldValidationErrors);
                break;
            case 'confirmPassword':
                this.validateConfirmPassword(this.state.password, value, fieldValidationErrors);
                break;
            case 'email':
                fieldValidationErrors.email = value !== '' ? '' : 'Email is required';
                break;
            case 'birthday':
                fieldValidationErrors.birthday = value !== '' ? '' : 'Birthday is required';
                break;
            case 'gender':
                fieldValidationErrors.gender = value !== '' ? '' : 'Gender is required';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors, formValid:
          !fieldValidationErrors.username && !fieldValidationErrors.password && !fieldValidationErrors.birthday
          && !fieldValidationErrors.confirmPassword && !fieldValidationErrors.email && !fieldValidationErrors.gender});
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({
            success: '',
            failure: '',
            submitted: true
        });
        for (let [key, value] of Object.entries(this.state)) {
            this.validateField(key, value);
        }

        if (!this.state.formValid) {
            return;
        }

        if (authenticationService.currentUserValue) {
            const requestOptions = {
                method: 'PUT',
                headers: {Authorization: authHeader().Authorization, 'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
            };
            fetch(`${process.env.API_URL}/users`, requestOptions)
                .then(handleResponse)
                .then(() => {
                    this.setState({
                        success: 'User successfully updated',
                        failure: ''
                    });
                }).catch(errors => {
                    this.setState({
                        failure: errors[0].code,
                        success: ''
                    });
                });
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            };
            fetch(`${process.env.API_URL}/users/registration`, requestOptions)
                .then(handleResponse)
                .then(() => {
                    this.setState({
                        username: '',
                        password: '',
                        confirmPassword: '',
                        email: '',
                        birthday: '',
                        gender: 'M',
                        formErrors: { username: '', password: '', confirmPassword: '', email: '', birthday: '', gender: '' },
                        formValid: false,
                        submitted: false,
                        success: 'User successfully registered',
                        failure: ''
                    });
                }).catch(errors => {
                    this.setState({
                        failure: errors[0].code,
                        success: ''
                    });
                });
        }
    }

    removeCurrentUser() {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader()
        };
        fetch(`${process.env.API_URL}/users/me`, requestOptions)
            .then(handleResponse)
            .then(() => logout(this.props.context));
    }

    render() {
        return (
            <div className="container" style={{width: '50%'}}>
                { !this.state.id && <h2>Register</h2> }
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" className="form-control" value={this.state.username} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.username}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.password}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input type="password" name="confirmPassword" className="form-control" value={this.state.confirmPassword} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.confirmPassword}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" className="form-control" value={this.state.email} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.email}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthday">Birthday</label>
                        <input type="date" name="birthday" className="form-control" value={this.state.birthday} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.birthday}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select name="gender" className="form-control" value={this.state.gender} onChange={this.onChange} >
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.gender}</div> }
                    </div>
                    <div className="btn-toolbar">
                        <input type="submit" value={this.state.id ? 'Update' : 'Register'} className="btn btn-primary" />
                        { this.state.id && <input type="button" value="Delete" className="btn btn-danger" onClick={ () => {this.setState({isModalOpened: true})} } /> }
                        <Modal
                            isOpen={this.state.isModalOpened}
                            contentLabel="Confirm delete"
                            style={customStyles}
                        >
                            <h2>Confirm delete</h2>
                            <div>Please confirm that you really want to delete account</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.removeCurrentUser}>Delete</button>
                                <button onClick={
                                    () => {
                                        this.setState({isModalOpened: false})
                                    }
                                } type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </Modal>
                    </div>
                    <div className="text-success">{this.state.success}</div>
                    <div className="text-danger">{this.state.failure}</div>
                </form>
            </div>
        );
    }

}

export default Profile
