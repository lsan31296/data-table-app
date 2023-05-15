import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchData } from './api';
import BaseTable from './data-table/BaseTable';


function App() {
  const [tableData, setTableData] = useState(null);

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
      <BaseTable
        tableData={tableData}
      />
    );
  }


}

export default App;
