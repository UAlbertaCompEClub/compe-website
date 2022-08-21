import React from 'react';
import "../../RegisterBlock.css";

function FormField({fieldId, label}) {
  return (
    <div className="register-field-container">
      <input className="register-field-text" type="text" name={fieldId} id={"register_"+fieldId} placeholder={label} />
    </div>
  );
}

export default FormField;