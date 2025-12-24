import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const BaseAuthForm = ({ 
  initialValues, 
  validationSchema, 
  onSubmit, 
  children, 
  title, 
  error 
}) => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
    {({ isSubmitting }) => (
      <Form className="space-y-5">
        {title && <h2 className="text-4xl font-bold text-center mb-2 tracking-wide">{title}</h2>}
        {error && <div className="text-red-500 mb-4 text-center text-sm">{error}</div>}
        {children({ isSubmitting })}
      </Form>
    )}
  </Formik>
);

export default BaseAuthForm;