

const ExpandedTable = ({ data }) => {
    
    const rows = Object.entries(data).map(([key, value]) => {
        return (
            <tbody>
            <tr style={{ borderBottom:"solid 1px grey" }}>
                <td style={{ fontSize: "12px", fontWeight: "bold" }}>{key}:</td>
                <td style={{ fontSize: "12px" }}>
                    {typeof(value) === "boolean" ?
                        <input className="form-check-input" type="checkbox" value="" disabled checked={value === true ? true : false }/>
                    : 
                        value ? value : "Empty"
                    }
                </td>
            </tr>
            </tbody>
        )
    });


    //console.log(rows);

    return (
        <>
        <table>
            {rows}
        </table>
        </>
    )
}

export default ExpandedTable;