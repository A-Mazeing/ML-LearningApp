import {TextField} from "@mui/material";
import PropTypes from "prop-types";


const TextFieldLarge = ({textTextfeld, style, width, height, onChangeFunc}) => {
    return (
        <TextField
            onChange={onChangeFunc}
            variant="outlined"
            label={textTextfeld}
            sx={{
                ...style,
                width: {width},
                height: {height},
                backgroundColor: 'transparent',
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    '& fieldset': {
                        borderColor: '#9340ff', // normal
                    },
                    '&:hover fieldset': {
                        borderColor: '#9340ff', // hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#9340ff', // onFocus
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'white', // standard Label-Farbe
                    '&.Mui-focused': {
                        color: 'white', // Farbe bleibt weiß, wenn das TextField fokussiert ist
                    },
                },
                '& .MuiInputBase-input': {
                    color: 'white', // Textfarbe
                },
                '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0px 1000px transparent inset', // Entfernt den AutoFill-Hintergrund
                    backgroundColor: 'transparent !important', // Sicherstellen, dass auch AutoFill transparent bleibt
                    WebkitTextFillColor: 'white',
                    transition: 'background-color 5000s ease-in-out 0s', // Browserkompatibilität für Hintergrund
                },
            }}
        />
    );
};
export default TextFieldLarge;

TextFieldLarge.propTypes = {
    textTextfeld: PropTypes.string.isRequired,
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
}

