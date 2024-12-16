import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import PropTypes from "prop-types";

export default function SelectCard({ titel, text, imgSrc, onClick }) {
    return (
        <Card
            sx={{
                maxWidth: 345,
                borderRadius: 8, // Kartenabrundung
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Leichter Schatten
                backgroundColor: "transparent" // Kartenhintergrund transparent
            }}
        >
            <CardActionArea onClick={onClick}> {/* Leitet Klicks auf den gesamten Bereich */}
                <CardMedia
                    component="img"
                    height="140"
                    image={imgSrc}
                    alt="Hier könnte ein Bild sein"
                    sx={{
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8 // Abrundung für das Bild
                    }}
                />
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                            color: "#973dfa", // Schriftfarbe der Überschrift
                            fontWeight: "bold" // Fettschrift
                        }}
                    >
                        {titel}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#FFFFFF" // Restliches Text weiß
                        }}
                    >
                        {text.replace("eigenständig testem", "eigenständig testen")} {/* Textkorrektur */}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

SelectCard.propTypes = {
    titel: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired, // Neue Prop für den Clickhandler
};