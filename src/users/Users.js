import React from 'react';
import ReactPaginate from 'react-paginate';

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.loadAllUsers(0, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
        this.pageChanged = this.pageChanged.bind(this);
        this.remove = this.remove.bind(this);
    }

    loadAllUsers(pageNumber, size) {
        var getUsers = new XMLHttpRequest();
        getUsers.open('GET', `${process.env.REACT_APP_API_URL}/usersRepository?page=${pageNumber}&size=${size}&sort=id`, true);
        getUsers.onreadystatechange = function () {
                if (getUsers.readyState === XMLHttpRequest.DONE && getUsers.status === 200) {
                    this.state = {
                        users: getUsers.response._embedded.users,
                        page: getUsers.response.page
                    }
                }
            };
        getUsers.send();
    }

    remove(id, e) {
        var deleteUser = new XMLHttpRequest();
        deleteUser.open('DELETE', `${process.env.REACT_APP_API_URL}/usersRepository/${id}`, true);
        deleteUser.onreadystatechange = function () {
                if (deleteUser.readyState === XMLHttpRequest.DONE && deleteUser.status === 200) {
                    this.loadAllUsers(this.page.number - 1, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
                };
            };
        deleteUser.send();
    }

    pageChanged(pageNumber, e) {
        this.loadAllUsers(pageNumber - 1, process.env.REACT_APP_DEFAULT_PAGE_SIZE);
    }

    render() {

        return (
            <div id="content" class="container">
            <table class="table">
            <thead>
            <tr>
              <th>Username</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              {items}
            </tr>
            </tbody>
            </table>
            <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={10}
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
