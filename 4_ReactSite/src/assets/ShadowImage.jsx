import PropTypes from "prop-types";

const ShadowImage = ({source, width, height}) => {
    const shadowSize = Math.max(width, height) * 0.15; // Der Schatten soll im Verh�ltnis zur gr��ten Dimension des Bildes stehen
    return (
        <div
            style={{
                display: 'inline-block',
                width: width,
                height: height,
                borderRadius: '50%',
                boxShadow: `0 0 ${shadowSize}px ${shadowSize / 2}px rgba(0, 0, 255, 0.4)`, // Schatten im Verh�ltnis zur Bildgr��e
                position: 'relative'
            }}
        >
            <img
                src={source}
                alt="Hier m�sste ein Bild erscheinen"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Passt das Bild an den runden Container an
                    borderRadius: '5%', // F�r die runde Form
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