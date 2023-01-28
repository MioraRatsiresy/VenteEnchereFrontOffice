/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Accueil.css';
import * as Icon from 'react-bootstrap-icons';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import vente from "../image/vente-enchere.jpg";
import Button from 'react-bootstrap/Button';


const Accueil = () => {
  const navigate = useNavigate();
  const [enchere, setEnchere] = useState(null);
  const [isopen, setIsOpen] = useState(false);
  const [encherir, setRencherir] = useState(false);
  const [etat, setEtat] = useState(0);
  const [enchereid,setId]=useState(0);
  const [montantmax,setMontant]=useState(0);

  //login client
  function verifyLogin() {
    var identifiant = document.getElementById('identifiant').value;
    var pwd = document.getElementById('pwd').value;
    axios.post("http://localhost:4444/login/traitementClient?identifiant=" + identifiant + "&pwd=" + pwd).then((response) => {
      if (response.data['message'] === "Login correcte") {
        sessionStorage.setItem("TokenUser", response.data["token"]);
        sessionStorage.setItem("idUser", response.data["iduser"]);
        console.log(response.data);
        setEtat(0);
        setIsOpen(false);
        setRencherir(true);
        //navigate("/accueil");
      }
      else {
        setEtat(1);
      }
    })
  }

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
  //liste enchere
  function listeenchere() {
    axios.get("http://localhost:4444/listeEnchereFront").then((res) => {
      console.log(res.data);
      setEnchere(res.data);
    })
  }

  //historique
  function mesencheres() {
    axios.get("http://localhost:4444/getMesEncheres/" + sessionStorage.getItem("idUser") + "/" + sessionStorage.getItem("TokenUser")).then((res) => {
      console.log(res.data);
      setEnchere(res.data);
    })
  }

  useEffect(() => {
    listeenchere();
    // eslint-disable-next-line
  }, []);

  //recherche avancée
  function recherche() {
    axios.get("http://localhost:4444/rechercheAvanceFront?search=" + document.getElementById("recherche").value).then((res) => {
      console.log(res.data);
      setEnchere(res.data);
    })
  }
  function rencherir(id,montant) {
    setId(id);
    setMontant(montant);
    if (sessionStorage.getItem("TokenUser") == null) {
      setIsOpen(true);
    }
    else {
      setRencherir(true);
    }
  }
  function ValiderRencherir(){
    axios.post("http://localhost:4444/miser/"+enchereid+"/"+sessionStorage.getItem("TokenUser"),null,{params:{"idclient":sessionStorage.getItem("idUser"),"montant":document.getElementById("montantdonne").value}}).then((res)=>{
    setRencherir(false);
    window.location.reload();  
  })
  }

  return (
    <div id="container">
      <header>
        <div><h3 style={{ cursor: "pointer" }}>VenteEnchere <Icon.Hammer /></h3></div>
        <div>
          <form>
            <div className="form-group">
              <input id="recherche" type="text" className="form-control" placeholder="Search" onChange={recherche}></input>
            </div>
          </form>
        </div>
        <div style={{ cursor: "pointer" }} onClick={listeenchere}>Enchere</div>
        {
          sessionStorage.getItem("TokenUser") != null ?
            <>
              <div style={{ cursor: "pointer" }} onClick={mesencheres}>Mes Encheres</div>
              <div onClick={logout} style={{ cursor: "pointer" }}>Logout</div>
            </>
            :
            ''
        }
      </header>
      <aside style={{ margin: "2%" }}>
        {
          enchere != null ?
            <Row xs={4} md={4} className="g-4">
              {
                enchere["enchere"].map((value) => {
                  return (
                    <Col key={value.idEnchere}>
                      <Card>
                        {
                          value.statut !== "Termine" ?
                            <Icon.BagPlusFill style={{ cursor: 'pointer' }} onClick={rencherir.bind(this,value.idEnchere,value.montant)} />
                            : <Icon.StopBtn />
                        }
                        {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                        <Card.Body>
                          <Card.Title>{value.libelle} </Card.Title>
                          <Card.Text>
                            Prix :{value.montant} Ar
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          {
                            value.statut === "Termine" ?
                              <Alert key={"secondary"} variant={"secondary"}>
                                <small className="text-muted">{value.statut}</small></Alert>
                              :
                              <Alert key={"success"} variant={"success"}>
                                <small className="text-muted">{value.statut}</small></Alert>
                          }
                        </Card.Footer>
                      </Card>
                    </Col>
                  );
                })
              }
            </Row>
            :
            ''
        }
      </aside>
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


      {/* modal rencherir */}
      <Modal show={encherir} onHide={() => setRencherir(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Renchérir</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{color:"red"}}>* Montant minimale: {montantmax}</p>
          <input type="number" id="montantdonne" placeholder="Montant" className="form-control form-control-lg"></input>
          <Button variant="primary" onClick={ValiderRencherir}>
            Valider
          </Button>
        </Modal.Body>
      </Modal>

      {/* modal connexion */}
      <Modal show={isopen} size="lg" onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            <h1 className="justify-content-center" style={{ cursor: "pointer" }}>VenteEnchere <Icon.Hammer /></h1>
          </Modal.Title>
        </Modal.Header>
        <section className="vh-100">
          <div className="container-fluid h-custom" style={{ width: "80%", backgroundColor: "white", opacity: "0.9", borderRadius: "20px" }}>
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-9 col-lg-6 col-xl-5">
                <img src={vente}
                  className="img-fluid" alt="vente" />
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <div className="row justify-content-center">

                  <div className="page-header">
                    <h1>Login</h1>
                  </div>
                </div>
                <form>
                  <div className="form-outline mb-4">
                    <input type="email" id="identifiant" className="form-control form-control-lg"
                      placeholder="Identifiant" />
                  </div>
                  <div className="form-outline mb-3">
                    <input type="password" id="pwd" className="form-control form-control-lg"
                      placeholder="Enter password" />
                  </div>

                  <div className="text-center text-lg-start mt-4 pt-2">
                    <div className="row justify-content-center">
                      <button type="button" className="btn btn-primary btn-lg"
                        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} onClick={verifyLogin}>Login</button>
                      {
                        etat === 1 ?
                          <Alert key={"danger"} variant={"danger"}>
                            Mot de passe ou identifiant erroné!!!!
                          </Alert>
                          :
                          ''
                      }
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </section>
      </Modal>
    </div>
  );
}

export default Accueil;
