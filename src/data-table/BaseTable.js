import DataTable from "react-data-table-component";
import ExpandedTable from "./ExpandedTable";
//import { downloadCSV, dollarFormatter } from '../utils/helperFunctions';
import ExportCSV from "../ExportCSV";
import { dollarFormatter } from "../utils/helperFunctions";

/**
 * Responsible for displaying the base table with 10 columns and rows compressed.
 * @param {array} {tableData}
 * tableData is an array of objects. Each object represents a row of data associated to a particular account.
 * @returns {JSX.Element}
 */
function BaseTable({ tableData, handleSearch }) {
  const columnHeaders = [
    { name: "Issuer", selector: (row) => row.issuer, sortable: true },
    {
      name: "Loan Amount",
      selector: (row) => row.loan_amount,
      sortable: true,
      format: (row) => dollarFormatter.format(row.loan_amount),
    },
    { name: "State Code", selector: (row) => row.state_code, sortable: true },
    {
      name: "Market Value",
      selector: (row) => row.market_value,
      sortable: true,
      format: (row) => dollarFormatter.format(row.market_value),
    },
    { name: "Pool Number", selector: (row) => row.pool_number, sortable: true },
    { name: "Fund Ticker", selector: (row) => row.fund_ticker, sortable: true },
    {
      name: "Security Group",
      selector: (row) => row.security_group,
      sortable: true,
    },
    {
      name: "Security Type",
      selector: (row) => row.security_type,
      sortable: true,
    },
    {
      name: "Security Sector",
      selector: (row) => row.security_sector,
      sortable: true,
    },
    {
      name: "Weight",
      selector: (row) => row.weight,
      sortable: true,
      format: (row) => row.weight.toFixed(4),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "white",
        color: "#1B3668",
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "12px",
      },
    },
  }; //create custom styles example below

  /*
        {
            headRow: {
                style: {
                    backgroundColor: 'blue',
                    color: 'white;
                }
            },
            headCells: {
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                },
            },
            cells: {
                style: {
                    fontSize: '15px'
                }
            }
        }
    */

  return (
    <div style={{ padding: "1% 4%", backgroundColor: "#F2F2F2", /*border: "purple solid 2px"*/ }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#1B3668",
          color: "white",
          padding: "2px",
          //border: "red solid 2px",
        }}
      >
        <h3>Account Details</h3>
        <div>
          <input type="text" placeholder="Search..." onChange={handleSearch} />
          <ExportCSV csvData={tableData} fileName="Account Details" />
          {/* <button className="btn btn-primary"onClick={() => downloadCSV(tableData)} >Export</button> */}
        </div>
      </div>
      <DataTable
        columns={columnHeaders}
        data={tableData}
        customStyles={customStyles}
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={ExpandedTable}
        highlightOnHover
        striped
      />
    </div>
  );
}

export default BaseTable;
