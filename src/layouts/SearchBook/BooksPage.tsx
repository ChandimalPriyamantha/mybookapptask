import { useEffect, useState } from "react";
import { SpinerLoading } from "../../Utils/SpinerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../../Utils/Pagination";
import BookModel from "../../models/BookModel";

export const BooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]); // Array of books
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [httpError, setHttpError] = useState(null); // Error state
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [booksPerPage] = useState(5); // Books per page
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0); // Total books in the search result
    const [totalPages, setTotalPages] = useState(0); // Total pages
    const [search, setSearch] = useState(""); // Search input
    const [searchUrl, setSearchUrl] = useState(""); // Search URL

    // Fetch books from the API
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = "https://www.googleapis.com/books/v1/volumes?q="; // Google Books API URL

            let url: string = "";

            if (searchUrl === "") {
                // If there is no search query
                url = `${baseUrl + "quilting"}&startIndex=${(currentPage - 1) * booksPerPage
                    }&maxResults=${booksPerPage}`;
            } else {
                const searchWithPage = searchUrl.replace(
                    "<pageNumber>",
                    `${currentPage - 1}`
                ); // Replace <pageNumber> with the current page
                url = baseUrl + searchWithPage;
            }

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    // If the response is not ok
                    throw new Error("Something went wrong!");
                }

                // Get the response data
                const responseJson = await response.json();
                const responseData = responseJson.items;

                if (!responseData) {
                    // If there is no data
                    setBooks([]);
                    setIsLoading(false);
                    return;
                }

                // Set the total amount of books and total pages
                setTotalAmountOfBooks(responseJson.totalItems || 0); // Total books in the search result
                setTotalPages(Math.ceil((responseJson.totalItems || 1) / booksPerPage)); // Calculate total pages

                // Map the response data to the BookModel
                const loadedBooks: BookModel[] = responseData.map((item: any) => ({
                    id: item.id,
                    title: item.volumeInfo.title || "No title available",
                    subtitle: item.volumeInfo.subtitle || "",
                    authors: item.volumeInfo.authors || ["Unknown Author"],
                    description:
                        item.volumeInfo.description || "No description available",
                    publisher: item.volumeInfo.publisher || "Unknown Publisher",
                    publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
                    smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || "",
                    ISBN:
                        item.volumeInfo.industryIdentifiers?.find(
                            (item: any) => item.type === "ISBN_13"
                        )?.identifier || "No ISBN available",
                }));

                setBooks(loadedBooks); // Set the books
            } catch (error: any) {
                // Catch any errors
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks(); // Call the fetchBooks function
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, [currentPage, searchUrl,booksPerPage]);

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

    // Search input change handler
    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === "") {
            setSearchUrl("");
        } else {
            setSearchUrl(`${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
    };

    // Calculate the index of the last book and the index of the first book
    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem =
        booksPerPage * currentPage <= totalAmountOfBooks
            ? booksPerPage * currentPage
            : totalAmountOfBooks;
    // Pagination
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-">
                            <div className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder=" Name, Author, ISBN, Publisher, Category, etc."
                                    aria-labelledby="Search"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-success"
                                    onClick={() => searchHandleChange()}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ? (
                        <>
                            <div className="mt-3">
                                <h5>Number of results: {totalAmountOfBooks}</h5>
                            </div>
                            <p>
                                {indexOfFirstBook} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                            {books.map((book) => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                    ) : (
                        <div className="m-5">
                            <h3>Can't find what you are looking for?</h3>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
