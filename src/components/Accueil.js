/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useNavigate } from 'react-router-dom';
import './Accueil.css';
import * as Icon from 'react-bootstrap-icons';
const Accueil = () => {
  const navigate = useNavigate();

  //deconnexion
  function logout() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var retour = JSON.parse(this.responseText);
        if (retour['message'] === "Logout with success") {
          sessionStorage.clear();
          navigate("/");
        }
        else {
        }
      }
    }
    xmlhttp.open("GET", "http://localhost:4444/logout");
    xmlhttp.send();
  }
  return (
    <div id="container">
      <header>
        <div><h3 style={{cursor:"pointer"}}>VenteEnchere <Icon.Hammer/></h3></div>
        <div>
          <form>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Search"></input>
            </div>
          </form>
        </div>
        <div style={{cursor:"pointer"}}>Enchere</div>
        <div style={{cursor:"pointer"}}>Mes Encheres</div>
        <div onClick={logout} style={{cursor:"pointer"}}>Logout</div>
      </header>

      <footer className="text-center text-white" style={{ backgroundColor: "#f1f1f1" }}>
        <div className="container pt-4">
          <section className="mb-4">
            <a
              className="btn btn-link btn-floating btn-lg text-dark m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            ><Icon.Facebook /></a>

            <a
              className="btn btn-link btn-floating btn-lg text-dark m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            ><Icon.Twitter /></a>

            <a
              className="btn btn-link btn-floating btn-lg text-dark m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            ><Icon.Google /></a>

            <a
              className="btn btn-link btn-floating btn-lg text-dark m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            ><Icon.Instagram /></a>

            <a
              className="btn btn-link btn-floating btn-lg text-dark m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            ><Icon.Linkedin /></a>
            <a
              className="btn btn-link btn-floating btn-lg text-dark m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"><Icon.Github /></a>
          </section>
        </div>

        <div className="text-center text-dark p-3" >
          © ETU
          <a className="text-dark" href="https://mdbootstrap.com/"> 1502,1391</a>
        </div>
      </footer>
    </div>
  );
}

export default Accueil;
