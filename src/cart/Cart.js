import React from 'react';
import handleResponse from 'handleResponse';
import authHeader from 'authHeader';

class Cart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            total: 0,
            success: ''
        };

        this.loadCart = this.loadCart.bind(this);
        this.makeOrder = this.makeOrder.bind(this);
    }

    componentDidMount() {
        this.loadCart();
    }

    loadCart() {
        try {
            let books = JSON.parse(localStorage.getItem('cart'));
            let booksTemp = [];
            let total = 0;
            for (let id in books) {
                booksTemp.push(books[id]);
                total += books[id].price * books[id].count;
            }
            this.setState({
                books: booksTemp,
                total: total
            });
        } catch(error) {
            console.debug('Cart is not initialized');
        }
    }

    remove(id) {
        let books = JSON.parse(localStorage.getItem('cart'));
        delete books[id];
        localStorage.setItem('cart', JSON.stringify(books));
        this.loadCart();
    }

    makeOrder() {
        if (this.state.books.length === 0) {
            return;
        }

        let orderItems = [];
        this.state.books.map(book => {
            orderItems.push({
                book: book,
                count: book.count
            });
        });
        localStorage.setItem('cart', '{}');
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
        return fetch(`${process.env.API_URL}/orders`, requestOptions)
            .then(handleResponse)
            .then(() => {
                this.setState({
                    success: 'Order has been done successfully!'
                });
            });
    }

    render() {
        return (
            <div>
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
                          <td>{Number(this.state.total).toFixed(2)}</td>
                      </tr>
                    </tbody>
                </table>
                <button className="btn btn-success" onClick={this.makeOrder}>Make order</button>
                <div className="text-success">{this.state.success}</div>
            </div>
        );
    }


  }

  export default Cart;
