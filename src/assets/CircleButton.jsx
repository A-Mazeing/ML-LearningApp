import PropTypes from "prop-types";

// Pfeil-Icons von @mui/icons-material
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function CircleButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "transparent", // Transparenter Hintergrund
        border: "2px solid rgba(255, 255, 255, 0.8)", // Leicht sichtbare Umrandung
        borderRadius: "50%", // Runde Form
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        width: "40px", // Runde Größe
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {direction === "previous" ? (
        <ArrowBackIcon style={{ color: "rgba(255, 255, 255, 0.8)" }} />
      ) : (
        <ArrowForwardIcon style={{ color: "rgba(255, 255, 255, 0.8)" }} />
      )}
    </button>
  );
}

// Prop-Validation
CircleButton.propTypes = {
  direction: PropTypes.oneOf(["previous", "next"]).isRequired,
  onClick: PropTypes.func.isRequired,
};