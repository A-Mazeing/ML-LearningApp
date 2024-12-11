export default function BarComponent({ value, label, classIndex }) {
    const classColors = [
        "#fdc311",  // Klasse 1
        "#8eff0b",  // Klasse 2
        "#ff5757",  // Klasse 3
        "#e32c4c",  // Klasse 4
    ];

    const barColor = classColors[classIndex] || "#4CAF50";

    return (
        <div style={{ margin: "40px 0", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "25px", marginRight: "5px" }}>{label}</div>
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
                    <div style={{ marginLeft: "8px", fontSize: "22px" }}>{value}%</div>
                </div>
            </div>
        </div>
    );
}
