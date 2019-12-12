import authHeader from "../authHeader";
import handleResponse from "../handleResponse";

export function removeUser(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${process.env.REACT_APP_API_URL}/usersRepository/${id}`, requestOptions)
        .then(handleResponse);
}

export default removeUser;