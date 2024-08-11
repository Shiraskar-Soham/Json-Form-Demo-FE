import React, { useEffect, useState } from 'react'
import ApiService from './Api';
import './App.css'





const AccessRequestCard = ({ accessRequestData }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className='card-heading'>
          {accessRequestData?.employeeName || "Employee Name"} | {accessRequestData?.subDepartment} | {accessRequestData?.employeeCompany}
        </span>
        <span className='approvalButtons'>
          <button className="rejectButton" onClick={() => reject(accessRequestData.id, 'Your review remarks here')} hidden={accessRequestData.approvalStatus !== 'PENDING'}>Reject</button>
          <button className="approveButton" onClick={approve} hidden={accessRequestData?.approvalStatus !== 'PENDING'}>Approve</button>
          <button className="completeButton" onClick={towerApproval} hidden={accessRequestData?.controlTowerStatus !== 'PENDING'}>Mark As Completed</button>
        </span>
      </div>
      <div className="card-content">
        <div className='details-section'>
          <span><strong>Email:</strong> {accessRequestData?.emailId}</span>
          <span><strong>Approving Manager:</strong> {accessRequestData?.approvingManagerName || "N/A"}</span>
          <span hidden={accessRequestData.approvalStatus === 'PENDING'}><strong>Approval Status:</strong> {accessRequestData?.approvalStatus}</span>
          <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Completed:</strong> {accessRequestData?.controlTowerStatus}</span>
          <span><strong>Date Created:</strong> {new Date(accessRequestData?.dateCreated).toLocaleDateString()}</span>
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
          <span hidden={accessRequestData?.approvalStatus === 'PENDING'}><strong>Date Approved:</strong> {new Date(accessRequestData?.dateApproved).toLocaleDateString()}</span>
          <span hidden={accessRequestData?.approvalStatus === 'PENDING'}><strong>Approve Remarks:</strong> {accessRequestData?.approveRemarks || "None"}</span>
          <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Date Completed:</strong> {new Date(accessRequestData?.dateCompleted).toLocaleDateString()}</span>
          <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Final Remarks:</strong> {accessRequestData?.reviewRemarks || "None"}</span>
        </div>
      </div>
    </div>
  );
};

function reject(id, reviewRemarks) {

}

const approve = () => {

}

const towerApproval = () => {

}

function App() {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    ApiService.getListing()
      .then((responseData) => {
        setListData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching access request list:', error);
      });
  }, []);

  return (
    <div>
      {listData.map(item => (
        <AccessRequestCard accessRequestData={item} />
      ))}
    </div>
  );
}
export default App;