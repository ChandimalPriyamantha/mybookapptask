class BookModel{
   
    //  properties of the BookModel class
     id:number;
     title:string;
     subtitle:string;
     authors?:string;
     description?:string;
     publisher?:string;
     publishedDate?:string;
     smallThumbnail?:string;
     ISBN?:string;

     //  constructor of the BookModel class
     constructor(id: number, title: string, subtitle:string, authors: string, description: string, publisher: string,
        publishedDate:string, smallThumbnail: string, ISBN:string){

            this.id = id;
            this.title = title;
            this.subtitle = subtitle;
            this.authors = authors;
            this.description = description;
            this.publisher = publisher;
            this.publishedDate = publishedDate;
            this.smallThumbnail = smallThumbnail;
            this.ISBN = ISBN;
        }

}

export default BookModel;