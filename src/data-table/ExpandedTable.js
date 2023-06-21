import { splitTableIntoFour } from "../utils/helperFunctions";


const ExpandedTable = ({ data }) => {
    
    const rows = Object.entries(data).map(([key, value], index) => {
        console.log("Index: ", index);
        return (
            <tr key={index} style={{ borderBottom:"solid 1px grey" }}>
                <td style={{ fontSize: "12px", fontWeight: "bold" }}>{key}:</td>
                <td style={{ fontSize: "12px" }}>
                    {typeof(value) === "boolean" ?
                        <input className="form-check-input" type="checkbox" value="" disabled checked={value === true ? true : false }/>
                    : 
                        value ? value : "Empty"
                    }
                </td>
            </tr>
        )
    });

    //for (let i=0; i<rows.length; i++) {

    //}
    const splitTables = splitTableIntoFour(rows);
    console.log(splitTables[0]);

    
    return (
        <div className="container-fluid">
            <div className="row g-0">
                <div className="col" style={{ /*border: "green solid 3px"*/ }}>
                    {splitTables[0]}            
                </div>
                <div className="col" style={{ /*border: "orange solid 3px"*/ }}>
                    {splitTables[1]}              
                </div>
                <div className="col" style={{ /*border: "yellow solid 3px"*/ }}>
                    {splitTables[2]}            
                </div>
                <div className="col" style={{ /*border: "red solid 3px"*/ }}>
                    {splitTables[3]}    
                </div>        
            </div>
        </div>
    )

    /*
    return (
        <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
    */
}

export default ExpandedTable;