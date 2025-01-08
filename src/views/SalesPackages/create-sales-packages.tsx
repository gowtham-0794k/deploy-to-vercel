"use client";

import {
  AdapterDayjs,
  Button,
  DatePicker,
  Grid,
  LocalizationProvider,
  MainCard,
  MenuItem,
  TextField,
  Typography,
} from "utils/genericExports/theme-imports";
import {
  SecondaryAction,
  gridSpacing,
} from "utils/genericExports/uiComponentsimports";
import { Formik, Form, Field, FormikHelpers } from "formik";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, GET_GROUPS, SALES_PACK } from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import dayjs from "dayjs";

interface FormValues {
  courseGroup: string;
  salesPackName: string;
  courseBundle: string;
  freeDuration: string;
  salePrice: string;
}

interface Group {
  _id: string;
  groupName: string;
}
interface Bundles {
  _id: string;
  packageName: string;
}

const CreateSalesPackages = () => {
  const [toggleValue, setToggleValue] = useState("");
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState<Group[]>([]);
  const [bundles, setBundles] = useState<Bundles[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(GET_GROUPS);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchBundles = async (groupId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/group-bundle/${groupId}`);
      const bundleData = response.data.data.packages.map((bundle: any) => ({
        packageName: bundle.packageName,
        _id: bundle._id,
      }));
      setBundles(bundleData);
    } catch (error) {
      console.error("Error fetching bundles:", error);
    }
  };

  const initialValues: FormValues = {
    courseGroup: "",
    salesPackName: "",
    courseBundle: "",
    freeDuration: "",
    salePrice: "",
  };

  const handleGroupChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedGroupId = event.target.value as string;
    if (selectedGroupId) {
      fetchBundles(selectedGroupId);
    } else {
      setBundles([]);
    }
  };
  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};

    if (!values.courseGroup) {
      errors.courseGroup = "Course group is required";
    }
    if (!values.salesPackName) {
      errors.salesPackName = "Sales pack name is required";
    }
    if (!values.courseBundle) {
      errors.courseBundle = "Course bundle is required";
    }

    if (toggleValue === "yes") {
      if (!values.freeDuration) {
        errors.freeDuration = "Free duration is required for free packs";
      } else if (Number(values.freeDuration) <= 0) {
        errors.freeDuration = "Free duration must be positive";
      }
    } else if (toggleValue === "no") {
      if (!values.salePrice) {
        errors.salePrice = "Sale price is required for paid packs";
      } else if (Number(values.salePrice) <= 0) {
        errors.salePrice = "Sale price must be positive";
      }
    }

    return errors;
  };
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const PackData = {
        selectCourseGroup: values.courseGroup,
        AddCourseBundle: values.courseBundle,
        nameSalesPack: values.salesPackName,
        FreePack: toggleValue === "yes",
        FreePackDuration:
          toggleValue === "yes" ? parseInt(values.freeDuration, 10) : 0,
        PackStartDate: new Date().toISOString(),
        PackEndDate: toggleValue === "no" ? endDate?.toISOString() : "",
        salepackprice: toggleValue === "no" ? parseFloat(values.salePrice) : 0,
      };
      const response = await axios.post(SALES_PACK, PackData);
      if (response.status === 201) {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Sales Pack created successfully.",
            "success"
          )
        );
        setToggleValue("");
        setEndDate(null);
        values.courseGroup = "";
        values.courseBundle = "";
        values.salesPackName = "";
        values.freeDuration = "";
        values.salePrice = "";
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message || "Sales Pack already created.",
            "warning"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction(
            error.response.data.message || "Something went wrong.",
            "error"
          )
        );
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <MainCard title="Create New Pack">
            <Form>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    id="courseGroup"
                    name="courseGroup"
                    label="Select the Course Group"
                    value={values.courseGroup}
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      handleChange(event);
                      handleGroupChange(event);
                    }}
                    onBlur={handleBlur}
                    error={touched.courseGroup && !!errors.courseGroup}
                    helperText={touched.courseGroup && errors.courseGroup}
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="salesPackName"
                    name="salesPackName"
                    label="Name the Sales Pack"
                    value={values.salesPackName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.salesPackName && !!errors.salesPackName}
                    helperText={touched.salesPackName && errors.salesPackName}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography variant="subtitle1">Free Pack</Typography>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Button
                            variant={
                              toggleValue === "yes" ? "contained" : "outlined"
                            }
                            onClick={() => {
                              setToggleValue("yes");
                              setFieldValue("toggleValue", "yes");
                              setFieldValue("salePrice", "");
                            }}
                          >
                            Yes
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant={
                              toggleValue === "no" ? "contained" : "outlined"
                            }
                            onClick={() => {
                              setToggleValue("no");
                              setFieldValue("toggleValue", "no");
                              setFieldValue("freeDuration", "");
                            }}
                          >
                            No
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {toggleValue === "yes" && (
                <div style={{ marginTop: "24px" }}>
                  <MainCard
                    secondary={
                      <SecondaryAction link="https://next.material-ui.com/components/text-fields/" />
                    }
                  >
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          id="courseBundle"
                          name="courseBundle"
                          label="Select Course Bundle"
                          select
                          value={values.courseBundle}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.courseBundle && !!errors.courseBundle}
                          helperText={
                            touched.courseBundle && errors.courseBundle
                          }
                          sx={{ mb: 2 }}
                        >
                          {bundles.map((bundle) => (
                            <MenuItem key={bundle._id} value={bundle._id}>
                              {bundle.packageName}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          type="number"
                          id="freeDuration"
                          name="freeDuration"
                          label="Free Duration (days)"
                          onBlur={handleBlur}
                          error={touched.freeDuration && !!errors.freeDuration}
                          helperText={
                            touched.freeDuration && errors.freeDuration
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid item>
                            <Button variant="contained" type="submit">
                              Save
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </div>
              )}

              {toggleValue === "no" && (
                <div style={{ marginTop: "24px" }}>
                  <MainCard
                    secondary={
                      <SecondaryAction link="https://next.material-ui.com/components/text-fields/" />
                    }
                  >
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          id="courseBundle"
                          name="courseBundle"
                          label="Select Course Bundle"
                          select
                          value={values.courseBundle}
                          onChange={handleChange}
                          sx={{ mb: 2 }}
                        >
                          {bundles.map((bundle) => (
                            <MenuItem key={bundle._id} value={bundle._id}>
                              {bundle.packageName}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Package End Date"
                            value={endDate}
                            minDate={dayjs()}
                            onChange={(newValue: dayjs.Dayjs | null) =>
                              setEndDate(newValue)
                            }
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          type="number"
                          id="salePrice"
                          name="salePrice"
                          label="Sale Price"
                          onBlur={handleBlur}
                          error={touched.salePrice && !!errors.salePrice}
                          helperText={touched.salePrice && errors.salePrice}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid item>
                            <Button variant="contained" type="submit">
                              Save
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </div>
              )}
            </Form>
          </MainCard>
        )}
      </Formik>
    </div>
  );
};

export default CreateSalesPackages;