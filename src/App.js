import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchData } from './api';
import BaseTable from './data-table/BaseTable';


function App() {
  const [tableData, setTableData] = useState(null);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const loadData = async() => {
      fetchData().then(res => {
        setTableData(res);
        setSearchData(res);
      });
    };

    loadData();
  }, []);

  //console.log("Table Data", tableData);

  

  if (!tableData) {
    return <h1>Loading...</h1>
  } else {
    const handleSearch = ({target}) => {
      const newData = searchData.filter(row => row.issuer.toLowerCase().includes(target.value.toLowerCase()) 
      || row.state_code.toLowerCase().includes(target.value.toLowerCase())
      || row.loan_amount.toString().includes(target.value)
      || row.market_value.toString().includes(target.value)
      || row.pool_number.toLowerCase().includes(target.value.toLowerCase())
      || row.fund_ticker.toLowerCase().includes(target.value.toLowerCase())
      || row.security_group.toLowerCase().includes(target.value.toLowerCase())
      || row.security_type.toLowerCase().includes(target.value.toLowerCase())
      || row.security_sector.toLowerCase().includes(target.value.toLowerCase())
      || row.weight.toString().includes(target.value.toString())
      );
      setTableData(newData);
    };

    return (
      <BaseTable
        tableData={tableData}
        handleSearch={handleSearch}
      />
    );
  }

}

export default App;
