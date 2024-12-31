import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Navebar = () => {

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-1">
      <div className="container-fluid">
        <span className="navbar-brand">  <h3> <FontAwesomeIcon icon={faBook} /> bookbreeze</h3></span>

      </div>
    </nav>
  );
};
