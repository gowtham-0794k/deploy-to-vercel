"use client";
import { MMTreeView } from "components/meraMaster";
import React from "react";
import { gridSpacing } from "store/constant";
import {
  Grid,
  InputLabel,
  MainCard,
  TextField,
  Button,
  FormHelperText,
} from "utils/genericExports/theme-imports";
import { Formik } from "formik";
import * as Yup from "yup";
import { postAxios } from "shared";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { BASE_URL } from "shared/constants/routerUrls";

function ColumnsLayouts() {
  const dispatch = useDispatch();
  const initialValues = {
    referenceName: "",
    displayName: "",
  };

  const handleSubmit = async (values: any) => {
    const formData = {
      referenceName: values.referenceName,
      displayName: values.displayName,
    };
    try {
      const response = await postAxios({
        url: `${BASE_URL}/papers`,
        values: formData,
      });
      if (response.status === 200) {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Paper created successfully.",
            "success"
          )
        );
        // clear all the states
        initialValues.referenceName = "";
        initialValues.displayName = "";
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Paper Already created.",
            "error"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Paper creation Failed.",
            "error"
          )
        );
      }
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <MainCard
          title="Create Papers"
          sx={{ height: "100%", position: "relative" }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              referenceName: Yup.string().required(
                "Reference Name is required!"
              ),
              displayName: Yup.string().required("Display Name is required!"),
            })}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleSubmit,
              handleBlur,
              handleChange,
              touched,
              errors,
            }) => (
              <form onSubmit={handleSubmit}>
                <InputLabel>Paper Reference Name</InputLabel>
                <TextField
                  placeholder="CA-FO-PAPER 1"
                  fullWidth
                  name="referenceName"
                  value={values.referenceName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.referenceName && Boolean(errors.referenceName)}
                  sx={{ mb: 2 }}
                />
                {touched.referenceName && Boolean(errors.referenceName) && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text--register"
                  >
                    Reference Name is required!
                  </FormHelperText>
                )}
                <InputLabel>Paper Name</InputLabel>
                <TextField
                  placeholder="Paper Name"
                  fullWidth
                  name="displayName"
                  value={values.displayName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.displayName && Boolean(errors.displayName)}
                  sx={{ mb: 2 }}
                />
                {touched.displayName && Boolean(errors.displayName) && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text--register"
                  >
                    Display Name is required!
                  </FormHelperText>
                )}
                <Button variant="contained" color="primary" type="submit">
                  Create Paper
                </Button>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard title="Select the courses for the level">
          <MMTreeView />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default ColumnsLayouts;
