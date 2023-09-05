import DataTable from "react-data-table-component";
import { formatSwitch, moveElementInArray, splitTableIntoFour } from "../utils/helperFunctions";
import "./ExpandedDetailsTable.css";

const ExpandedDetailsTable = ({data}) => {
    const rowData = Object.entries(data).map(([key,value], index) => {
        const switchData = formatSwitch(key, value);
        return {[key]: switchData};
    });
    let splitTables = splitTableIntoFour(rowData);
    splitTables[3] = moveElementInArray(splitTables[3], 11, 8);

    const detailsCol1 = [
        {
            selector: (row) => Object.entries(row).map(([key,value], index) => [<p><b>{key}:</b> {value}</p>]),
            compact: true,
        }
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '30px',
                fontSize: '12px'
            }
        },
    };

    return (
    <div id="expanded-details-data-table-container" className="row" >
        <div id="expanded-details-data-table1" className="col-2">
            <DataTable columns={detailsCol1}
            data={splitTables[0]} highlightOnHover striped customStyles={customStyles}/>
        </div>
        <div id="expanded-details-data-table2" className="col-2">
        <DataTable columns={detailsCol1}
            data={splitTables[1]} highlightOnHover striped customStyles={customStyles}/>
        </div>
        <div id="expanded-details-data-table3" className="col-2">
        <DataTable columns={detailsCol1}
            data={splitTables[2]} highlightOnHover striped customStyles={customStyles}/>
        </div>
        <div id="expanded-details-data-table4" className="col-2">
        <DataTable columns={detailsCol1}
            data={splitTables[3]} highlightOnHover striped customStyles={customStyles}/>
        </div>
    </div>

    );


}

export default ExpandedDetailsTable;