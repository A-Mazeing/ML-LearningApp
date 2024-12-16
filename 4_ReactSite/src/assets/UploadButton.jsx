import { Button } from "@mui/material";
import FileUploadIcon from '../assets/UploadIcon.svg';
import PropTypes from "prop-types";

export default function UploadButton({ event }) {
    return (
        <>
            <label htmlFor="upload-input">
                <Button
                    tabIndex={-1}
                    onClick={event}
                    sx={{
                        backgroundColor: "transparent",
                        padding: 0,
                        fontSize: "16px",
                        height: "80px",
                        width: "80px",
                        boxShadow: "none",
                        border: "none",
                        minWidth: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img src={FileUploadIcon} alt="Upload" style={{ width: '100px', height: '100px' }} />
                </Button>
            </label>
        </>
    );
}

UploadButton.propTypes = {
    event: PropTypes.func.isRequired
};
