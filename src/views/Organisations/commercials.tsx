"use client";
import axios from "axios";
import { InputWithLabel } from "components/meraMaster";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  MainCard,
  Autocomplete,
  Chip,
  TextField,
  Stack,
  Button,
  MenuItem,
  FormHelperText,
} from "utils/genericExports/theme-imports";
import { BASE_URL, GET_ORGS } from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { getAxios } from "shared";

interface FormattedCourse {
  id: string;
  label: string;
}
const dummyCourses = [
  { _id: "1", course_name: "Introduction to Programming" },
  { _id: "2", course_name: "Web Development Basics" },
  { _id: "3", course_name: "Data Structures and Algorithms" },
  { _id: "4", course_name: "Machine Learning Fundamentals" },
  { _id: "5", course_name: "Mobile App Development" },
];
function Commercials() {
  const getPercentage = (
      value: any,
      currentId: string,
      setId: string,
      setValue: any
    ) => {
      const percentage = 100 - value;
      setValue(setId, percentage);
      setValue(currentId, value);
    },
    [organizations, setOrganizations] = useState<any[]>([]),
    [courses, setCourses] = useState<FormattedCourse[]>([]),
    dispatch = useDispatch(),
    getOrganizations = async () => {
      const organizationResponse = await getAxios({ url: GET_ORGS });
      setOrganizations(organizationResponse?.data?.entities);
    },
    fetchCourses = async () => {
      const formattedCourses: FormattedCourse[] = dummyCourses.map(
        (course) => ({
          id: course._id,
          label: course.course_name,
        })
      );
      setCourses(formattedCourses);
    },
    handleSubmit = async (
      values: any,
      { resetForm }: FormikHelpers<typeof values>
    ) => {
      const formData = {
        categoryA: {
          courses: values.categoryACourses.map((course: any) => course.label),
          meraMasterShare: parseInt(values.categoryAMeraMasterOrgShares),
          tenantShare: values.categoryAMeraMasterTenantShares,
        },
        categoryB: {
          courses: values.categoryBCourses.map((course: any) => course.label),
          meraMasterShare: parseInt(values.categoryBMeraMasterOrgShares),
          tenantShare: values.categoryBMeraMasterTenantShares,
        },
        categoryC: {
          courses: values.categoryCCourses.map((course: any) => course.label),
          meraMasterShare: parseInt(values.categoryCMeraMasterOrgShares),
          tenantShare: values.categoryCMeraMasterTenantShares,
        },
        addOn: {
          courses: values.addOnCourses.map((course: any) => course.label),
          meraMasterShare: parseInt(values.addOnMeraMasterOrgShares),
          tenantShare: values.addOnMeraMasterTenantShares,
        },
      };
      try {
        const response = await axios.post(
          `${BASE_URL}/org/${values.organizationId}/commercial`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          dispatch(
            openSnackbarFunction(
              response.data.message || "Commercial data sent successfully.",
              "success"
            )
          );
          resetForm();
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          dispatch(
            openSnackbarFunction(
              error.response.data.message ||
                (error.response.data &&
                  Object.values(error.response.data)[0]) ||
                "Commercial data already exists.",
              "error"
            )
          );
        } else {
          dispatch(
            openSnackbarFunction(
              error.response.data.message || "Commercial data failed.",
              "error"
            )
          );
        }
      }
    };

  useEffect(() => {
    getOrganizations();
    fetchCourses();
  }, []);

  return (
    <Formik
      initialValues={{
        organizationName: "",
        categoryACourses: [],
        categoryAMeraMasterOrgShares: "",
        categoryAMeraMasterTenantShares: "",
        categoryBCourses: [],
        categoryBMeraMasterOrgShares: "",
        categoryBMeraMasterTenantShares: "",
        categoryCCourses: [],
        categoryCMeraMasterOrgShares: "",
        categoryCMeraMasterTenantShares: "",
        addOnCourses: [],
        addOnMeraMasterOrgShares: "",
        addOnMeraMasterTenantShares: "",
      }}
      onSubmit={handleSubmit}
      // validationSchema={Yup.object().shape({
      //   organizationName: Yup.object().nullable().required("Organisation is required"),
      //   categoryACourses: Yup.array().min(1, "At least one course is required").required("Courses are required"),
      //   categoryAMeraMasterOrgShares: Yup.number().required("MeraMaster Org Shares are required"),
      //   categoryAMeraMasterTenantShares: Yup.number().required("MeraMaster Tenant Shares are required"),
      //   categoryBCourses: Yup.array().min(1, "At least one course is required").required("Courses are required"),
      //   categoryBMeraMasterOrgShares: Yup.number().required("MeraMaster Org Shares are required"),
      //   categoryBMeraMasterTenantShares: Yup.number().required("MeraMaster Tenant Shares are required"),
      //   categoryCCourses: Yup.array().min(1, "At least one course is required").required("Courses are required"),
      //   categoryCMeraMasterOrgShares: Yup.number().required("MeraMaster Org Shares are required"),
      //   categoryCMeraMasterTenantShares: Yup.number().required("MeraMaster Tenant Shares are required"),
      //   addOnCourses: Yup.array().min(1, "At least one course is required").required("Courses are required"),
      //   addOnMeraMasterOrgShares: Yup.number().required("MeraMaster Org Shares are required"),
      //   addOnMeraMasterTenantShares: Yup.number().required("MeraMaster Tenant Shares are required"),
      // })}
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
          <MainCard
            sx={{
              maxWidth: "80%",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <Grid container spacing={2}>
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
                  id="organizationName"
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
              <Grid item lg={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <span>Category A</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputLabel>Courses</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      multiple
                      id="categoryACourses"
                      options={courses}
                      value={values.categoryACourses}
                      getOptionLabel={(option) => option.label}
                      filterSelectedOptions
                      renderOption={(props, option) => (
                        <li {...props}>{option.label}</li>
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.label}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(_, newValue) =>
                        setFieldValue("categoryACourses", newValue)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Mera Master Organisation Share (%)"
                  id="categoryAMeraMasterOrgShares"
                  placeholder="Enter Mera Master Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "categoryAMeraMasterOrgShares",
                      "categoryAMeraMasterTenantShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Tenant Organisation Share (%)"
                  id="categoryAMeraMasterTenantShares"
                  placeholder="Enter Tenant Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "categoryAMeraMasterTenantShares",
                      "categoryAMeraMasterOrgShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginTop: "8px" }}
            >
              <Grid item lg={12}>
                <span>Category B</span>
              </Grid>

              <Grid item xs={12} lg={4}>
                <InputLabel>Courses</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      multiple
                      id="categoryBCourses"
                      options={courses}
                      value={values.categoryBCourses}
                      getOptionLabel={(option) => option.label}
                      filterSelectedOptions
                      renderOption={(props, option) => (
                        <li {...props}>{option.label}</li>
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.label}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(_, newValue) =>
                        setFieldValue("categoryBCourses", newValue)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Mera Master Organisation Share (%)"
                  id="categoryBMeraMasterOrgShares"
                  placeholder="Enter Mera Master Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "categoryBMeraMasterOrgShares",
                      "categoryBMeraMasterTenantShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Tenant Organisation Share (%)"
                  id="categoryBMeraMasterTenantShares"
                  placeholder="Enter Tenant Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "categoryBMeraMasterTenantShares",
                      "categoryBMeraMasterOrgShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginTop: "8px" }}
            >
              <Grid item lg={12}>
                <span>Category C</span>
              </Grid>

              <Grid item xs={12} lg={4}>
                <InputLabel>Courses</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      multiple
                      id="categoryCCourses"
                      options={courses}
                      getOptionLabel={(option) => option.label}
                      value={values.categoryCCourses}
                      filterSelectedOptions
                      renderOption={(props, option) => (
                        <li {...props}>{option.label}</li>
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.label}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(_, newValue) =>
                        setFieldValue("categoryCCourses", newValue)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Mera Master Organisation Share (%)"
                  id="categoryCMeraMasterOrgShares"
                  placeholder="Enter Mera Master Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "categoryCMeraMasterOrgShares",
                      "categoryCMeraMasterTenantShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Tenant Organisation Share (%)"
                  id="categoryCMeraMasterTenantShares"
                  placeholder="Enter Tenant Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "categoryCMeraMasterTenantShares",
                      "categoryCMeraMasterOrgShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginTop: "8px" }}
            >
              <Grid item lg={12}>
                <span>Add On</span>
              </Grid>

              <Grid item xs={12} lg={4}>
                <InputLabel>Courses</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      multiple
                      id="addOnCourses"
                      value={values.addOnCourses}
                      options={courses}
                      getOptionLabel={(option) => option.label}
                      filterSelectedOptions
                      renderOption={(props, option) => (
                        <li {...props}>{option.label}</li>
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.label}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(_, newValue) =>
                        setFieldValue("addOnCourses", newValue)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Mera Master Organisation Share (%)"
                  id="addOnMeraMasterOrgShares"
                  placeholder="Enter Mera Master Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "addOnMeraMasterOrgShares",
                      "addOnMeraMasterTenantShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <InputWithLabel
                  label="Tenant Organisation Share (%)"
                  id="addOnMeraMasterTenantShares"
                  placeholder="Enter Tenant Organisation Share"
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(event: any) => {
                    getPercentage(
                      event.target.value,
                      "addOnMeraMasterTenantShares",
                      "addOnMeraMasterOrgShares",
                      setFieldValue
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginTop: "8px" }}
            >
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
          </MainCard>
        </form>
      )}
    </Formik>
  );
}
export default Commercials;
