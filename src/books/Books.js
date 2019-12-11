import React from 'react';
import ReactPaginate from 'react-paginate';

import handleResponse from '../handleResponse';
import authHeader from '../authHeader';
import addToCart from '../cart/addToCart';
import removeBook from "../book/removeBook";
import { Link } from "react-router-dom";
import authenticationService from "../authenticationService";
import decode from 'jwt-decode';

class Books extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            totalPages: 1,
            currentPage: 0
        };

        this.tokenPayload = decode(authenticationService.currentUserValue.access_token);
        this.loadAllBooks = this.loadAllBooks.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.pageChanged = this.pageChanged.bind(this);
    }

    componentDidMount() {
        this.loadAllBooks(0, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
    }

    loadAllBooks(pageNumber, size) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        fetch(`${process.env.REACT_APP_API_URL}/books?page=${pageNumber}&size=${size}&sort=id`, requestOptions)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    books: response._embedded.books,
                    totalPages: response.page.totalPages,
                    currentPage: pageNumber
                });
            });
    }

    addToCart(book) {
        if (book.count > 0) {
            book.count -= 1;
            addToCart(book);
        }
    }

    pageChanged(data) {
        this.loadAllBooks(data.selected, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
    }

    render() {
        const books = this.state.books;
        return (
            <div>
                {this.tokenPayload.authorities[0] === 'ROLE_ADMIN' && <Link to="/book">Add new book</Link>}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Photo</th>
                            <th>Price</th>
                            {this.tokenPayload.authorities[0] === 'ROLE_ADMIN' && <th>Visible</th>}
                            <th>Add to cart</th>
                        </tr>
                    </thead>
                    <tbody>
                    {books.map(book =>
                     <tr key={book.id}>
                                <td>{book.name}</td>
                                <td>
                                    <img src={book.photoLink} width="100"/>
                                </td>
                                <td>{book.price}</td>
                                {this.tokenPayload.authorities[0] === 'ROLE_ADMIN' && <td>{book.visible ? 'Visible' : 'Not visible'}</td>}
                                <td><a disabled={book.count <= 0} onClick={() => this.addToCart(book)} className="btn btn-info">+</a></td>
                                {this.tokenPayload.authorities[0] === 'ROLE_ADMIN' && <td><Link key={book.id} to={`/book/${book.id}`}>Edit</Link></td>}
                                {this.tokenPayload.authorities[0] === 'ROLE_ADMIN' &&
                                    <td><a onClick={() => {
                                        removeBook(book.id).then(() => this.setState({books: this.state.books.filter((b) => book.id !== b.id)}))
                                    }}>X</a></td>
                                }
                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.pageChanged}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
            </div>
        );
    }
}

export default Books;
