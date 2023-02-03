import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import * as Icon from 'react-bootstrap-icons';
import Alert from 'react-bootstrap/Alert';
const Profil = () => {
    const [profil, setProfil] = useState(null);
    const [solde, setSolde] = useState(null);
    function getProfil() {
        axios.get("http://localhost:4444/getClientById/" + sessionStorage.getItem("idUser") + "/" + sessionStorage.getItem("TokenUser")).then((res) => {
            console.log(res.data);
            setProfil(res.data["client"]);
        })
    }
    function getSolde() {
        axios.get("http://localhost:4444/getSoldeClient/" + sessionStorage.getItem("idUser")).then((res) => {
            console.log(res.data);
            setSolde(res.data["solde"]);
        })
    }
    useEffect(() => {
        getProfil();
        getSolde();
        // eslint-disable-next-line
    }, []);
    return (
        <>
            {
                profil != null ?
                    <>
                        <Card>
                            {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                            <Card.Body>
                                <Card.Title><Icon.PersonCircle /></Card.Title>
                                <Card.Text>
                                    <p>Nom: {profil[0].nom}</p>
                                    <p>Prénom: {profil[0].prenom}</p>
                                    <p>Contact: {profil[0].contact}</p>
                                    {solde != null ?
                                        <Alert key={"primary"} variant={"primary"}>
                                            <small className="text-muted">Solde:  {solde[0].solde} Ar</small></Alert>
                                        :
                                        ''
                                    }
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                            </Card.Footer>
                        </Card>
                    </>
                    :
                    ''
            }
        </>
    );
}
export default Profil;