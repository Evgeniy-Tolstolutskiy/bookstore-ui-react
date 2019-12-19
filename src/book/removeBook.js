import authHeader from "../authHeader";

export function removeBook(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${process.env.API_URL}/books/${id}`, requestOptions);
}

export default removeBook;