import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinerLoading } from "../../Utils/SpinerLoading";

export const BookDetailsPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `https://www.googleapis.com/books/v1/volumes?q=${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseJson = await response.json();
      const responseData = responseJson.items;

      console.log(responseData);

      if (!responseData) {
        setIsLoading(false);
        return;
      }
      const loadedBooks: BookModel[] = responseData.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || "No title available",
        subtitle: item.volumeInfo.subtitle || "",
        authors: item.volumeInfo.authors || ["Unknown Author"],
        description: item.volumeInfo.description || "No description available",
        publisher: item.volumeInfo.publisher || "Unknown Publisher",
        publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
        smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || "",
      }));

      setBooks(loadedBooks);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [bookId]);

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

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {books.map((book) => (
              <img
                src={book?.smallThumbnail}
                width="226"
                height="349"
                alt="Book"
              ></img>
            ))}
          </div>
          <div
            className="col-4 col-md-8 container"
            style={{ overflowY: "auto", maxHeight: "400px" }}
          >
            <div className="ml-2">
              <h2>{books.map((book) => book.title)}</h2>
              <h5 className="text-primary">
                {books.map((book) => book.authors)}
              </h5>
              <p className="lead">{books.map((book) => book.description)}</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {books.map((book) => (
            <img
              src={book?.smallThumbnail}
              width="226"
              height="349"
              alt="Book"
            ></img>
          ))}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{books.map((book) => book.title)}</h2>
            <h5 className="text-primary">
              {books.map((book) => book.authors)}
            </h5>
            <p className="lead">{books.map((book) => book.description)}</p>
          </div>
        </div>

        <hr />
      </div>
    </div>
  );
};
