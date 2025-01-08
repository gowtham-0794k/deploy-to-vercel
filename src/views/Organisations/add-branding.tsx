"use client";
import { Formik, FormikHelpers } from "formik";
import { gridSpacing } from "store/constant";
import { InputWithLabel, Upload } from "components/meraMaster";
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
} from "utils/genericExports/theme-imports";
import { MainCard } from "utils/genericExports/uiComponentsimports";
import * as Yup from "yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { getAxios } from "shared/services/generic";
import { BASE_URL, GET_ORGS } from "shared/constants/routerUrls";

interface Organization {
  _id: string;
  organizationName: string;
}

const initialValues = {
  organizationId: "",
  organizationName: "",
  logoImage: null,
  brandNameImage: null,
  loginImage: null,
  registerImage: null,
  forgotPasswordImage: null,
  resetPasswordImage: null,
  codeVerificationImage: null,
  slogan1: "",
  subSlogan1: "",
  slogan2: "",
  subSlogan2: "",
  slogan3: "",
  subSlogan3: "",
};

const Dropzone = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]),
    dispatch = useDispatch(),
    getOrganizations = async () => {
      const organizationResponse = await getAxios({ url: GET_ORGS });
      setOrganizations(organizationResponse?.data?.entities);
    },
    handleSubmit = async (values: any, { setValues, setTouched }: FormikHelpers<typeof initialValues>) => {
      const formData = new FormData();
      formData.append("logo", values.logoImage[0]);
      formData.append("brandnameImage", values.brandNameImage[0]);
      formData.append("loginImage", values.loginImage[0]);
      formData.append("registerImage", values.registerImage[0]);
      formData.append("forgotPasswordImage", values.forgotPasswordImage[0]);
      formData.append("resetPasswordImage", values.resetPasswordImage[0]);
      formData.append("codeVerificationImage", values.codeVerificationImage[0]);
      formData.append("subSlogan1", values.subSlogan1);
      formData.append("subSlogan2", values.subSlogan2);
      formData.append("subSlogan3", values.subSlogan3);
      formData.append("slogan1", values.slogan1);
      formData.append("slogan2", values.slogan2);
      formData.append("slogan3", values.slogan3);
      try {
        const brandingResponse = await axios({
          method: "post",
          url: `${BASE_URL}/org/${values.organizationId}/branding`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (brandingResponse.status === 200) {
          dispatch(
            openSnackbarFunction(
              brandingResponse.data.message ||
                "Branding data sent successfully.",
              "success"
            )
          );
          setValues(initialValues);
          setTouched({});
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          dispatch(
            openSnackbarFunction(
              error.response.data.message ||
                (error.response.data &&
                  Object.values(error.response.data)[0]) ||
                "Branding data already exists.",
              "error"
            )
          );
        } else {
          dispatch(
            openSnackbarFunction(
              error.response.data.message || "Adding Branding data failed.",
              "error"
            )
          );
        }
      }
    };
  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        organizationName: Yup.string().required(
          "Organization name is required !"
        ),
        logoImage: Yup.array().required("Logo Image is required !"),
        brandNameImage: Yup.array().required("Brand  is required !"),
        loginImage: Yup.array().required("Login Image is required !"),
        registerImage: Yup.array().required("Register Image is required !"),
        forgotPasswordImage: Yup.array().required(
          "Forgot Password Image is required !"
        ),
        resetPasswordImage: Yup.array().required(
          "Reset Password Image is required !"
        ),
        codeVerificationImage: Yup.array().required(
          "Code verification Image is required !"
        ),
        slogan1: Yup.string().required("slogan1 is required !"),
        subSlogan1: Yup.string().required("subSlogan1 is required !"),
        slogan2: Yup.string().required("slogan2 is required !"),
        subSlogan2: Yup.string().required("subSlogan2 is required !"),
        slogan3: Yup.string().required("slogan3 is required !"),
        subSlogan3: Yup.string().required("subSlogan3 is required !"),
      })}
    >
      {({
        values,
        handleSubmit,
        setFieldValue,
        touched,
        errors,
        handleBlur,
        handleChange,
      }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} lg={4}>
                <InputLabel>
                  Select Organisation{" "}
                  <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                </InputLabel>
                <TextField
                  select
                  fullWidth
                  label="Select Organisation"
                  placeholder="Select Organisation"
                  margin="normal"
                  name="organizationName"
                  value={values.organizationName}
                  onBlur={handleBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedOrg = organizations.find(
                      (org) => org.organizationName === event.target.value
                    );
                    if (selectedOrg) {
                      setFieldValue(
                        "organizationName",
                        selectedOrg.organizationName
                      );
                      setFieldValue("organizationId", selectedOrg._id);
                    }
                  }}
                  error={
                    touched.organizationName && Boolean(errors.organizationName)
                  }
                >
                  {organizations.length > 0 ? (
                    organizations.map((org) => (
                      <MenuItem key={org._id} value={org.organizationName}>
                        {org.organizationName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No organizations available</MenuItem>
                  )}
                </TextField>
                {touched.organizationName &&
                  Boolean(errors.organizationName) && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text--register"
                    >
                      Organization name is required !
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Logo"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="logoImage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Brand Name"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="brandNameImage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Login Image"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="loginImage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Register Image"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="registerImage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Forgot Password Image"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="forgotPasswordImage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Reset Password Image"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="resetPasswordImage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Upload
                  title="Code Verification Image"
                  setValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  id="codeVerificationImage"
                />
              </Grid>

              <Grid item xs={12}>
                <MainCard title="Slogans">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} lg={4}>
                      <div>
                        <InputWithLabel
                          label="Slogan 1"
                          id="slogan1"
                          placeholder="Enter Slogan 1"
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <InputWithLabel
                          label="Sub Slogan 1"
                          id="subSlogan1"
                          placeholder="Enter Sub Slogan 1"
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <div>
                        <InputWithLabel
                          label="Slogan 2"
                          id="slogan2"
                          placeholder="Enter Slogan 2"
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <InputWithLabel
                          label="Sub Slogan 2"
                          id="subSlogan2"
                          placeholder="Enter Sub Slogan 2"
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <div>
                        <InputWithLabel
                          label="Slogan 3"
                          id="slogan3"
                          placeholder="Enter Slogan 3"
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <InputWithLabel
                          label="Sub Slogan 3"
                          id="subSlogan3"
                          placeholder="Enter Sub Slogan 3"
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button type="submit" variant="contained" color="secondary">
                    Submit
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Dropzone;
