import { ReturnBook } from "./ReturnBook";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";
import { SpinerLoading } from "../../../Utils/SpinerLoading";


export const Carousel = () => {

  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

   
  useEffect(() => {
    const fetchBooks = async () => { // Fetch books from the API

      const baseUrl: string = "https://www.googleapis.com/books/v1/volumes?q=quilting";
      const url: string = `${baseUrl}?page=0&size=9`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const responseJson = await response.json();
      const responseData = responseJson.items;
      const loadedBooks: BookModel[] = [];

       
      for (const key in responseData) { // Map the response data to the BookModel
        const item = responseData[key];
        loadedBooks.push({
          id: item.id,
          title: item.volumeInfo.title || "No title available",
          subtitle: item.volumeInfo.subtitle || "",
          authors: item.volumeInfo.authors || ["Unknown Author"],
          description: item.volumeInfo.description || "No description available",
          publisher: item.volumeInfo.publisher || "Unknown Publisher",
          publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
          smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || "",
          ISBN:
            item.volumeInfo.industryIdentifiers?.find(
              (identifier: any) => identifier.type === "ISBN_13"
            )?.identifier || "No ISBN available",
        });
      }

      setBooks(loadedBooks); // Set the loaded books
      setIsLoading(false);

    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    })
  }, []);

  if (isLoading) {
    return (
      <SpinerLoading />
    )
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    )
  }

  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your next "I stayed up too late reading" book.</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5 
                d-none d-lg-block"
        data-bs-interval="false"
      >
        {/* Desktop */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(0, 3).map(book => (
                <ReturnBook book={book} key={book.id} />
              ))}
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(3, 6).map(book => (
                <ReturnBook book={book} key={book.id} />
              ))}
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(6, 9).map(book => (
                <ReturnBook book={book} key={book.id} />
              ))}
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          <ReturnBook book={books[7]} key={books[7].id} />
        </div>
      </div>
      <div className="homepage-carousel-title mt-3">
        <Link className="btn btn-outline-secondary btn-lg" to='/search'>
          View More
        </Link>
      </div>
    </div>
  );
};
