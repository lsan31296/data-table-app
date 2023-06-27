import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchAllRiskAccounts, fetchData } from './api';
//import BaseTable from './data-table/BaseTable';
//import AccountDateTable from './components/AccountDateTable';
import RiskHoldings from './drop-down/RiskHoldings';

//TESTING SYSTEM TIME STAMP


function App() {
  const [tableData, setTableData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [dropDownData, setDropDownData] = useState(null);
  //const [riskHoldingsData, setRiskHoldingsData] = useState(null);

  const loadData = async() => {
    //load all data for Account Details table. Test/Dummy API
    fetchData().then(res => {
      setTableData(res);
      setSearchData(res);
    });

    //load `DropDownMenu` data here from get-risk-accounts api call
    fetchAllRiskAccounts().then(res => {
      setDropDownData(res);
      //console.log("Drop Down Menu Data: ", res);
      //may or may not have to set searchData here with res BUT you would need to create a new custome BaseTable component.
      //and pass in the searchData as a parameter to the new BaseTable AS WELL AS conditionally render the new BaseTable on the existence of
      //drop down data
      })
    };

  useEffect(() => {
    loadData();
  }, []);

  //console.log("Table Data", tableData);

  

  if (!tableData || !dropDownData) {
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

      <main>
        <RiskHoldings dropDownData={dropDownData} tableData={tableData} handleSearch={handleSearch}/>

      </main>

      <footer className='footer'>
        <div className='container'>
        <div className='row text-center'>
          <div className='large-12 medium-12 small-12 columns'>
          <p>Copyright © 2023 <a href="/">Community Capital Management, LLC</a>.</p>
          <p>All Rights Reserved. <a href="#">Sitemap</a> | <a href="#">Regulatory Disclosures</a> | <a href="#">Regulatory Forms</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a> | <a href="#" target="_blank" class="external">A PaperStreet Web Design</a></p>
          </div>
        </div>
        </div>

      </footer>
    </>
    );
  }


}

export default App;
