import PropTypes from "prop-types";

export default function BarComponent({ value, label, classIndex }) {
    const classColors = [
        "#ffbd59",  // Klasse 1
        "#c1ff72",  // Klasse 2
        "#ff5757",  // Klasse 3
        "#ff3c5f",  // Klasse 4
    ];

    const barColor = classColors[classIndex] || "#4CAF50";

    return (
        <div style={{ margin: "10px 0", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "14px" }}>{label}</div>
                <div style={{ display: "flex", alignItems: "center", width: "70%" }}>
                    <div
                        style={{
                            height: "20px",
                            width: `${value}%`,
                            backgroundColor: barColor,
                            borderRadius: "4px",
                            transition: "width 0.3s",
                        }}
                    ></div>
                    <div style={{ marginLeft: "8px", fontSize: "14px" }}>{value}%</div>
                </div>
            </div>
        </div>
    );
}

BarComponent.propTypes = {
    value: PropTypes.number.isRequired, // Prozentwert (0?100)
    label: PropTypes.string.isRequired, // Name der Klasse
    classIndex: PropTypes.number.isRequired,
};
