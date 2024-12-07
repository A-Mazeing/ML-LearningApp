import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import PropTypes from "prop-types";

export default function SelectCard({titel, text, buttonText, imgSrc}) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={imgSrc}
                    alt="Hier könnte ein Bild sein"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {titel}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {text}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    );
}

SelectCard.propTypes = {
    titel: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired
}