import React from "react";
import "./App.css";
import { Navebar } from "./layouts/NavbarAndFooter/Navebar";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { BooksPage } from "./HomePage/BooksPage";
import { BookDetailsPage } from "./layouts/BookDeatails/BookDetailsPage";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navebar />
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
          <BooksPage />
        </Route>
        <Route path="/home">
          <BooksPage />
        </Route>

        <Route path="/details/:bookId">
          <BookDetailsPage />
        </Route>
      </Switch>

      <Footer />
    </div>
  );
}

export default App;
