export function addToCart(book) {
    let books = {};
    try {
        books = JSON.parse(localStorage.getItem('cart'));
    } catch (error) {
        console.debug('Cart is not initialized');
    }
    const id = book.id;
    if (!books[id]) {
        const copiedBook = { ...book };
        copiedBook.count = 1;
        books[id] = copiedBook;
    } else {
        books[id].count += 1;
    }
    localStorage.setItem("cart", JSON.stringify(books));
}

export default addToCart;
