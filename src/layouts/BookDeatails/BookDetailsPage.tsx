import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinerLoading } from "../../Utils/SpinerLoading";

// BookDetailsPage component
export const BookDetailsPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]); // Array of books
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [httpError, setHttpError] = useState(null); // Error state

    const bookId = window.location.pathname.split("/")[2]; // Get the book ID from the URL

    // Fetch book details from the API
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `https://www.googleapis.com/books/v1/volumes?q=${bookId}`; // Google Books API URL

            const response = await fetch(baseUrl); // Fetch the book details

            if (!response.ok) {
                // If the response is not ok
                throw new Error("Something went wrong");
            }

            // Get the response data
            const responseJson = await response.json();
            const responseData = responseJson.items;

            if (!responseData) {
                // If there is no data
                setIsLoading(false);
                return;
            }
            const loadedBooks: BookModel[] = responseData.map((item: any) => ({
                // Map the response data to the BookModel
                id: item.id,
                title: item.volumeInfo.title || "No title available",
                subtitle: item.volumeInfo.subtitle || "",
                authors: item.volumeInfo.authors || ["Unknown Author"],
                description: item.volumeInfo.description || "No description available",
                publisher: item.volumeInfo.publisher || "Unknown Publisher",
                publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
                smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || "",
            }));

            setBooks(loadedBooks); // Set the loaded books
            setIsLoading(false);
        };
        // Call the fetchBook function
        fetchBook().catch((error: any) => { // Catch any errors
            // Catch any errors
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [bookId]);

    if (isLoading) {
        // If the page is loading
        return <SpinerLoading />;
    }

    if (httpError) {
        // If there is an error
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                {books.map((book, index) => (
                    <div key={index} className="row mt-5">
                        <div className="col-sm-2 col-md-2">
                            <img
                                src={book?.smallThumbnail}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        </div>
                        <div className="col-4 col-md-8 container">
                            <div className="ml-2">
                                <h2>{book.title}</h2>
                                <h5 className="text-primary">{book.authors}</h5>
                                <p className="lead">{book.description}</p>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        <div>
                                            <label>Published Date:</label> {book.publishedDate}
                                        </div>
                                        <div>
                                            <label>ISBN:</label> {bookId}
                                        </div>
                                        <div>
                                            <label>Publisher:</label> {book.publisher}
                                        </div>
                                        <div>
                                            <label>Subtitle:</label> {book.subtitle}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
                <hr />
            </div>
            <div className="container d-lg-none mt-5">
                {books.map((book, index) => (
                    <div key={index}>
                        <div className="d-flex justify-content-center align-items-center">
                            <img
                                src={book?.smallThumbnail}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        </div>
                        <div className="mt-4">
                            <div className="ml-2">
                                <h2>{book.title}</h2>
                                <h5 className="text-primary">{book.authors}</h5>
                                <p className="lead">{book.description}</p>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        <div>
                                            <label>Published Date:</label> {book.publishedDate}
                                        </div>
                                        <div>
                                            <label>ISBN:</label> {bookId}
                                        </div>
                                        <div>
                                            <label>Publisher:</label> {book.publisher}
                                        </div>
                                        <div>
                                            <label>Subtitle:</label> {book.subtitle}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};