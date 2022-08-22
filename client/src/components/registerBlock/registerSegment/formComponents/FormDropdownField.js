import React from 'react';
import "../../RegisterBlock.css";

function FormDropdownField({fieldId, label, options}) {
  var renderOptions = options => {
    var base = [];
    options.forEach(option => base.push(<option value={option}>{option}</option>));
    return base;
  };

  return (
    <div className="register-field-container">
      <select className="register-field-text register-field-dropdown" name={fieldId} id={"register_"+fieldId} placeholder={label}>
        {renderOptions(options)}
      </select>
    </div>
  );
}

export default FormDropdownField;