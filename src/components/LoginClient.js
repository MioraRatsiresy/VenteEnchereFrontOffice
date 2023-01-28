/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import vente from "../image/vente-enchere.jpg";
import Alert from 'react-bootstrap/Alert';

const LoginClient = () => {
    const navigate = useNavigate();
    const [etat, setEtat] = useState(0);
    //login client
    function verifyLogin() {
        var identifiant = document.getElementById('identifiant').value;
        var pwd = document.getElementById('pwd').value;
        axios.post("http://localhost:4444/login/traitementClient?identifiant=" + identifiant + "&pwd=" + pwd).then((response) => {
            if (response.data['message'] === "Login correcte") {
                sessionStorage.setItem("TokenUser", response.data["token"]);
                console.log(response.data);
                setEtat(0);
                navigate("/accueil");
            }
            else {
                setEtat(1);
            }
        })
    }
    return (
        <div className="container" style={{ height: "600px", margin: "4%", backgroundColor: "rgb(239, 239, 230)", borderRadius: "20px" }}>
            <section className="vh-100">
                <div className="container-fluid h-custom">
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
        </div>

    );
}

export default LoginClient;
