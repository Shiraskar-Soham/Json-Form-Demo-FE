import "./App.css";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AccessRequestForm({ formId }) {
  const [formMetadata, setFormMetadata] = useState(null);
  const [baseSchema, setBaseSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  // Meta data from backend
  useEffect(() => {
    fetch(`http://localhost:8081/api/forms/2/metadata`)
      .then((response) => response.json())
      .then((data) => setFormMetadata(data))
      .catch((error) => console.error('Error fetching form metadata:', error));
  }, [formId]);

  // Step 2: schema
  useEffect(() => {
    if (formMetadata) {
      const properties = {};
      const requiredFields = [];

      formMetadata.fields.forEach((field) => {
        properties[field.field_id] = {
          title: field.label,
          type: field.fieldType === 'textarea' || 'text' ? 'string' : field.fieldType,
        };

        if (field.fieldType === "select" || field.fieldType === "multiselect") {
          const options = JSON.parse(field.options);
          properties[field.field_id].enum = options.map((option) => option.value);
          properties[field.field_id].enumNames = options.map((option) => option.label);
          if (field.fieldType === "select") {
            properties[field.field_id].type = "array";
            properties[field.field_id].items = {
              type: "string",
              enum: options.map((option) => option.value),
              enumNames: options.map((option) => option.label),
            };
            properties[field.field_id].uniqueItems = true;
          }
        }
        if (field.required === "true") {
          requiredFields.push(field.field_id);
        }
      });
      const schema = {
        title: formMetadata.form_name,
        type: "object",
        properties,
        required: requiredFields,
      };
      setBaseSchema(schema);
    }
  }, [formMetadata]);

  // uischema
  useEffect(() => {
    if (formMetadata) {
      const uiSchema = {};

      formMetadata.fields.forEach((field) => {
        uiSchema[field.field_id] = {
          "ui:autofocus": true,
          "ui:enableMarkdownInDescription": true,
          "ui:description": `*${field.label} description here.*`, // Customize as needed
        };

        if (field.fieldType === "select" || field.fieldType === "dropdown"|| field.fieldType==="multiselect") {
          uiSchema[field.field_id]["ui:widget"] = "select";
        }
      });

      setUiSchema(uiSchema);
    }
  }, [formMetadata]);

  // submitting form
  const onSubmit = ({ formData }) => {
    fetch("http://localhost:8081/api/forms/3/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(2, formData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        const entryID = responseData;
        alert(`Form Submitted Successfully! Your request Id is "${entryID}".`);
        setData({});
        navigate("/allPending");
      })
      .catch((error) => {
        console.error("Form submission failed:", error);
      });
  };


  const onChange = ({ formData }) => {
    setData(formData);
  };


  const log = (type) => console.log.bind(console, type);


  return (
    <div className="Parent">
      {baseSchema && uiSchema && (
        <Form
          schema={baseSchema}
          uiSchema={uiSchema}
          formData={data}
          validator={validator}
          onChange={onChange}
          onSubmit={onSubmit}
          showErrorList="top"
          onError={log("errors")}
        />
      )}
    </div>
  );
}

export default AccessRequestForm;
