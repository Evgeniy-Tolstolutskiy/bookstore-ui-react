import React from 'react';

import handleResponse from '../handleResponse';
import authHeader from '../authHeader';

class Cart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            total: 0
        };

        this.loadCart = this.loadCart.bind(this);
        this.makeOrder = this.makeOrder.bind(this);
    }

    componentDidMount() {
        this.loadCart();
    }

    loadCart() {
        let books = JSON.parse(localStorage.getItem('cart'));
        books = books ? books : [];
        let booksTemp = [];
        let totalTemp = 0;
        for (let i = 0; i < books.length; i++) {
            booksTemp.push(books[i]);
            totalTemp += books[i].price * books[i].count;
        }
        this.setState({
            books: booksTemp,
            total: totalTemp
        });
    }

    remove(id) {
        let books = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < books.length; i++) {
            if (books[i].id === id) {
                books.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('cart', JSON.stringify(books));
        this.loadCart();
    }

    makeOrder() {
        if (this.state.books.length === 0) {
            return;
        }

        let orderItems = [];
        for (let i = 0; i < this.state.books.length; i++) {
            orderItems.push({
                book: this.state.books[i],
                count: this.state.books[i].count
            });
		    }
        localStorage.setItem('cart', '[]');
        const requestOptions = {
            method: 'POST',
            headers: { Authorization: authHeader().Authorization, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookOrders: orderItems,
                price: this.state.total,
                books: []
            })
        };
        this.loadCart();
        return fetch(`${process.env.REACT_APP_API_URL}/orders`, requestOptions)
            .then(handleResponse)
            .then(response => {

            });
    }

    render() {
        return (
            <div id="content" className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Name</th>
                            <th>Photo</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Sub Total</th>
                        </tr>
                        <tr>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.books.map(book =>
                        <tr key={book.id}>
                            <td align="center">
                                <a className="btn btn-danger" onClick={() => this.remove(book.id)}>X</a>
                            </td>
                            <td>{book.name}</td>
                            <td>
                                <img src={book.photoLink} width="50"/>
                            </td>
                            <td>{book.price}</td>
                            <td>{book.count}</td>
                            <td>{book.price * book.count}</td>
                        </tr>
                      )}
                      <tr>
                          <td colSpan="6" align="right">Total</td>
                          <td>{this.state.total}</td>
                      </tr>
                    </tbody>
                </table>
                <button className="btn btn-success" onClick={this.makeOrder}>Make order</button>
            </div>
        );
    }


  }

  export default Cart;
