import Select from "react-select";

/* This component will be responsible for displaying and handling the logic contained in the multi-select drop down menu */
function MultiSelectMenu({rowsForSelect, handleMultiSelectChange, handleMenuClose}) {

    return (
        <Select
            isMulti
            name="issuers"
            options={rowsForSelect}
            className="basic-multi-select"
            classNamePrefix="select"
            theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                    ...theme.colors,
                    primary25: '#0d6efd',
                    primary: 'black',
                },
            })}
            styles={{
                option: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                }),
            }}
            onChange={handleMultiSelectChange}
            closeMenuOnSelect={false}
            onMenuClose={handleMenuClose}
            placeholder={"Select Risk Holdings Accounts by Name..."}
        />
    );
}

export default MultiSelectMenu;