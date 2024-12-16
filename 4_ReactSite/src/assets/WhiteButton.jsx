import { Button } from "@mui/material";
import PropTypes from "prop-types";

const WhiteButton = ({ text, width, height, event }) => {
    return (
        <Button
            variant="contained"
            style={{
                borderRadius: '22px',
                background: 'transparent',
                fontSize: '25px',
                color: 'white',
                padding: '10px 20px',
                fontWeight: 'bold',
                textTransform: 'none',
                border: '2px solid white', // Weiße Umrandung
                width: width, // Dynamische Breite
                height: height // Dynamische Höhe
            }}
            onClick={event}
        >
            {text}
        </Button>
    );
};

export default WhiteButton;

WhiteButton.propTypes = {
    text: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    event: PropTypes.func.isRequired
};
