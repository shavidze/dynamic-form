
import './App.css';
import * as yup from "yup";
import { useField, Formik, Form } from "formik";
import React, { useEffect } from "react";
import { config } from "./config";


export function createYupSchema(schema, config) {
  const { id, validationType, validations = [] } = config;
  if (!yup[validationType]) {
    return schema;
  }
  let validator = yup[validationType]();

  validations.forEach((validation) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });
  schema[id] = validator;
  return schema;
}

const DynamicField = ({ keyValue, label, className="", ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="field" key={keyValue}>
      <div className="control">
        <label htmlFor={props.id || props.name}>{label}</label>
        <input className={className} {...field} {...props} />
        {meta.touched && meta.error? (
          <div className="error"> {meta.error}</div>
        ) : ''}
      </div>
    </div>
  );
}

function App() {
  const renderFormElemets = () => config.map((item, index) => {

      if (item.type) {
        return (
            <>
              <DynamicField
                keyValue={item.id}
                label={item.label}
                className="tx"
                type={item.type}
                name={item.id}
                placeholder={item.placeholder}
              />
            </>
          )
      }
      return "";
    }
  )
  
  const handleInitValues = () => {
    config.forEach(item => {
      initValues[item.id] = item.value || "";
    })
  }

  const initValues = {};
  useEffect(() => {
    handleInitValues(0);
  }, [])
  const yupSchema = config.reduce(createYupSchema, {});
  const validateSchema = yup.object().shape(yupSchema);
  const onSubmit = (values) => {
    console.log(values);
  }
  return (
    <div className="App">
      <h1>Form goes here</h1>
      <Formik initialValues={initValues} validationSchema={validateSchema} onSubmit={onSubmit}>
        {(props) => (
          <Form className="form">
           <> { renderFormElemets() } </>
              <button type="submit">Submit</button>

          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
