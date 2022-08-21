import React from 'react';
import "../../RegisterBlock.css";

function FormLargeField({fieldId, label}) {
  return (
    <div className="register-field-large-container">
      <textarea className="register-text-area text-main" type="text" name={fieldId} id={"register_"+fieldId} placeholder={label} />
    </div>
  );
}

export default FormLargeField;