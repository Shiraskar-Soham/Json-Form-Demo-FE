import React from 'react'

const Card = ({ title, id, buttons, data }) => {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">{title}</span>
          <span className="card-id">{id}</span>
          <div className="card-buttons">
            {buttons.map((button, index) => (
              <button key={index} className="card-button">
                {button}
              </button>
            ))}
          </div>
        </div>
        <div className="card-content">
          <table>
            <thead>
              <tr>
                {data[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  function App() {
    const cardData = [
      ['PO Number', 'PO Value', 'Ledger Balance', 'Order Amount', 'Supplier Quote', 'Product Margin'],
      ['OFB/PO/B/24-25/AUG/MH/1', '1,17,99,999.882₹', '-60,00,000', '₹1,48,31,551', '1,18,00,000', '₹11,14,111 (8.86%)'],
      // Add more rows as needed
    ];
  
    return (
      <div>
        <Card
          title="QFNSKWF"
          id="OFB11722425997296"
          buttons={['Audits', 'Preview PO', 'Reject', 'Approve']}
          data={cardData}
        />
      </div>
    );
  }
  export default App;