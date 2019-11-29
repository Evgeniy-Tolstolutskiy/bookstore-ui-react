import React from 'react';
import ReactPaginate from 'react-paginate';

import handleResponse from '../handleResponse';
import authHeader from '../authHeader';

class Orders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            totalPages: 1
        };

        this.loadAllOrders = this.loadAllOrders.bind(this);
        this.pageChanged = this.pageChanged.bind(this);
    }

    componentDidMount() {
        this.loadAllOrders(0, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
    }

    loadAllOrders(pageNumber, size) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        fetch(`${process.env.REACT_APP_API_URL}/orders/my?page=${pageNumber}&size=${size}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    orders: response.content,
                    totalPages: response.totalPages
                });
            });
    }

    pageChanged(data) {
        this.loadAllOrders(data.selected, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
    }

    render() {
        const orders = this.state.orders;
        return (
            <div>
                <ul className="list-group">
                    {orders.map(order =>
                    <li className="list-group-item" key={order.id}>
                        Id: {order.id}, Price: {order.price}, Date: {order.date}
                        <ul className="list-group">
                            {order.bookOrders.map(bookOrder =>
                            <li className="list-group-item" key={bookOrder.id}>
                                Name: {bookOrder.book.name}, Image: <img src={bookOrder.book.photoLink} width="100"/>, Price: {bookOrder.book.price}, Count: {bookOrder.count}
                            </li>
                            )}
                        </ul>
                    </li>
                    )}
                </ul>
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

export default Orders
