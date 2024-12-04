import {TextField} from "@mui/material";
import PropTypes from "prop-types";


const TextFieldLarge = ({textTextfeld, style, width, height}) => {
    return (
        <TextField
            variant="outlined"
            label={textTextfeld}
            sx={{
                ...style,
                width: {width},
                height: {height},
                '& .MuiOutlinedInput-root': {
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

