import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.smallThumbnail ?
                            <img src={props.book.smallThumbnail}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/BooksImages/image.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.book.smallThumbnail ?
                            <img src={props.book.smallThumbnail}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/BooksImages/image.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.book.authors}
                        </h5>
                        <h4>
                            {props.book.title}
                        </h4>
                        <p className='card-text'>
                            {props.book.description?.substring(0, 200)}...
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/details/${props.book.ISBN}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}