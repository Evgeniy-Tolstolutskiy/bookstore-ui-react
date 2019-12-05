import authHeader from "../authHeader";

export function removeBook(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${process.env.REACT_APP_API_URL}/books/${id}`, requestOptions);
}

export default removeBook;