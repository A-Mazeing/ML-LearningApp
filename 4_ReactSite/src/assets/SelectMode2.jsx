import { FormControl, NativeSelect } from "@mui/material";
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
            <FormControl fullWidth>
                <NativeSelect

                    IconComponent={() => (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7 10L12 15L17 10H7Z"
                                fill="white"
                            />
                        </svg>
                    )}
                >
                    {items.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                            style={{
                                backgroundColor: '#18142c',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            {ite.label}
                        </option>
                    ))}
                </NativeSelect>
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
