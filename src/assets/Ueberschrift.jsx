import PropTypes from "prop-types";

const Ueberschrift = ({ text , font_size = '65px'}) => {
    const getStyle = (letter) => ({
        fontSize: font_size,
        fontWeight: 'bold',
        color: letter === 'K' || letter === 'I' ? '#ff3c5f' : '#ffffff',
    });

    return (
        <div>
            {text.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} style={{ display: 'flex', gap: '2px' }}>
                    {line.split('').map((letter, letterIndex) => (
                        <div key={letterIndex} style={getStyle(letter)}>
                            {letter}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// PropTypes deklarieren
Ueberschrift.propTypes = {
    text: PropTypes.string.isRequired, // 'text' muss ein String sein
    font_size: PropTypes.string,
};


export default Ueberschrift;

