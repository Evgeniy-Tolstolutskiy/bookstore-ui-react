import React from 'react';
import { useParams } from 'react-router-dom';

import authenticationService from '../authenticationService';
import handleResponse from '../handleResponse';
import authHeader from '../authHeader';

class Book extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            price: '',
            photo: '',
            count: '',
            visible: true,
            success: '',
            failure: '',
            photoSuccess: '',
            photoFailure: '',
            formErrors: { name: '', price: '', photo: '', count: '' },
            formValid: false,
            submitted: false
        };

        this.fileInput = React.createRef();
        this.loadBook = this.loadBook.bind(this);
        this.validateField = this.validateField.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.loadBook(this.props.match.params.id);
        }
    }

    loadBook(bookId) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        fetch(`${process.env.REACT_APP_API_URL}/books/${bookId}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    id: response.id,
                    name: response.name,
                    price: response.price,
                    photo: response.photoLink,
                    count: response.count,
                    visible: response.visible
                });
            });
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
        this.validateField(event.target.name, event.target.value);
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        switch(fieldName) {
            case 'name':
                fieldValidationErrors.name = value !== '' ? '' : 'Name is required';
                break;
            case 'price':
                if (value < 0) {
                    fieldValidationErrors.price = 'Price must be greater or equal to 0';
                } else if (!value) {
                    fieldValidationErrors.price = 'Price is required';
                } else {
                    fieldValidationErrors.price = '';
                }
                break;
            case 'count':
                if (value < 0) {
                    fieldValidationErrors.count = 'Count must be greater or equal to 0';
                } else if (!value) {
                    fieldValidationErrors.count = 'Count is required';
                } else {
                    fieldValidationErrors.count = '';
                }
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors, formValid:
                !fieldValidationErrors.name && !fieldValidationErrors.price && !fieldValidationErrors.photo
                && !fieldValidationErrors.count});
    }

    onSubmit(event) {
        this.setState({
            success: '',
            submitted: true
        });

        if (!this.state.formValid) {
            return;
        }

        let headers = {'Content-Type': 'application/json'};
        if (authenticationService.currentUserValue) {
            headers = {Authorization: authHeader().Authorization, 'Content-Type': 'application/json'};
        }
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(this.state)
        };
        fetch(`${process.env.REACT_APP_API_URL}/books/save`, requestOptions)
            .then(handleResponse)
            .then(() => {
                if (this.state.id) {
                    this.setState({
                        success: 'Book successfully updated',
                        failure: ''
                    });
                } else {
                    this.setState({
                        name: '',
                        price: '',
                        count: '',
                        visible: true,
                        formErrors: { name: '', price: '', photo: '', count: '' },
                        formValid: false,
                        submitted: false,
                        success: 'Book successfully added',
                        failure: ''
                    });
                }
                if (this.fileInput.current.files[0]) {
                    headers['Content-Type'] = 'miltipart/form-data';
                    const fileRequestOptions = {
                        method: 'POST',
                        headers: headers,
                        body: {'file': this.fileInput.current.files[0]}
                    };
                    fetch(`${process.env.REACT_APP_API_URL}/books/${this.state.id}/image`, fileRequestOptions)
                        .then(handleResponse)
                        .then(() => {
                            this.setState({
                                photoSuccess: 'Photo successfully uploaded',
                                failure: ''
                            });
                        });
                }
            }).catch(errors => {
            this.setState({
                failure: errors[0].code,
                success: ''
            });
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" className="form-control" value={this.state.name} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.name}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input type="text" name="price" className="form-control" value={this.state.price} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.price}</div> }
                    </div>
                    { this.state.photo && <div className="form-group">
                        <label htmlFor="photo">Current photo</label>
                        <img name="photo" src={this.state.photo} alt=""/>
                    </div> }
                    <div className="form-group">
                        <label htmlFor="newPhoto">New photo</label>
                        <input name="newPhoto" ref={this.fileInput} type="file"/>
                        <div className="text-success">{this.state.photoSuccess}</div>
                        <div className="text-danger">{this.state.photoFailure}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="count">Count</label>
                        <input type="number" name="count" className="form-control" value={this.state.count} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.count}</div> }
                    </div>
                    <div className="form-group">
                        <label htmlFor="visible">Visible</label>
                        <input type="checkbox" name="visible" className="form-control" value={this.state.visible} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.visible}</div> }
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary" />
                    </div>
                    <div className="text-success">{this.state.success}</div>
                    <div className="text-danger">{this.state.failure}</div>
                </form>
            </div>
        );
    }

}

export default Book
