import React, { useEffect, useState } from 'react';
import ApiService from './Api.js';
import './App.css';
import { json } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';


function reject(id, reviewRemarks) {
  ApiService.reject(id, reviewRemarks);
}

function approve(id, reviewRemarks) {
  ApiService.approve(id, reviewRemarks);
}

function towerApproval(id, status, reviewRemarks) {
  ApiService.towerApproval(id, status, reviewRemarks);
}

function AppListing() {

  useEffect(() => {
    ApiService.getListing()
      .then((responseData) => {
        setListingData(responseData);
      })
      .catch((error) => {
        console.error('Error in useEffect:', error);
      });
  }, []);

  const [listingData, setListingData] = useState([]);
  const [showRemarksInput, setShowRemarksInput] = useState(false);
  const [isCTFlow, setIsCTFLow] = useState(false);
  const [isManagerFlow, setIsManagerFlow] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('');

  // const navigate = useNavigate();
  // const handleButtonClick = () => {
  //   navigate('/newRequest');
  // };

  const handleActionClick = (action) => {
    setActionType(action);
    setShowRemarksInput(true);
    if (action === 'COMPLETE') {
      setIsCTFLow(true); setIsManagerFlow(false);
    } else {
      setIsManagerFlow(true); setIsCTFLow(false);
    }
  };

  const handleCompleteRemarks = (choice, id) => {
    if (choice === 'APPROVED') {
      towerApproval(id, 'APPROVED', remarks);
    } else {
      towerApproval(id, 'REJECTED', remarks);
    }
    setShowRemarksInput(false);
    setRemarks('');
    setActionType('');
    setIsCTFLow(false);
    setIsManagerFlow(false);
  }

  const handleSubmitRemarks = (id) => {
    switch (actionType) {
      case 'REJECT':
        reject(id, remarks);
        break;
      case 'APPROVE':
        approve(id, remarks);
        break;
      default:
        break;
    }
    setShowRemarksInput(false);
    setRemarks('');
    setActionType('');
    setIsCTFLow(false);
    setIsManagerFlow(false);
  };

  const handleInputChange = (event) => {
    setRemarks(event.target.value);
  };


  const App = ({ jsonData }) => {
    if (!jsonData || !jsonData.header) {
      return <div>Loading...</div>;
    }
    return (
      <div className="card">
        <HeaderSection jsonData={jsonData} />
        <LabelChipsSection labelChips={jsonData.labelChips} />
        <BodySection body={jsonData.body} />
        <FooterSection jsonData={jsonData} />
      </div>
    );
  }

  const HeaderSection = ({ jsonData }) => {
    return (
      <div className="card-header">
        <h3>
          {Object.values(jsonData?.header).join(' | ')}
        </h3>
        <div className='approvalButtons'>
          <button
            className="rejectButton"
            onClick={() => handleActionClick('REJECT')}
            hidden={jsonData?.labelChips["Manager Status"] !== 'PENDING'}
          >
            Reject
          </button>
          <button
            className="approveButton"
            onClick={() => handleActionClick('APPROVE')}
            hidden={jsonData?.labelChips["Manager Status"] !== 'PENDING'}
          >
            Approve
          </button>
          <button
            className="completeButton"
            onClick={() => handleActionClick('COMPLETE')}
            hidden={jsonData?.labelChips["Control Tower Status"] !== 'PENDING'}
          >
            Mark As Completed
          </button>
        </div>
      </div>
    );
  }

  const LabelChipsSection = ({ labelChips }) => {
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

  const BodySection = ({ body }) => {
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

  const FooterSection = ({ jsonData }) => {
    return (
      <>
        <div className="card-footer">
          {Object.keys(jsonData?.footer).map((key) => (
            <span key={key}>
              <strong>{key}:</strong> {jsonData?.footer[key]}{('   ')}{ }
            </span>
          ))}
        </div>
        <>
          {showRemarksInput && (
            <>
              <div className="remarks-input">
                <textarea className="remarks-text"
                  value={remarks}
                  onChange={handleInputChange}
                  placeholder="Enter your remarks here"
                />
              </div>
              <div className='approvalButtons'>
                {isCTFlow && !isManagerFlow && <button className='approveButton' onClick={() => handleCompleteRemarks('APPROVED', jsonData?.id)} >Approve</button>}
                {isCTFlow && !isManagerFlow && <button className='completeButton' onClick={() => handleCompleteRemarks('REJECTED', jsonData?.id)} >Reject</button>}
                {isManagerFlow && !isCTFlow && <button className='completeButton' onClick={() => handleSubmitRemarks(jsonData?.id)} >Submit</button>}
                <button className='rejectButton' onClick={() => (setShowRemarksInput(false), setIsCTFLow(false), setIsManagerFlow(false))}>Cancel</button>
              </div>
            </>
          )}
        </>
      </>
    );
  }

  return (
    <>
      <div className='pageHeader'>
        <div>Access Request Listing</div>
        {/* <div><button className='newButton' onClick={handleButtonClick}>Raise New Request</button></div>
        <div className='filterButtons'>
          <button className='newButton' onClick={() => navigate('/')}>All</button>
          <button className='newButton' onClick={() => navigate('/allPending')}>Pending</button>
          <button className='newButton' onClick={() => navigate('/allRejected')}>Rejected</button>
          <button className='newButton' onClick={() => navigate('/allApproved')}>Approved</button>
          <button className='newButton' onClick={() => navigate('/allCompleted')}>Completed</button>
        </div> */}
      </div>
      <div className="app-listing">
        {listingData.map((data, index) => (
          <App jsonData={data} />
        ))}
      </div>
    </>
  );
}

export default AppListing;
