import {Button} from "@mui/material";
import PropTypes from "prop-types";

const GradientButton = ({ text, width, height, event }) => {
    return (
        <Button
            variant="contained"
            style={{
                borderRadius: '22px',
                background: 'linear-gradient(45deg, #9540fc, #fc3c64)',
                fontSize: '25px',
                color: 'black',
                padding: '10px 20px',
                fontWeight: 'bold',
                textTransform: 'none',
                width: width, // Dynamische Breite
                height: height // Dynamische Höhe
            }}
            onClick={event}
        >
            {text}
        </Button>
    );
};


export default GradientButton;

GradientButton.propTypes = {
    text: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    event: PropTypes.func.isRequired
}