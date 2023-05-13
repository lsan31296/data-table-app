import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchData } from './api';
import DataTable from 'react-data-table-component';

function App() {
  const [tableData, setTableData] = useState(null);

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

  useEffect(() => {
    const loadData = async() => {
      fetchData().then(setTableData);
    };

    loadData();
  }, []);

  console.log("Table Date", tableData);

  if (!tableData) {
    return <h1>Loading...</h1>
  } else {
    return (
      <div >
        <DataTable
          columns={columnHeaders}
          data={tableData}
        />
      </div>
    );
  }


}

export default App;
