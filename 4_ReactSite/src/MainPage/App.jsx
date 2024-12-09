import { useState } from 'react';
import './App.css';
import Ueberschrift from "../assets/Ueberschrift.jsx";
import { Grid } from "@mui/material";
import ShadowImage from "../assets/ShadowImage.jsx";
import LogoSrc from '../assets/Logo.svg';
import imgSrc from '../assets/img.png';
import TextFieldLarge from "../assets/TextFieldLarge.jsx";
import GradientButton from "../assets/GradientButton.jsx";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(""); // State für den Link

    const handleInputChange = (value) => {
        console.log(value);
        setInputValue(value); // Eingabewert speichern
    };

    const handleButtonClick = () => {
        console.log("inputValue:", inputValue); // Debugging
        navigate('/freeTestSite', { state: { modelUrl: inputValue } }); // Korrekt
    };


    return (
        <Grid container columnSpacing={2} style={{ padding: '0px' }}>
            <Grid item xs={12} style={{ textAlign: 'left' }}>
                <img src={LogoSrc} alt="Logo" style={{ width: "250px" }} />
            </Grid>

            <Grid item xs={12} style={{ marginTop: '40px' }} />

            <Grid item xs={12} md={6} style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '100px' }} />
                <Ueberschrift text={"Kunst \nInteraktiv"} />
                <div style={{ marginBottom: '50px' }} />
                <TextFieldLarge
                    textTextfeld={"Link oder Code eingeben"}
                    width={560}
                    height={100}
                    onChangeFunc={(e) => handleInputChange(e.target.value)} // Eventhandler für Eingabe
                />
                <div style={{ marginBottom: '40px' }} />
                <GradientButton
                    text={"Projekt starten"}
                    width={320}
                    height={75}
                    event={handleButtonClick}
                />
            </Grid>

            <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                <ShadowImage source={imgSrc} height="auto" width="90%" />
            </Grid>
        </Grid>
    );
}

export default App;
