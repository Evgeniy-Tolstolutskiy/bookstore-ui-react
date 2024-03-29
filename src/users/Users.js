import React from 'react';
import ReactPaginate from 'react-paginate';
import handleResponse from 'handleResponse';
import authHeader from 'authHeader';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            totalPages: 1,
            currentPage: 0
        };

        this.removeUser = this.removeUser.bind(this);
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.pageChanged = this.pageChanged.bind(this);
    }

    componentDidMount() {
        this.loadAllUsers(0, process.env.DEFAULT_PAGE_SIZE);
    }

    loadAllUsers(pageNumber, size) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        fetch(`${process.env.API_URL}/usersRepository?page=${pageNumber}&size=${size}&sort=id`, requestOptions)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    users: response._embedded.users,
                    totalPages: response.page.totalPages,
                    currentPage: pageNumber
                });
            });
    }

    pageChanged(data) {
        this.loadAllUsers(data.selected, process.env.DEFAULT_PAGE_SIZE);
    }

    removeUser(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader()
        };
        fetch(`${process.env.API_URL}/usersRepository/${id}`, requestOptions)
            .then(handleResponse)
            .then(() => this.setState({
                users: this.state.users.filter((u) => id !== u.id)
            }));
    }

    render() {
        const users = this.state.users;
        return (
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Gender</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.gender}</td>
                            <td>{user.email}</td>
                            <td><a onClick={ () => this.removeUser(user.id) }>X</a></td>
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

export default Users;
