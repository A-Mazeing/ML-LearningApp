import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export default function SelectMode({ eventFunc, items }) {
    const [valu, setVal] = React.useState(items.length > 0 ? items[0].value : '');

    const handleChange = (event) => {
        setVal(event.target.value);
        eventFunc(event.target.value); // Event-Funktion mit dem aktuellen Wert aufrufen
    };

    return (
        <div>
            <FormControl
                sx={{
                    m: 1,
                    minWidth: 50, // Minimale Breite
                    border: '2px solid #9340ff', // Umrandung
                    borderRadius: '4px',
                    "& .MuiInputLabel-root": {
                        color: "white", // Label-Farbe
                    },
                    "& .MuiSelect-select": {
                        color: "white", // Textfarbe des ausgewählten Werts
                        textAlign: "left", // Text linksbündig
                        width: "auto", // Automatische Breitenanpassung
                        display: "inline-block", // Blockelement für dynamische Breite
                        backgroundColor: "transparent", // Hintergrundfarbe des Selects
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#9340ff",
                    },
                }}
            >
                <InputLabel id="demo-simple-select-autowidth-label">Modus ausw&#228;hlen</InputLabel>
                <Select
                    value={valu}
                    onChange={handleChange}
                    autoWidth
                    label="Anzeige Modus"
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: "#101728", // Menü-Hintergrundfarbe
                            },
                        },
                    }}
                >
                    {items.map((item, index) => (
                        <MenuItem
                            key={index}
                            value={item.value}
                            sx={{
                                color: "white", // Textfarbe der Menüeinträge
                                textAlign: "left", // Text linksbündig
                                backgroundColor: "#101728", // Hintergrundfarbe der Menüeinträge
                                '&:hover': {
                                    backgroundColor: "#101728", // Hover-Hintergrundfarbe
                                },
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

SelectMode.propTypes = {
    eventFunc: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};
