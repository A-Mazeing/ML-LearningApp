import { Button } from "@mui/material";
import FileUploadIcon from '../assets/UploadIcon.svg';
import PropTypes from "prop-types";

export default function UploadButton({ text, eventClick }) {
    return (
        <>
            {/* Button als Label für das versteckte Input */}
            <label htmlFor="upload-input">
                <Button
                    variant="contained"
                    tabIndex={-1}
                    onClick={eventClick}
                    startIcon={<img src={FileUploadIcon} alt="Upload" style={{ width: 20, height: 20 }} />}
                >
                    {text}
                </Button>
            </label>
        </>
    );
}

UploadButton.propTypes = {
    text: PropTypes.string,
    eventClick: PropTypes.func.isRequired
};
