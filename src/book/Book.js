import React from 'react';

import authenticationService from '../authenticationService';
import handleResponse from '../handleResponse';
import authHeader from '../authHeader';

class Book extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            price: '',
            photoLink: '',
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
                    photoLink: response.photoLink,
                    count: response.count,
                    visible: response.visible
                });
            });
    }

    onChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({[event.target.name]: value});
        this.validateField(event.target.name, value);
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
        event.preventDefault();
        this.setState({
            success: '',
            failure: '',
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
        fetch(`${process.env.REACT_APP_API_URL}/books`, requestOptions)
            .then(handleResponse)
            .then((response) => {
                if (this.state.id) {
                    this.setState({
                        success: 'Book successfully updated',
                        failure: ''
                    });
                } else {
                    this.setState({
                        id: response.id,
                        success: 'Book successfully added',
                        failure: ''
                    });
                }
                if (this.fileInput.current.files[0]) {
                    delete headers['Content-Type'];
                    let formData = new FormData();
                    formData.append('file', this.fileInput.current.files[0]);
                    const fileRequestOptions = {
                        method: 'POST',
                        headers: headers,
                        body: formData
                    };
                    fetch(`${process.env.REACT_APP_API_URL}/books/${this.state.id}/image`, fileRequestOptions)
                        .then(handleResponse)
                        .then(response => {
                            this.setState({
                                photoSuccess: 'Photo successfully uploaded',
                                photoFailure: '',
                                photoLink: response.photo
                            });
                        }).catch(errors => {
                            this.setState({
                                photoSuccess: '',
                                photoFailure: errors[0].code,
                            });
                        });
                }
            }).catch(errors => {
                this.setState({
                    failure: errors[0].code,
                    success: ''
                });
            });
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
                    { this.state.photoLink && <div className="form-group">
                        <label htmlFor="photoLink">Current photo</label>
                        <img name="photoLink" src={this.state.photoLink} alt="book image"/>
                    </div> }
                    <div className="form-group">
                        <label htmlFor="newPhoto">New photo</label>
                        <input name="newPhoto" ref={this.fileInput} type="file" onChange={this.onChange} />
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
                        <input type="checkbox" name="visible" className="form-control" checked={this.state.visible} onChange={this.onChange} />
                        { this.state.submitted && <div className="text-danger">{this.state.formErrors.visible}</div> }
                    </div>
                    <div className="form-group">
                        <input type="submit" value={this.state.id ? 'Update' : 'Add'} className="btn btn-primary" />
                    </div>
                    <div className="text-success">{this.state.success}</div>
                    <div className="text-danger">{this.state.failure}</div>
                </form>
            </div>
        );
    }

}

export default Book
