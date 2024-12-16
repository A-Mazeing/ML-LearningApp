import PropTypes from "prop-types";

const ShadowImage = ({source, width, height}) => {
    const shadowSize = Math.max(width, height) * 0.15; // Der Schatten soll im Verhältnis zur größten Dimension des Bildes stehen
    return (
        <div
            style={{
                display: 'inline-block',
                width: width,
                height: height,
                borderRadius: '50%',
                boxShadow: `0 0 ${shadowSize}px ${shadowSize / 2}px rgba(0, 0, 255, 0.4)`, // Schatten im Verhältnis zur Bildgröße
                position: 'relative'
            }}
        >
            <img
                src={source}
                alt="Hier müsste ein Bild erscheinen"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Passt das Bild an den runden Container an
                    borderRadius: '5%', // Für die runde Form
                    marginBottom: '-5%'
                }}
            />
        </div>
    )
}

export default ShadowImage;

ShadowImage.propTypes = {
    source: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
};