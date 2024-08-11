import React, { useEffect, useState } from 'react'
import ApiService from './Api';
import './App.css'
 




const AccessRequestCard = ({ accessRequestData }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          {accessRequestData?.employeeName || "Employee Name"} | {accessRequestData?.subDepartment} | {accessRequestData?.employeeCompany}
          <span className='approvalButtons'>
          <button className="managerReject" oonClick={() => reject(accessRequestData.id, 'Your review remarks here')} hidden={accessRequestData.approvalStatus !== 'PENDING'}>Reject</button>
          <button className="managerApproval" onClick={approve} hidden={accessRequestData?.approvalStatus !== 'PENDING'}>Approve</button>
          <button className="towerApproval" onClick={towerApproval} hidden={accessRequestData?.controlTowerStatus !== 'PENDING'}>Mark As Completed</button>
          </span>
        </h2>
        <p>{accessRequestData?.emailId}</p>
      </div>
      <div className="card-content">
        <div className="info-group">
          
          <p>
            <span><strong>Details - Email:</strong> {accessRequestData?.emailId}</span>
            <span><strong>Approving Manager:</strong> {accessRequestData?.approvingManagerName || "N/A"}</span>
            <span hidden={accessRequestData.approvalStatus === 'PENDING'}><strong>Approval Status:</strong> {accessRequestData?.approvalStatus}</span>
            <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Completed:</strong> {accessRequestData?.controlTowerStatus}</span>
            <span><strong>Date Created:</strong> {new Date(accessRequestData?.dateCreated).toLocaleDateString()}</span>
            <span><strong>Company Application:</strong> {accessRequestData?.companyName}</span>
          </p>
          <div className="info-group full-width">
            <p><strong>Modules:</strong></p>
            <div className="modules-list">
              {Object.entries(accessRequestData?.modules || {}).map(([system, modules], index) => (
                <div key={index} className="module-group">
                  <ul><p>{system} : {modules.join(' , ')}</p></ul>
                </div>
              ))}
            </div>
            <p>
              <span><strong>Request Remarks:</strong> {accessRequestData?.requestRemarks || "None"}</span>
              <span hidden={accessRequestData?.approvalStatus === 'PENDING'}><strong>Date Approved:</strong> {new Date(accessRequestData?.dateApproved).toLocaleDateString()}</span>
              <span hidden={accessRequestData?.approvalStatus === 'PENDING'}><strong>Approve Remarks:</strong> {accessRequestData?.approveRemarks || "None"}</span>
              <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Date Completed:</strong> {new Date(accessRequestData?.dateCompleted).toLocaleDateString()}</span>
              <span hidden={accessRequestData?.controlTowerStatus === 'PENDING'}><strong>Final Remarks:</strong> {accessRequestData?.reviewRemarks || "None"}</span>
            </p>
          </div>

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

  // useEffect(() => {
  //   ApiService.reject().then(({ accessRequestData }) => {
  //     setCompanyNames(companyNames);
  //     setCompanyDisplayNames(companyDisplayNames);
  //   });
  // }, []);

  return (
    <div>
      {listData.map(item => (
        <AccessRequestCard accessRequestData={item} />
      ))}
    </div>
  );
}
export default App;