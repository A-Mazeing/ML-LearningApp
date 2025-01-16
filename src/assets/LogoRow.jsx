const LogoRow = ({ logoImgSrc }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginLeft: "100px", // Abstand zur linken Seite
                gap: "2rem", // Abstand zwischen den Logos
            }}
        >
            <img
                src={logoImgSrc}
                alt="EduInf-Logo"
                style={{ marginLeft: "-100px", width: "350px", height: "auto" }} // Angepasste Breite
            />
        </div>
    );
};

export default LogoRow;
