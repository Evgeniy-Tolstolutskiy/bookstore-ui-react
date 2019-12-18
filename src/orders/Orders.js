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
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Books</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order =>
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.price}</td>
                            <td>{order.date}</td>
                            <td>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Image</th>
                                        <th>Price</th>
                                        <th>Count</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {order.bookOrders.map(bookOrder =>
                                        <tr key={bookOrder.id}>
                                            <td>{bookOrder.book.name}</td>
                                            <td><img src={bookOrder.book.photoLink} width="100"/></td>
                                            <td>{bookOrder.book.price}</td>
                                            <td>{bookOrder.count}</td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                            </td>
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

export default Orders
