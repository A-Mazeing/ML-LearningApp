import PropTypes from "prop-types";
import Kamera from "./KameraLoadModel.jsx";


export default function FreeTestSite({modelUrl}){
    return (
        <Kamera width={300} height={300}/>
    );
}


FreeTestSite.propTypes = {
    modelUrl: PropTypes.string
}