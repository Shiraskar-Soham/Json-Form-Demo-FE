import React from "react";

const BodySection = ({ body }) => {
  return (
    <div className="card-body">
      {Object.keys(body).map((key) => (
        <div key={key}>
          <span className="module-chips">
            <strong>
              {key}
              {": "}
            </strong>
            {typeof body[key] === "object" && body[key] !== null ? (
              <ul>
                {Object.keys(body[key]).map((subKey) => (
                  <li key={subKey}>
                    {subKey}: {body[key][subKey].join(", ")}
                  </li>
                ))}
              </ul>
            ) : (
              body[key]
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BodySection;
