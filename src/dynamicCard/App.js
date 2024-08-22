import React, { useEffect, useState } from 'react';
import ApiService from './Api.js';
import './App.css';

function App({ jsonData }) {

  if (!jsonData || !jsonData.header) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card">
      <HeaderSection header={jsonData.header} />
      <LabelChipsSection labelChips={jsonData.labelChips} />
      <BodySection body={jsonData.body} />
      <FooterSection footer={jsonData.footer} />
    </div>
  );
}

function AppListing() {
  const [listingData, setListingData] = useState([]);

  useEffect(() => {

    ApiService.getListing()
      .then((responseData) => {
        setListingData(responseData);
      })
      .catch((error) => {
        console.error('Error in useEffect:', error);
      });
  }, []);
  return (
    <div className="app-listing">
      {listingData.map((data, index) => (
        <App jsonData={data} />
      ))}
    </div>
  );
}

function HeaderSection({ header }) {
  return (
    <div className="card-header">
      <h2>
        {Object.values(header).join(' | ')}
      </h2>
      <div className='approvalButtons'>
        <button
          className="rejectButton"
        // onClick={() => handleActionClick('REJECT')}
        // hidden={accessRequestData.approvalStatus !== 'PENDING'}
        >
          Reject
        </button>
        <button
          className="approveButton"
        // onClick={() => handleActionClick('APPROVE')}
        // hidden={accessRequestData.approvalStatus !== 'PENDING'}
        >
          Approve
        </button>
        <button
          className="completeButton"
        // onClick={() => handleActionClick('COMPLETE')}
        // hidden={accessRequestData?.controlTowerStatus !== 'PENDING'}
        >
          Mark As Completed
        </button>
      </div>
    </div>
  );
}

function LabelChipsSection({ labelChips }) {
  return (
    <div className="card-labelChips">
      <div className="chips-container">
        {Object.keys(labelChips).map((key) => (
          <div key={key} className="chip">
            <strong>{key}:</strong> {labelChips[key]}
          </div>
        ))}
      </div>
    </div>
  );
}

function BodySection({ body }) {
  return (
    <div className="card-body">
      {Object.keys(body).map((key) => (
        <div key={key}>
          <span className="module-chips"><strong>{key}{': '}</strong>{body[key].join(', ')}</span>
        </div>
      ))}
    </div>
  );
}

function FooterSection({ footer }) {
  return (
    <div className="card-footer">
      {Object.keys(footer).map((key) => (
        <span key={key}>
          <strong>{key}:</strong> {footer[key]}{('   ')}{ }
        </span>
      ))}
    </div>
  );
}

export default AppListing;
