export function addToCart(book) {
    const copiedBook = { ...book };
    let books = JSON.parse(localStorage.getItem('cart'));
    if (books === null) {
        books = [];
    }
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === book.id) {
            books[i].count += 1;
            localStorage.setItem("cart", JSON.stringify(books));
            return;
        }
    }
    copiedBook.count = 1;
    books.push(copiedBook);
    localStorage.setItem("cart", JSON.stringify(books));
}

export default addToCart;
