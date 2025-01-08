'use client';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AnimateButton from "ui-component/extended/AnimateButton";
import { Formik, Form } from "formik";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
 
const validationSchema = yup.object({
  accountName: yup.string().required("Account Name is required"),
  bankName: yup.string().required("Bank Name is required"),
  accountNumber: yup.string().required("Account Number is required"),
  ifscCode: yup.string().required("IFSC Code is required"),
  branchName: yup.string().required("Branch Name is required"),
  typeOfAccount: yup.string().required("Type of Account is required"),
  GSTNumber: yup.string().required("GST Number is required")
});
 
export type BankData = {
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  typeOfAccount?: string;
  GSTNumber?: string;
};
 
interface BankDetailsProps {
  handleNext: (props: any) => void;
  handleBack: () => void;
  setErrorIndex: (i: number | null) => void;
  bankData: BankData;
}
 
export default function BankForm({
  handleNext,
  handleBack,
  setErrorIndex,
  bankData,
}: BankDetailsProps) {

  const [localBankData, setLocalBankData] = useState<BankData>(bankData);

  useEffect(() => {
    setLocalBankData(bankData);
  }, [bankData]);
  const handleSubmit = (values: BankData) => {
    try {
      handleNext({
        bankData: {
          bankData: values
        }
      });
      setErrorIndex(null);
    } catch (error) {
      setErrorIndex(3);
    }
  };
 
  return (
    <Formik
      initialValues={localBankData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ errors, touched, values, handleChange, handleBlur }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="accountName"
                name="accountName"
                value={values.accountName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.accountName && Boolean(errors.accountName)}
                helperText={touched.accountName && errors.accountName}
                label="Account Name"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="bankName"
                name="bankName"
                value={values.bankName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.bankName && Boolean(errors.bankName)}
                helperText={touched.bankName && errors.bankName}
                label="Bank Name"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="accountNumber"
                name="accountNumber"
                value={values.accountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.accountNumber && Boolean(errors.accountNumber)}
                helperText={touched.accountNumber && errors.accountNumber}
                label="Account Number"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="ifscCode"
                name="ifscCode"
                value={values.ifscCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ifscCode && Boolean(errors.ifscCode)}
                helperText={touched.ifscCode && errors.ifscCode}
                label="IFSC Code"
                fullWidth
                autoComplete="cc-number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="branchName"
                name="branchName"
                value={values.branchName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.branchName && Boolean(errors.branchName)}
                helperText={touched.branchName && errors.branchName}
                label="Branch Name"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="typeOfAccount"
                name="typeOfAccount"
                value={values.typeOfAccount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.typeOfAccount && Boolean(errors.typeOfAccount)}
                helperText={touched.typeOfAccount && errors.typeOfAccount}
                label="Type of Account"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="GSTNumber"
                name="GSTNumber"
                value={values.GSTNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.GSTNumber && Boolean(errors.GSTNumber)}
                helperText={touched.GSTNumber && errors.GSTNumber}
                label="GST Number"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
 
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                  Back
                </Button>
                <AnimateButton>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ my: 3, ml: 1 }}
                    onClick={() => setErrorIndex(3)}
                  >
                    Create Organisation
                  </Button>
                </AnimateButton>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}