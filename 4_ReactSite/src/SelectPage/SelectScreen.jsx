import SelectCard from "../assets/SelectCard.jsx";
import PlaceHolderImgSrc from "../assets/Placeholder.png"

export default function Select() {
    return (
        <>
            <SelectCard titel={"Freies Testen"} text={"Hier kannst du dein zuvor eingebundenes Modell eigenständig testen."} buttonText={""} imgSrc={PlaceHolderImgSrc}></SelectCard>

            <SelectCard titel={"Testen mit Testdaten"} text={"Hier wird dein Modell mit speziellen Testdaten getestet."} buttonText={""} imgSrc={PlaceHolderImgSrc}></SelectCard>
        </>
    );
}