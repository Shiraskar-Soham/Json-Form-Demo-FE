import './App.css';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { useEffect, useState } from 'react';
import ApiService from './Api';
import { Widgets } from '@rjsf/mui';

function App() {

  const [companyNames, setCompanyNames] = useState([]);
  const [companyDisplayNames, setCompanyDisplayNames] = useState([]);
  const [displayNames, setdisplayNames] = useState([]);
  const [data, setData] = useState();
  const [managerDisplayNames, setmanagerDisplayNames] = useState({});
  const [showOtherInput, setShowOtherInput] = useState(true);

  useEffect(() => {
    ApiService.getCompany().then(({ companyNames, companyDisplayNames }) => {
      setCompanyNames(companyNames);
      setCompanyDisplayNames(companyDisplayNames);
    });
  }, []);

  useEffect(() => {
    ApiService.getManager().then(({ managerDisplayNames }) => {
      setmanagerDisplayNames(managerDisplayNames)
    });
  }, []);

  useEffect(() => {
    const updateModuleValues = async () => {
      const company = data?.company;
      if (company) {
        const systems = Object.keys(schema.properties.modules.properties);
        for (const system of systems) {
          const { displayNames } = await ApiService.getModules(company, system);
          setdisplayNames(prev => ({
            ...prev,
            [system]: displayNames
          }));
        }
      }
    };
    updateModuleValues();
    console.log(displayNames);
  }, [data?.company]);

  // useEffect(() => {
  //   const fetchModuleValues = async (company_name, system_name) => {
  //     try {
  //       const response = await fetch(`/api/moduleValues?company_name=${company_name}&system_name=${system_name}`);
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setModuleValues(prev => ({
  //         ...prev,
  //         [system_name]: data
  //       }));
  //     } catch (error) {
  //       console.error('Error fetching module values', error);
  //     }
  //   };

  //   const company_name = data.company;
  //   if (company_name) {
  //     Object.keys(schema.properties).forEach(field => {
  //       if (schema.properties[field].title && field !== 'company') {
  //         fetchModuleValues(company_name, field);
  //       }
  //     });
  //   }
  // }, [data?.company_name]);

  const schema = {
    "title": "Request For Access",
    "type": "object",
    "properties": {
      "approvingManager": {
        "title": "Select Your Manager/HOD",
        "type": "string",
        "enum": managerDisplayNames
      },
      "company": {
        "title": "Company Application (in which access is needed)",
        "type": "string",
        "enumNames": companyDisplayNames,
        "enum": companyNames
      },
      "modules": {
        "title": "Modules",
        "type": "object",
        "properties": {
          "OASYS": {
            "title": "Oasys Modules",
            "type": "string",
            "enum": displayNames['OASYS'] || []
          },
          "OFB_SALES_SYSTEM": {
            "title": "OFB Sales System",
            "type": "string",
            "enum": displayNames['OFB_SALES_SYSTEM'] || []
          },
          "ORION": {
            "title": "Orion",
            "type": "string",
            "enum": displayNames['ORION'] || []
          },
          "OXYZO": {
            "title": "Oxyzo",
            "type": "string",
            "enum": displayNames['OXYZO'] || []
          },
          "OXYZO_SALES_SYSTEM": {
            "title": "Oxyzo Sales System",
            "type": "string",
            "enum": displayNames['OXYZO_SALES_SYSTEM'] || []
          },
          "OCEAN": {
            "title": "Ocean",
            "type": "string",
            "enum": displayNames['OCEAN'] || []
          },
          "PRISM": {
            "title": "Prism",
            "type": "string",
            "enum": displayNames['PRISM'] || []
          },
          "OMAT": {
            "title": "OMAT",
            "type": "string",
            "enum": displayNames['OMAT'] || []
          },
          "OMAT_FINANCE": {
            "title": "Omat Finance",
            "type": "string",
            "enum": displayNames['OMAT_FINANCE'] || []
          },
          "CERES": {
            "title": "CERES",
            "type": "string",
            "enum": displayNames['CERES'] || []
          },
          "OAGRIFARMLOAN": {
            "title": "OAgriFarm Loan",
            "type": "string",
            "enum": displayNames['OAGRIFARMLOAN'] || []
          }
        },
      },
      "remarks": {
        "title": "Remarks",
        "type": "string"
      }
    },
    "required": ["approvingManager", "company", "modules", "remarks"]
  }

  const uiSchema = {

    "approvingManager": {
      "ui:autofocus": true,
      "ui:enableMarkdownInDescription": true,
      "ui:description": "*Select the manager who would approve your request.*"
    },
    "company": {
      "ui:autofocus": true,
      "ui:enableMarkdownInDescription": true,
      "ui:description": "*Select the company you want access to*"
    },
    "remarks": {
      "ui:autofocus": true,
      "ui:enableMarkdownInDescription": true,
      "ui:description": "Please enter *appropriate* remarks."
    },
    "modules": {
      "OASYS": {
        "ui:widget": showOtherInput ? "select" : "hidden"
      },
      "ofbsales": {
        "ui:widget": showOtherInput ? "select" : "hidden"
      },
      "orion": {
        "ui:widget": showOtherInput ? "select" : "hidden"
      },
      "oxyzo": {
        "ui:widget": "select"
      },

      "oxyzosales": {
        "ui:widget": "select"
      },
      "ocean": {
        "ui:widget": "select"
      },
      "prism": {
        "ui:widget": "select"
      },
      "ceres": {
        "ui:widget": "select"
      },
      "omat": {
        "ui:widget": "select"
      },
      "omatfinance": {
        "ui:widget": "select"
      },
      "oagrifarmloan": {
        "ui:widget": "select"
      }
    }
  }


  const onSubmit = ({ formData }) => {
    ApiService.submitForm(formData)
      .then((responseData) => {
        const entryID = responseData;
        alert(`Form Submitted Successfully! Your request Id is  "${entryID}".`);

        setData({});
      })
      .catch((error) => {
        console.error('Form submission failed:', error);
        alert('Form submission failed!');
      });
  };

  const log = (type) => console.log.bind(console, type);

  return (
    <div className='Parent' >
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={data}
        validator={validator}
        onChange={({ formData, errors }) => setData(formData)}
        onSubmit={onSubmit}
        onError={log('errors')}
      />
    </div >
  );
}

export default App;
