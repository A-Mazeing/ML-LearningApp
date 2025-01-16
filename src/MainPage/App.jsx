import { useState } from 'react';
import './App.css';
import Ueberschrift from "../assets/Ueberschrift.jsx";
import ShadowImage from "../assets/ShadowImage.jsx";
import LogoSrc from '../assets/Logo.svg';
import imgSrc from '../assets/img.png';
import TextFieldLarge from "../assets/TextFieldLarge.jsx";
import GradientButton from "../assets/GradientButton.jsx";
import { useNavigate } from "react-router-dom";
import React from 'react';
import Logos from '../assets/Logos.svg';
import { Container, Row, Col } from "react-grid-system";
import LogoRow from "../assets/LogoRow.jsx";

function App() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(""); // State für den Link

    const handleInputChange = (value) => {
        console.log(value);
        setInputValue(value); // Eingabewert speichern
    };

    const handleButtonClick = () => {
        console.log("inputValue:", inputValue); // Debugging
        const valueToNavigate = inputValue === "" ? "0" : inputValue;
        navigate('/select', { state: { modelUrl: valueToNavigate } }); // Korrekt
    };

    return (
        <Container style={{padding: '0px', paddingLeft: '100px'}}>
            <Row>
                <Col xs={12} style={{textAlign: 'left'}}>
                    <img src={LogoSrc} alt="TUD-Logo" style={{width: "250px"}}/>
                </Col>
            </Row>

            <Row style={{marginTop: '40px'}}/>

            <Row>
                <Col xs={12} md={6} style={{textAlign: 'left'}}>
                    <div style={{marginBottom: '100px'}}/>
                    <Ueberschrift text={"Kunst \nInteraktiv"}/>
                    <div style={{marginBottom: '50px'}}/>
                    <TextFieldLarge
                        textTextfeld={"Link oder Code eingeben"}
                        width={560}
                        height={100}
                        onChangeFunc={(e) => handleInputChange(e.target.value)} // Eventhandler für Eingabe
                    />
                    <div style={{marginBottom: '40px'}}/>
                    <GradientButton
                        text={"Projekt starten"}
                        width={320}
                        height={75}
                        event={handleButtonClick}
                    />
                </Col>

                <Col xs={12} md={6} style={{display: 'flex'}}>
                    <ShadowImage source={imgSrc} height="auto" width="90%"/>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col xs={12} style={{ textAlign: "left" }}>
                    <LogoRow logoImgSrc={Logos} />
                </Col>
            </Row>


        </Container>
    );
}

export default App;