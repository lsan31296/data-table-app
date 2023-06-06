import React from "react";
import Select from "react-select";
//This component is responsible for displaying a drop down menu which may be used for sending requests,
//exporting selected accounts, etc.

function DropwDownMenu({ tableData }) {
    //Make state variable to track rows selected

    //console.log(tableData)//data successfully pass down as prop
    const dropDownRowNames = [];
    for (let i = 0; i < tableData.length; i++) (
        dropDownRowNames.push(tableData[i].issuer)
    )


    const rowsForSelect = dropDownRowNames.map((name) => (
        { value: name, label: name.slice(0, 12) }
    ));

    const handleMultiSelectChange = (value) => {
        console.log(value);//produces an array of objects
    }


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
        />
    )
}

export default DropwDownMenu;