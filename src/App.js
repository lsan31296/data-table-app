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
    <>
      <div className='desktop-top-bar'>
        <a href='#'>CRA Investors</a>
        <a href='#'>Impact Investors</a>
        <a href='#'>Contact Us</a>
      </div>

      <header className='header'>
        <div className='row'>
        <div className='large-4 columns'>
          <img src="https://www.ccminvests.com/wp-content/themes/paperstreet/images/logo.jpg" alt="CCM Investments" />
        </div>
        </div>
      </header>

      <BaseTable
        tableData={tableData}
        handleSearch={handleSearch}
      />

      <footer className='footer'>
        <div className='row text-center'>
          <div className='large-12 medium-12 small-12 columns'>
          <p>Copyright © 2023 <a href="/">Community Capital Management, LLC</a>.</p>
          <p>All Rights Reserved. <a href="#">Sitemap</a> | <a href="#">Regulatory Disclosures</a> | <a href="#">Regulatory Forms</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a> | <a href="#" target="_blank" class="external">A PaperStreet Web Design</a></p>
          </div>
        </div>
      </footer>
    </>
    );
  }

}

export default App;
