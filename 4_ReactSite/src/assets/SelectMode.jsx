import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export default function SelectMode({ eventFunc, items }) {
    const [val, setVal] = React.useState(items.length > 0 ? items[0].value : '');

    const handleChange = (event) => {
        setVal(event.target.value);
        eventFunc(event.target.value); // Event-Funktion mit dem aktuellen Wert aufrufen
    };

    return (
        <div>
            <FormControl sx={{minWidth: '300px'}}>
                <Select
                    value={val}  // Wert binden, um den Zustand zu reflektieren
                    onChange={handleChange}
                    inputProps={{
                        name: 'Modus ausw�hlen',
                        id: 'uncontrolled-native',
                    }}
                    sx={{
                        border: '2px solid #8948d2', // Lila Rahmen
                        borderRadius: '10px', // Abgerundeter Rahmen
                        color: 'white', // Wei�e Schriftfarbe
                        fontSize: '20px', // Schriftgr��e 20px
                        padding: '4px',
                        backgroundColor: '#18142c', // Hintergrundfarbe des Selects
                        '& .MuiSelect-icon': {
                            color: 'white', // Wei�es Dropdown-Symbol
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8948d2', // Lila Rahmen bei Fokus
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: "#101728", // Men�-Hintergrundfarbe
                            },
                        },
                    }}
                >
                    {items.map((item, index) => (
                        <MenuItem
                            key={index}
                            value={item.value}
                            sx={{
                                backgroundColor: '#18142c',
                                color: 'white',
                                textAlign: 'center',
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
