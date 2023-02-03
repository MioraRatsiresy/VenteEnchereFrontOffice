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
import imgvente from "../image/vente.svg";
import Button from 'react-bootstrap/Button';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import { Utilisateur } from "../model/Utilisateur";
import Profil from "./Profil";
import { UncontrolledTooltip } from "reactstrap";

const Accueil = () => {
  const navigate = useNavigate();
  const [enchere, setEnchere] = useState(null);
  const [fiche, setFiche] = useState(null);
  const [isopen, setIsOpen] = useState(false);
  const [encherir, setRencherir] = useState(false);
  const [voirfiche, setVoirFiche] = useState(false);
  const [etat, setEtat] = useState(0);
  const [enchereid, setId] = useState(0);
  const [montantmax, setMontant] = useState(0);
  const [erreur, setErreur] = useState(null);
  const [login, setLogin] = useState(null);
  const [plafond, setPlafond] = useState();
  const [profil, setProfil] = useState(null);
  const [photos, setPhoto] = useState(null);
  const [etatenchere, setetatenchere] = useState(null);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name);
    var temp = new Utilisateur();
    if (login !== null) {
      if (name === "identifiant") {
        temp.identifiant = value;
        temp.pwd = login.pwd;
      }
      else if (name === "pwd") {
        temp.identifiant = login.identifiant;
        temp.pwd = value;
      }
    }
    setLogin(temp);
  }
  //profil
  function maprofil() {
    setEnchere(null);
    setetatenchere(null);
    setProfil(1);
  }
  //login client
  function verifyLogin() {
    var identifiant = document.getElementById('identifiant').value;
    var pwd = document.getElementById('pwd').value;
    axios.post("https://backofficeventeenchere-production-db7d.up.railway.app/login/traitementClient?identifiant=" + identifiant + "&pwd=" + pwd).then((response) => {
      if (response.data['message'] === "Login correcte") {
        sessionStorage.setItem("TokenUser", response.data["token"]);
        sessionStorage.setItem("idUser", response.data["iduser"]);
        console.log(response.data);
        console.log(sessionStorage.getItem("idUser"));
        setEtat(0);
        setIsOpen(false);
        if (montantmax !== 0) {
          setRencherir(true);
        }
        //navigate("/accueil");
      }
      else {
        setEtat(1);
      }
    })
  }

  //function get plafond
  function getPlafond(id) {
    console.log("Plafond")
    axios.get("https://backofficeventeenchere-production-db7d.up.railway.app/enchereplafond/" + id, { params: { "idclient": sessionStorage.getItem("idUser") } }).then((res) => {
      console.log(res.data);
      setPlafond(res.data["plafond"]);
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
          setMontant(0);
          setProfil(null);
          setetatenchere(null);
          navigate("/");
        }
        else {
        }
      }
    }
    xmlhttp.open("GET", "https://backofficeventeenchere-production-db7d.up.railway.app/logout");
    xmlhttp.send();
  }
  //liste enchere
  function listeenchere() {
    axios.get("https://backofficeventeenchere-production-db7d.up.railway.app/listeEnchereFront").then((res) => {
      console.log(res.data);
      setEnchere(res.data);
      setetatenchere(null);
      setProfil(null);
    })
  }

  //historique
  function mesencheres() {
    axios.get("https://backofficeventeenchere-production-db7d.up.railway.app/getMesEncheres/" + sessionStorage.getItem("idUser") + "/" + sessionStorage.getItem("TokenUser")).then((res) => {
      console.log(res.data);
      setEnchere(res.data);
      setetatenchere(1);
      setProfil(null);
    })
  }

  //recherche avancée
  function recherche() {
    axios.get("https://backofficeventeenchere-production-db7d.up.railway.app/rechercheAvanceFront?search=" + document.getElementById("recherche").value).then((res) => {
      console.log(res.data);
      setEnchere(res.data);
    })
  }
  function rencherir(id, montant) {
    setId(id);
    setMontant(montant);
    if (sessionStorage.getItem("TokenUser") == null) {
      loginUser();
    }
    else {
      getPlafond(id);
      setRencherir(true);
    }
  }
  function ValiderRencherir() {
    axios.post("https://backofficeventeenchere-production-db7d.up.railway.app/miser/" + enchereid + "/" + sessionStorage.getItem("TokenUser"), null, { params: { "idclient": sessionStorage.getItem("idUser"), "montant": document.getElementById("montantdonne").value } }).then((res) => {
      console.log(res.data);
      if (res.data["Compte"] != null) {
        setErreur(res.data["Compte"]);
      } else {
        setRencherir(false);
        window.location.reload();
      }
    })
  }

  //fiche enchere
  function ficheEnchere(id) {
    axios.get("https://backofficeventeenchere-production-db7d.up.railway.app/ficheenchere/" + id).then((res) => {
      console.log(res.data);
      setFiche(res.data);
    })
    axios.get("https://backofficeventeenchere-production-db7d.up.railway.app/getPhotoEnchere/" + id).then((res) => {
      console.log(res.data);
      setPhoto(res.data["photo"]);
    })
    setVoirFiche(true);
  }
  function loginUser() {
    var log = new Utilisateur();
    log.identifiant = "Mbola";
    log.pwd = "mbola";
    setLogin(log);
    setIsOpen(true);
  }
  function insertPlafond(id) {
    axios.post("https://backofficeventeenchere-production-db7d.up.railway.app/insertenchereplafond/" + id, null, { params: { "idclient": sessionStorage.getItem("idUser"), "montant": document.getElementById("montantmax").value, "intervalle": document.getElementById("intervalle").value } }).then((res) => {
      console.log(res.data);
      if (res.data["Erreur"] != null) {
        setErreur(res.data["Erreur"]);
      }
      else {
        setRencherir(false);
        alert("Insertion avec succès");
      }
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
              <div style={{ cursor: "pointer" }} onClick={maprofil}>Profil</div>
              <div onClick={logout} style={{ cursor: "pointer" }}>Logout</div>
            </>
            :
            <div onClick={() => loginUser()} style={{ cursor: "pointer" }}>Login</div>
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
                            sessionStorage.getItem("idUser") != null && parseInt(value.idClient) === parseInt(sessionStorage.getItem("idUser")) ?
                              <><Icon.PersonBadge id="amoi" style={{ cursor: 'pointer' }} />
                                <UncontrolledTooltip placement="right" target="amoi">
                                  Mes enchères
                                </UncontrolledTooltip></>
                              :
                              <><Icon.Hammer id="autres" style={{ cursor: 'pointer' }} onClick={rencherir.bind(this, value.idEnchere, value.montant)} />
                                <UncontrolledTooltip placement="right" target="autres">
                                  Autres
                                </UncontrolledTooltip>
                              </>
                            :
                            <Icon.StopBtn />
                        }
                        {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                        <Card.Body>
                          <Card.Title onClick={() => ficheEnchere(value.idEnchere)} style={{ cursor: 'pointer' }}>{value.libelle} </Card.Title>
                          <Card.Text>
                            {
                              sessionStorage.getItem("idUser") != null && etatenchere == null ?
                                parseInt(value.client) === parseInt(sessionStorage.getItem("idUser")) ?
                                  <p style={{ color: 'red' }}>Moi</p>
                                  :
                                  <p style={{ color: 'green' }}>Pris</p>
                                :
                                ''
                            }
                            {
                              etatenchere != null ?
                                value.nom != null ?
                                  <p style={{ color: 'blue' }}>{value.nom} {value.prenom}</p>
                                  :
                                  <p style={{ color: 'blue' }}>Aucune mise</p>
                                :
                                ''
                            }
                            Prix Actuelle :{value.montant} Ar
                            <br />
                            Fin:{value.dateFin}
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
        {
          profil != null ?
            <Profil></Profil>
            :
            ''
        }
      </aside>
      <footer className="text-center text-white" style={{ backgroundColor: "rgb(152, 99, 187)" }}>
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

        <div className="text-center p-3" style={{ backgroundColor: "rgb(15, 99, 187)" }}>
          <p style={{ height: 10 }}> 1502,1391</p>
        </div>
      </footer>


      {/* modal rencherir */}
      <Modal show={encherir} onHide={() => setRencherir(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Renchérir</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            erreur !== null ?
              <Alert key={"danger"} variant={"danger"}>
                {erreur}
              </Alert>
              :
              ''
          }
          <p style={{ color: "red" }}>* Montant minimal: {montantmax}</p>
          <div className="row">
            <div className="col-sm-6">
              <input type="number" id="montantdonne" placeholder="Montant" className="form-control form-control-lg"></input>
              <Button variant="primary" onClick={ValiderRencherir}>
                Valider
              </Button>
            </div>
            <div className="col-sm-6">
              {
                plafond != null ?
                  <><h4 style={{ color: "blue" }}>Prix plafond</h4>
                    {
                      plafond.length > 0 ?
                        <>
                          <p>Montant: {plafond[0].montant} Ar</p>
                          <p>Intervalle: {plafond[0].intervalle} Ar</p>
                        </>
                        :
                        <>
                          Montant: <input type="number" id="montantmax" placeholder="Montant max" required></input>
                          Intervalle: <input type="number" id="intervalle" placeholder="Intervalle" required></input>
                          <Button onClick={insertPlafond.bind(this, enchereid)}>Ajouter</Button>
                        </>
                    }
                  </>
                  :
                  ''
              }
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* modal fiche */}
      <Modal show={voirfiche} onHide={() => setVoirFiche(false)}>
        <Icon.XSquare style={{ cursor: 'pointer' }} onClick={() => setVoirFiche(false)} />
        {
          fiche != null ?
            fiche["fiche"].map((value) => {
              return (
                <MDBContainer key={value.idEnchere} className="py-5 h-100" >
                  <MDBRow>
                    <MDBCol xl="12">
                      <MDBCard>
                        <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                          <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                            <MDBCardImage src={imgvente}
                              alt="imgvente" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1' }} />
                          </div>
                          <div className="ms-3" style={{ marginTop: '130px' }}>
                            <MDBTypography tag="h5">{value.libelle}</MDBTypography>
                            <MDBCardText>Categorie: {value.categorie}</MDBCardText>
                          </div>
                        </div>
                        <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="d-flex justify-content-end text-center py-1">
                            <div>
                              <MDBCardText className="mb-1 h5">{value.montant}</MDBCardText>
                              <MDBCardText className="small text-muted mb-0">Prix</MDBCardText>
                            </div>
                            <div className="px-3">
                              <MDBCardText className="mb-1 h5">{value.statut}</MDBCardText>
                              <MDBCardText className="small text-muted mb-0">Statut</MDBCardText>
                            </div>
                          </div>
                        </div>
                        <MDBCardBody className="text-black p-4">
                          <div className="mb-5">
                            <p className="lead fw-normal mb-1">About</p>
                            <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                              <MDBCardText className="font-italic mb-1">Produit: {value.produitEnchere}</MDBCardText>
                              <MDBCardText className="font-italic mb-1">Date de publication: {value.dateHeure}</MDBCardText>
                              <MDBCardText className="font-italic mb-0">Duree: {value.duree} jour</MDBCardText>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <MDBCardText className="lead fw-normal mb-0">Photos</MDBCardText>
                          </div>
                          {
                            photos != null && photos.length > 0 ?
                              photos.map((value) => {
                                return (
                                  <>
                                    <MDBRow className="g-3">
                                      <MDBCol className="mb-2">
                                        <MDBCardImage src={`data:image/jpeg;base64,${value.photo}`}
                                          alt="image 1" className="w-100 rounded-3" />
                                      </MDBCol>
                                    </MDBRow>

                                  </>
                                );
                              })
                              :
                              'Aucun photo'
                          }

                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              );
            })
            :
            ''
        }
      </Modal>

      {/* modal connexion */}
      <Modal show={isopen} size="lg" height="200px" onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton style={{ textAlign: 'center' }}>
          <Modal.Title>
            <h1 style={{ cursor: "pointer" }}>VenteEnchere <Icon.Hammer /></h1>
          </Modal.Title>
        </Modal.Header>
        <section>
          <div className="container-fluid h-custom" style={{ backgroundColor: "white", opacity: "0.9", borderRadius: "20px" }}>
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
                  {login != null ?
                    <>
                      <div className="form-outline mb-4">
                        <input value={login.identifiant} type="email" onChange={handleChange} id="identifiant" className="form-control form-control-lg"
                          placeholder="Identifiant" />
                      </div>
                      <div className="form-outline mb-3">
                        <input value={login.pwd} type="password" id="pwd" onChange={handleChange} className="form-control form-control-lg"
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
                    </>
                    : ''
                  }

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
