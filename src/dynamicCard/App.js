import React, { useEffect, useState, useCallback, useRef } from 'react';
import ApiService from './Api.js';
import './App.css';

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
  const [cardState, setCardState] = useState({});

  const handleActionClick = useCallback((action, id) => {
    setCardState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        actionType: action,
        showRemarksInput: true,
        isCTFlow: action === 'COMPLETE',
        isManagerFlow: action !== 'COMPLETE',
      },
    }));
  }, []);

  const handleCompleteRemarks = useCallback((choice, id) => {
    const remarks = cardState[id]?.remarks || '';
    if (choice === 'APPROVED') {
      towerApproval(id, 'APPROVED', remarks);
    } else {
      towerApproval(id, 'REJECTED', remarks);
    }
    resetCardState(id);
  }, [cardState]);

  const handleSubmitRemarks = useCallback((id) => {
    const actionType = cardState[id]?.actionType;
    const remarks = cardState[id]?.remarks || '';
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
    resetCardState(id);
  }, [cardState]);

  const handleInputChange = useCallback((event, id) => {
    const { value } = event.target;
    setCardState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        remarks: value,
      },
    }));
  }, []);

  const resetCardState = useCallback((id) => {
    setCardState((prevState) => ({
      ...prevState,
      [id]: {
        showRemarksInput: false,
        remarks: '',
        actionType: '',
        isCTFlow: false,
        isManagerFlow: false,
      },
    }));
  }, []);

  const App = React.memo(({ jsonData }) => {
    const card = cardState[jsonData.id] || {};
    if (!jsonData || !jsonData.header) {
      return <div>Loading...</div>;
    }
    return (
      <div className="card">
        <HeaderSection
          jsonData={jsonData}
          handleActionClick={handleActionClick}
        />
        <LabelChipsSection labelChips={jsonData.labelChips} />
        <BodySection body={jsonData.body} />
        <FooterSection
          jsonData={jsonData}
          card={card}
          handleInputChange={handleInputChange}
          handleCompleteRemarks={handleCompleteRemarks}
          handleSubmitRemarks={handleSubmitRemarks}
          resetCardState={resetCardState}
        />
      </div>
    );
  });

  const HeaderSection = React.memo(({ jsonData, handleActionClick }) => {
    return (
      <div className="card-header">
        <h3>{Object.values(jsonData?.header).join(' | ')}</h3>
        <div className="approvalButtons">
          <button
            className="rejectButton"
            onClick={() => handleActionClick('REJECT', jsonData.id)}
            hidden={jsonData?.labelChips['Manager Status'] !== 'PENDING'}
          >
            Reject
          </button>
          <button
            className="approveButton"
            onClick={() => handleActionClick('APPROVE', jsonData.id)}
            hidden={jsonData?.labelChips['Manager Status'] !== 'PENDING'}
          >
            Approve
          </button>
          <button
            className="completeButton"
            onClick={() => handleActionClick('COMPLETE', jsonData.id)}
            hidden={jsonData?.labelChips['Control Tower Status'] !== 'PENDING'}
          >
            Mark As Completed
          </button>
        </div>
      </div>
    );
  });

  const LabelChipsSection = React.memo(({ labelChips }) => {
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
  });

  const BodySection = React.memo(({ body }) => {
    return (
      <div className="card-body">
        {Object.keys(body).map((key) => (
          <div key={key}>
            <span className="module-chips">
              <strong>{key}{': '}</strong>
              {body[key].join(', ')}
            </span>
          </div>
        ))}
      </div>
    );
  });

  const FooterSection = React.memo(({
    jsonData,
    card,
    handleInputChange,
    handleCompleteRemarks,
    handleSubmitRemarks,
    resetCardState,
  }) => {
    const textareaRef = useRef(null);
  
    useEffect(() => {
      if (card.showRemarksInput && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [card.showRemarksInput]);
  
    return (
      <>
        <div className="card-footer">
          {Object.keys(jsonData?.footer).map((key) => (
            <span key={key}>
              <strong>{key}:</strong> {jsonData?.footer[key]}{'   '}{' '}
            </span>
          ))}
        </div>
        {card.showRemarksInput && (
          <>
            <div className="remarks-input">
              <textarea
                className="remarks-text"
                ref={textareaRef}
                value={card.remarks || ''}
                onChange={(event) => handleInputChange(event, jsonData.id)}
                placeholder="Enter your remarks here"
              />
            </div>
            <div className="approvalButtons">
              {card.isCTFlow && !card.isManagerFlow && (
                <button
                  className="approveButton"
                  onClick={() => handleCompleteRemarks('APPROVED', jsonData.id)}
                >
                  Approve
                </button>
              )}
              {card.isCTFlow && !card.isManagerFlow && (
                <button
                  className="completeButton"
                  onClick={() => handleCompleteRemarks('REJECTED', jsonData.id)}
                >
                  Reject
                </button>
              )}
              {card.isManagerFlow && !card.isCTFlow && (
                <button
                  className="completeButton"
                  onClick={() => handleSubmitRemarks(jsonData.id)}
                >
                  Submit
                </button>
              )}
              <button
                className="rejectButton"
                onClick={() => resetCardState(jsonData.id)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </>
    );
  });
  

  return (
    <>
      <div className="pageHeader">
        <div>Access Request Listing</div>
      </div>
      <div className="app-listing">
        {listingData.map((data) => (
          <App key={data.id} jsonData={data} />
        ))}
      </div>
    </>
  );
}

export default AppListing;
