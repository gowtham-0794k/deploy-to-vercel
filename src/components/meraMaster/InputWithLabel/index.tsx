import React from "react";
import { InputLabel, TextField } from "utils/genericExports/theme-imports";

type InputWithLabelProps = {
  id: string;
  label?: string;
  values: any;
  handleBlur: any;
  handleChange: any;
  placeholder?: string;
  touched?: any;
  errors?: any;
  required?: boolean;
};

export const InputWithLabel = ({
  id,
  label,
  values,
  handleBlur,
  handleChange,
  placeholder,
  touched,
  errors,
  required = true,
}: InputWithLabelProps) => {
  return (
    <>
      <InputLabel>
        {label}
        {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
      </InputLabel>
      <TextField
        fullWidth
        placeholder={placeholder}
        name={id}
        value={values[id]}
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched?.[id] && Boolean(errors?.[id])}
        helperText={errors?.[id]}
      />
    </>
  );
};
