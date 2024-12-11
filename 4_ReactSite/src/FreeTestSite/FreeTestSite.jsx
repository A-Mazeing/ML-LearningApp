import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import Kamera from "./KameraLoadModel.jsx";
import "./FreeTestSite.css"

export default function FreeTestSite() {
    const location = useLocation();
    const modelUrl = location.state?.modelUrl
    console.log(modelUrl);
    return (
        <Kamera width={300} height={300} model={modelUrl} />
    );
}

FreeTestSite.propTypes = {
    modelUrl: PropTypes.string,
};
