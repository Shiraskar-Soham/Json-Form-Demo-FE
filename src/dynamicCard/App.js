import React from 'react';
import './App.css';

const jsonData = {
  "header": {
    "Employee Name": "Soham",
    "Department": "Technology",
    "Sub Dept": "Development",
    "Company Name": "Ofbusiness"
  },
  "labelChips": {
    "Date Created": "07/08/2024",
    "Email Id": "soham.shiraskar@ofbusiness.in",
    "Manager Status": "Approved",
    "Control Tower Status": "Pending"
  },
  "body": {
    "Oasys": ["RFQ", "Accounts"],
    "OFB Sales": ["Invoice", "Finance"]
  },
  "footer": {
    "Remarks": "View access for the modules",
    "Date Approved": "09/08/2024",
    "Approving Remarks": "Please give edit and view access"
  }
};

function App() {
  return (
    <div className="App">
      <Card data={jsonData} />
    </div>
  );
}

function Card({ data }) {
  return (
    <div className="card">
      <HeaderSection header={data.header} />
      <LabelChipsSection labelChips={data.labelChips} />
      <BodySection body={data.body} />
      <FooterSection footer={data.footer} />
    </div>
  );
}

function HeaderSection({ header }) {
    return (
      <div className="card-header">
        <h2>
          {Object.values(header).join(' | ')}
        </h2>
        <span className='approvalButtons'>
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
          </span>
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
            <p className="module-chips"><strong>{key}{': '}</strong>{body[key].join(', ')}</p>
          </div>
        ))}
      </div>
    );
  }

function FooterSection({ footer }) {
  return (
    <div className="card-footer">
      <p>
        {Object.keys(footer).map((key) => (
          <span key={key}>
            <strong>{key}:</strong> {footer[key]}{('   ')}{ }
          </span>
        ))}
      </p>
    </div>
  );
}

export default App;
