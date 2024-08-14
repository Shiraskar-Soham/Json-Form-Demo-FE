import React, { useEffect, useState } from 'react'
import ApiService from './Api';
import './App.css'
import { useNavigate } from 'react-router-dom';

function reject(id, reviewRemarks) {
  ApiService.reject(id, reviewRemarks);
}

function approve(id, reviewRemarks) {
  ApiService.approve(id, reviewRemarks);
}

function towerApproval(id, status, reviewRemarks) {
  ApiService.towerApproval(id, status, reviewRemarks);
}

function AccessRequestListing() {
  const [listData, setListData] = useState([]);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/newRequest');
  };
  useEffect(() => {
    ApiService.getListing()
      .then((responseData) => {
        setListData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching access request list:', error);
      });
  }, []);

  const AccessRequestCard = ({ accessRequestData }) => {
    const [showRemarksInput, setShowRemarksInput] = useState(false);
    const [isCTFlow, setIsCTFLow] = useState(false);
    const [isManagerFlow, setIsManagerFlow] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [actionType, setActionType] = useState('');

    const handleActionClick = (action) => {
      setActionType(action);
      setShowRemarksInput(true);
      if (action === 'COMPLETE') {
        setIsCTFLow(true); setIsManagerFlow(false);
      } else {
        setIsManagerFlow(true); setIsCTFLow(false);
      }
    };

    const handleCompleteRemarks = (choice) => {
      if (choice === 'APPROVED') {
        towerApproval(accessRequestData?.id, 'APPROVED', remarks);
      } else {
        towerApproval(accessRequestData?.id, 'REJECTED', remarks);
      }
      setShowRemarksInput(false);
      setRemarks('');
      setActionType('');
      setIsCTFLow(false);
      setIsManagerFlow(false);
    }

    const handleSubmitRemarks = () => {
      switch (actionType) {
        case 'REJECT':
          reject(accessRequestData?.id, remarks);
          break;
        case 'APPROVE':
          approve(accessRequestData?.id, remarks);
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

    return (
      <div className="card">
        <div className="card-header">
          <h3><span className='card-heading'>
            {accessRequestData?.employeeName || "Employee Name"} | {accessRequestData?.subDepartment} | {accessRequestData?.employeeCompany}
          </span></h3>
          <span className='approvalButtons'>
            <button
              className="rejectButton"
              onClick={() => handleActionClick('REJECT')}
              hidden={accessRequestData.approvalStatus !== 'PENDING'}
            >
              Reject
            </button>
            <button
              className="approveButton"
              onClick={() => handleActionClick('APPROVE')}
              hidden={accessRequestData.approvalStatus !== 'PENDING'}
            >
              Approve
            </button>
            <button
              className="completeButton"
              onClick={() => handleActionClick('COMPLETE')}
              hidden={accessRequestData?.controlTowerStatus !== 'PENDING'}
            >
              Mark As Completed
            </button>
          </span>
        </div>
        <div className="card-content">
          <div className='details-section'>
            <span><strong>Email:</strong> {accessRequestData?.emailId}</span>
            <span><strong>Approving Manager:</strong> {accessRequestData?.approvingManagerName || "N/A"}</span>
            <span hidden={accessRequestData.approvalStatus === 'PENDING'}><strong>Approval Status:</strong> {accessRequestData?.approvalStatus}</span>
            <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Completed:</strong> {accessRequestData?.controlTowerStatus}</span>
            <span><strong>Date Created:</strong> {new Date(accessRequestData?.dateCreated).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}</span>
            <span><strong>Company Application:</strong> {accessRequestData?.companyName}</span>
          </div>
          <div>
            <strong>Modules (System Wise):</strong>
            <div className="modules-list">
              {Object.entries(accessRequestData?.modules || {}).map(([system, modules], index) => (
                <div key={index} className="module-group">
                  <ul><span>{system}</span> : <span>{modules.join(' , ')}</span></ul>
                </div>
              ))}
            </div>
          </div>
          <div className="full-width-content">
            <span><strong>Request Remarks:</strong> {accessRequestData?.requestRemarks || "None"}</span>
            <span hidden={accessRequestData?.approvalStatus === 'PENDING'}><strong>Date Approved:</strong> {new Date(accessRequestData?.dateApproved).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}</span>
            <span hidden={accessRequestData?.approvalStatus === 'PENDING'}><strong>Approver Remarks:</strong> {accessRequestData?.approveRemarks || "None"}</span>
            <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Date Completed:</strong> {new Date(accessRequestData?.dateApproved).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}</span>
            <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Final Remarks:</strong> {accessRequestData?.reviewRemarks || "None"}</span>
          </div>
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
                {isCTFlow && !isManagerFlow && <button className='approveButton' onClick={() => handleCompleteRemarks('APPROVED')} >Approve</button>}
                {isCTFlow && !isManagerFlow && <button className='completeButton' onClick={() => handleCompleteRemarks('REJECTED')} >Reject</button>}
                {isManagerFlow && !isCTFlow && <button className='completeButton' onClick={handleSubmitRemarks} >Submit</button>}
                <button className='rejectButton' onClick={() => (setShowRemarksInput(false), setIsCTFLow(false), setIsManagerFlow(false))}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };


  return (
    <div>
      <div className='pageHeader'>
        <div>Access Request Listing</div>
        <div><button className='newButton' onClick={handleButtonClick}>Raise New Request</button></div>
        <div className='filterButtons'>
          <button className='newButton' onClick={() => navigate('/')}>All</button>
          <button className='newButton' onClick={() => navigate('/allPending')}>Pending</button>
          <button className='newButton' onClick={() => navigate('/allRejected')}>Rejected</button>
          <button className='newButton' onClick={() => navigate('/allApproved')}>Approved</button>
          <button className='newButton' onClick={() => navigate('/allCompleted')}>Completed</button>
        </div>
      </div>
      {listData.map(item => (
        <AccessRequestCard key={item.id} accessRequestData={item} />
      ))}
    </div>
  );
}
export default AccessRequestListing;