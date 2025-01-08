"use client";

import {
  AdapterDayjs,
  Button,
  Grid,
  LocalizationProvider,
  MainCard,
  TextField,
  DatePicker,
  MenuItem,
} from "utils/genericExports/theme-imports";
import { gridSpacing } from "utils/genericExports/uiComponentsimports";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import axios from "axios";
import {
  BASE_URL,
  GET_GROUPS,
  SALES_PACK_BY_GROUP,
} from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import dayjs from "dayjs";

interface Group {
  _id: string;
  groupName: string;
}
interface Bundles {
  _id: string;
  packageName: string;
}

interface SalesPackage {
  _id: string;
  nameSalesPack: string;
  salepackprice: string;
  AddCourseBundle: string[];
  PackEndDate: string | null;
  FreePack: boolean;
  FreePackDuration: number;
}

const initialValues = {
  courseGroup: "",
  salesPackname: "",
  pricePerDays: "",
  courseBundle: [],
  freeDuration: 0,
  endDate: null,
};
const ViewModify = () => {
  const [showSecondCard, setShowSecondCard] = useState(false);
  const [showFirstCard, setShowFirstCard] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [bundles, setBundles] = useState<Bundles[]>([]);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [salesPackages, setSalesPackages] = useState<SalesPackage[]>([]);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [selectedSalesPack, setSelectedSalesPack] =
    useState<SalesPackage | null>(null);
  const [isNewPackageSelected, setIsNewPackageSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const resetForm = (formikHelpers: FormikHelpers<typeof initialValues>) => {
    formikHelpers.resetForm();
    setShowFirstCard(false);
    setShowSecondCard(false);
    setEndDate(null);
    setSelectedSalesPack(null);
    setIsNewPackageSelected(false);
    setBundles([]);
    setIsGroupSelected(false);
  };

  const handleModify = () => {
    if (selectedSalesPack) {
      if (selectedSalesPack.FreePack) {
        setShowFirstCard(true);
        setShowSecondCard(false);
      } else {
        setShowFirstCard(false);
        setShowSecondCard(true);
      }
      setIsNewPackageSelected(false);
    } else {
      console.error("No sales package selected");
    }
  };

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

  const fetchSalesPackages = async (groupId: string) => {
    try {
      const response = await axios.post(SALES_PACK_BY_GROUP, {
        courseGroupId: groupId,
      });
      setSalesPackages(response.data);
    } catch (error) {
      console.error("Error fetching sales packages:", error);
    }
  };

  const handleGroupChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedGroupId = event.target.value as string;
    setIsGroupSelected(!!selectedGroupId);

    if (selectedGroupId) {
      fetchBundles(selectedGroupId);
      fetchSalesPackages(selectedGroupId);
    } else {
      setBundles([]);
      setSalesPackages([]);
    }
  };

  const handleSubmit = async (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    if (!selectedSalesPack?._id) {
      console.error("No sales package selected");
      console.log(endDate);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        _id: selectedSalesPack._id,
        salepackprice: values.pricePerDays,
        AddCourseBundle: values.courseBundle,
        PackEndDate: values.endDate
          ? (values.endDate as dayjs.Dayjs).toISOString()
          : "",
        FreePackDuration: selectedSalesPack?.FreePack ? values.freeDuration : 0,
        FreePack: selectedSalesPack?.FreePack,
      };

      const response = await axios.put(
        `${BASE_URL}/sales-pack/${selectedSalesPack._id}`,
        payload
      );

      if (response.status === 200) {
        // Refresh the sales packages list
        if (values.courseGroup) {
          await fetchSalesPackages(values.courseGroup);
        }
        dispatch(
          openSnackbarFunction("Sales package updated successfully.", "success")
        );
        // Reset form and states
        resetForm(formikHelpers);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message || "Sales package update failed.",
            "error"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction("Error updating sales package.", "error")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <MainCard>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="courseGroup"
                    name="courseGroup"
                    label="Select the Course Group"
                    value={values.courseGroup}
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      handleChange(event);
                      handleGroupChange(event);
                      setFieldValue("salesPackname", "");
                    }}
                    select
                    disabled={isSubmitting}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
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
                    id="salesPackname"
                    name="salesPackname"
                    label="Select the Sales Pack"
                    select
                    disabled={!isGroupSelected || isSubmitting}
                    value={values.salesPackname}
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      const selectedPackId = event.target.value as string;
                      const selectedPack = salesPackages.find(
                        (pack) => pack._id === selectedPackId
                      );

                      if (selectedPack) {
                        setSelectedSalesPack(selectedPack);
                        setFieldValue("salesPackname", selectedPack._id);
                        setFieldValue(
                          "pricePerDays",
                          selectedPack.salepackprice
                        );
                        setFieldValue(
                          "courseBundle",
                          selectedPack.AddCourseBundle
                        );

                        // Convert the ISO string to dayjs object
                        if (selectedPack.PackEndDate) {
                          const dateValue = dayjs(selectedPack.PackEndDate);
                          setEndDate(dateValue);
                          setFieldValue("endDate", dateValue);
                        } else {
                          setEndDate(null);
                          setFieldValue("endDate", null);
                        }

                        setFieldValue(
                          "freeDuration",
                          selectedPack?.FreePackDuration || 0
                        );
                        setIsNewPackageSelected(true);
                      } else {
                        setSelectedSalesPack(null);
                        setFieldValue("salesPackname", "");
                        setFieldValue("pricePerDays", "");
                        setFieldValue("courseBundle", []);
                        setEndDate(null);
                        setFieldValue("endDate", null);
                        setFieldValue("freeDuration", "");
                        setIsNewPackageSelected(false);
                      }
                      setShowFirstCard(false);
                      setShowSecondCard(false);
                    }}
                  >
                    {salesPackages.map((pack) => (
                      <MenuItem key={pack._id} value={pack._id}>
                        {pack.nameSalesPack}
                      </MenuItem>
                    ))}
                  </Field>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={handleModify}
                        disabled={!isNewPackageSelected || isSubmitting}
                      >
                        Modify
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>

            {showFirstCard && (
              <MainCard sx={{ mt: 2 }}>
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
                    <Field
                      as={TextField}
                      fullWidth
                      type="number"
                      id="freeDuration"
                      name="freeDuration"
                      label="Free Duration (days)"
                      value={values.freeDuration}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            )}

            {showSecondCard && (
              <MainCard sx={{ mt: 2 }}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} md={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Package End Date"
                        value={values.endDate} // Use Formik values
                        onChange={(newValue: dayjs.Dayjs | null) => {
                          setEndDate(newValue);
                          setFieldValue("endDate", newValue);
                        }}
                        disabled={isSubmitting}
                        format="DD/MM/YYYY" // Add this to specify the display format
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      as={TextField}
                      label="Add Sale Price Per 15 Days"
                      fullWidth
                      id="pricePerDays"
                      name="pricePerDays"
                      value={values.pricePerDays}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </Grid>
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
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ViewModify;
