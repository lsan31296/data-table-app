import DataTable from 'react-data-table-component';
import ExpandedTable from './ExpandedTable';

/**
 * Responsible for displaying the base table with 10 columns and rows compressed.
 * @param {array} {tableData} 
 * tableData is an array of objects. Each object represents a row of data associated to a particular account.
 * @returns {JSX.Element}
 */
function BaseTable({ tableData, handleSearch }) {
    const columnHeaders = [
        { name: 'Issuer', selector: row => row.issuer },
        { name: 'Loan Amount', selector: row => row.loan_amount },
        { name: 'State Code', selector: row => row.state_code },
        { name: 'Market Value', selector: row => row.market_value },
        { name: 'Pool Number', selector: row => row.pool_number },
        { name: 'Fund Ticker', selector: row => row.fund_ticker },
        { name: 'Security Group', selector: row => row.security_group },
        { name: 'Security Type', selector: row => row.security_type },
        { name: 'Security Sector', selector: row => row.security_sector },
        { name: 'Weight', selector: row => row.weight },
    ]

    return (
        <div style={{ padding: "5% 4%" }}>
            <div style={{ display: "flex", justifyContent: "right" }}>
                <input type='text' placeholder='Search...' onChange={handleSearch} />
            </div>
            <DataTable
                columns={columnHeaders}
                data={tableData}
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