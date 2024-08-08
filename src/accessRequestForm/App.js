import './App.css';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { useEffect, useState } from 'react';
import ApiService from './Api';

function App() {
  const [companyNames, setCompanyNames] = useState([]);
  const [companyDisplayNames, setCompanyDisplayNames] = useState([]);
  const [data, setData] = useState({});
  const [managerDisplayNames, setManagerDisplayNames] = useState({});
  const [modulesSchema, setModulesSchema] = useState({});
  const [backendError, setBackendError] = useState({})

  const baseSchema = {
    "title": "Request For Access",
    "type": "object",
    "properties": {
      "approvingManager": {
        "title": "Select Your Manager/HOD",
        "type": "string",
        "enum": []
      },
      "company": {
        "title": "Company Application (in which access is needed)",
        "type": "string",
        "enumNames": [],
        "enum": []
      },
      "modules": {
        "title": "Modules",
        "type": "object",
        "properties": {}
      },
      "remarks": {
        "title": "Remarks",
        "type": "string"
      }
    },
    "required": ["approvingManager", "company", "modules", "remarks"]
  };

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
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OFB_SALES_SYSTEM": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "ORION": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "PRISM": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "CERES": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OXYZO": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OMAT": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OXYZO_SALES_SYSTEM": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OAGRIFARMLOAN": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OCEAN": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      },
      "OMAT_FINANCE": {
        "ui:description": "Select the modules you want access to.",
        "ui:enableMarkdownInDescription": true,
        "ui:widget": "select"
      }
    }
  };

  useEffect(() => {
    ApiService.getCompany().then(({ companyNames, companyDisplayNames }) => {
      setCompanyNames(companyNames);
      setCompanyDisplayNames(companyDisplayNames);
    });

    ApiService.getManager().then(({ managerDisplayNames }) => {
      setManagerDisplayNames(managerDisplayNames);
    });
  }, []);

  useEffect(() => {
    const updateModulesSchema = async () => {
      const company = data?.company;
      if (company) {
        const systems = await ApiService.getSystems(company);
        const newModulesSchema = {};

        for (const system of systems) {
          const { enumName, displayName } = system;
          const { displayNames } = await ApiService.getModules(company, enumName);

          newModulesSchema[enumName] = {
            "title": `${displayName} Modules`,
            "type": "array",
            "items": {
              "enum": displayNames,
              "type": "string"
            },
            "uniqueItems": true,
            "required": ["$enumName"]
          };
        }
        setModulesSchema(newModulesSchema);
      } else {
        setModulesSchema({})
      }
    };


    updateModulesSchema();
  }, [data?.company]);

  const schema = {
    ...baseSchema,
    properties: {
      ...baseSchema.properties,
      approvingManager: {
        ...baseSchema.properties.approvingManager,
        enum: Object.values(managerDisplayNames)
      },
      company: {
        ...baseSchema.properties.company,
        enumNames: companyDisplayNames,
        enum: companyNames
      },
      modules: {
        ...baseSchema.properties.modules,
        properties: modulesSchema
      }
    }
  };

  const onSubmit = ({ formData, errors }) => {
    ApiService.submitForm(formData)
      .then((responseData) => {
        const entryID = responseData;
        alert(`Form Submitted Successfully! Your request Id is "${entryID}".`);
        setData({});
        setBackendError('');
      })
      .catch((error) => {
        console.error('Form submission failed:', error);
        setBackendError(error.message || 'Form submission failed!');
      });
  };
  const onChange = ({ formData }) => {
    if (formData?.company !== data?.company) {
      formData.modules = {};
    }
    setData(formData);
  };


  // const validate = (formData, errors) => {
  //   if (formData.company && Object.keys(modulesSchema).length > 0) {
  //     let atLeastOneModuleSelected = false;

  //     for (const module in formData.modules) {
  //       if (formData.modules[module].length > 0) {
  //         atLeastOneModuleSelected = true;
  //         break;
  //       }
  //     }

  //     if (!atLeastOneModuleSelected) {
  //       errors.modules.addError('At least one module must be selected.');
  //     }
  //   }
  //   return errors;
  // };

  const log = (type) => console.log.bind(console, type);

  return (
    <div className='Parent'>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={data}
        validator={validator}
        onChange={onChange}
        onSubmit={onSubmit}
        showErrorList='top'
        onError={log('errors')}
      // validate={validate}
      />
    </div>
  );
}

export default App;
