import { useEffect, useState } from "react";
import { SpinerLoading } from "../Utils/SpinerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";
import BookModel from "../models/BookModel";


export const BooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");


  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "https://www.googleapis.com/books/v1/volumes?q=";
  
      let url: string = "";
  
      if (searchUrl === "") {
        url = `${baseUrl + 'quilting'}&startIndex=${(currentPage - 1) * booksPerPage}&maxResults=${booksPerPage}`;
      } else {
        const searchWithPage = searchUrl.replace("<pageNumber>", `${currentPage - 1}`);
        url = baseUrl + searchWithPage;
      }
  
      try {
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
  
        const responseJson = await response.json();
        const responseData = responseJson.items;
  
        if (!responseData) {
          setBooks([]);
          setIsLoading(false);
          return;
        }
  
        setTotalAmountOfBooks(responseJson.totalItems || 0); // Total books in the search result
        setTotalPages(Math.ceil((responseJson.totalItems || 1) / booksPerPage)); // Calculate total pages
  
        const loadedBooks: BookModel[] = responseData.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || "No title available",
          subtitle: item.volumeInfo.subtitle || "",
          authors: item.volumeInfo.authors || ["Unknown Author"],
          description: item.volumeInfo.description || "No description available",
          publisher: item.volumeInfo.publisher || "Unknown Publisher",
          publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
          smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || "",
          ISBN: item.volumeInfo.industryIdentifiers?.find((item: any) => item.type === "ISBN_13")?.identifier || "No ISBN available",
        }));
  
        setBooks(loadedBooks);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBooks();
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);
  

  if (isLoading) {
    return <SpinerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const searchHandleChange = () => {
    setCurrentPage(1);
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `${search}&page=<pageNumber>&size=${booksPerPage}`
      );
     
    }
  };

  

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
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
              <a
                type="button"
                className="btn main color btn-md px-4 me-md-2 fw-bold text-white"
                href="#"
              >
                Libarary Services
              </a>
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
