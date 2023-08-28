import Select from "react-select";

/* This funcition is responsible for displaying the values for which the user can choose to pull data for. */
export default function SingleSelectMenu({ rowsForSelect, handleSingleSelectChange, handleMenuClose }) {
    return (
        <Select 
            className="basic-single form-control"
            id="singleSelect"
            classNamePrefix="select"
            options={rowsForSelect}
            name="issuers"
            onChange={handleSingleSelectChange}
            closeMenuOnSelect={true}
            onMenuClose={handleMenuClose}
            placeholder={"Select Risk Holding Account by Name..."}
            styles={{
                option: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                    alignItems: "center",
                    display: "flex"
                }),
                menu: (provided) => ({...provided, zIndex: 9999}),
            }}
            isSearchable={true}
            isClearable={true}
        />
    )
}