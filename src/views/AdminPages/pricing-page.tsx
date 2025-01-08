"use client";
import React, { useEffect, useState } from "react";

import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  TextField,
} from "utils/genericExports/theme-imports";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircle";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { gridSpacing } from "store/constant";
import { useDispatch } from "react-redux";
import { getAxios } from "shared";
import { openSnackbarFunction } from "utils/utils";
import { GET_COURSES, GET_SALES_PACKAGES } from "shared/constants/routerUrls";
import { useSession } from "next-auth/react";
import { flattenCourseData, getMonths, staticFeatures } from "./mapSalesPack";

const ListItem = ({ type }: { type: boolean }) => (
  <Box sx={{ px: 2, py: 0.5 }}>
    {type ? (
      <CheckCircleTwoToneIcon sx={{ color: "success.dark" }} />
    ) : (
      <RemoveRoundedIcon sx={{ opacity: 0.3 }} />
    )}
  </Box>
);

const PlanList = () => {
  const initialValues = {
      courseId: "",
      packageId: "",
    },
    handleSubmit = async (values: any) => {},
    { data: session } = useSession(),
    userData: any = session?.user,
    [course, setCourse] = useState<any[]>([]),
    [packages, setPackages] = useState<any[]>([]),
    [packagesCopy, setPackagesCopy] = useState<any[]>([]),
    [buttonMonths, setButtonMonths] = useState<any>([]),
    dispatch = useDispatch(),
    getInitialValues = async () => {
      try {
        const groupResponse = await getAxios({
          url: `${GET_COURSES}${userData?._doc?.orgId}`,
        });
        setCourse(groupResponse?.data);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch course", "error"));
      }
    },
    handleChangeCourse = async (event: any) => {
      try {
        const salesResponse = await getAxios({
          url: `${GET_SALES_PACKAGES}${event}`,
        });
        const flatResponse = flattenCourseData(salesResponse?.data);
        const sortedData = flatResponse.sort(
          (a, b) => parseInt(a.salepackprice) - parseInt(b.salepackprice)
        );
        setPackages(sortedData);
        setPackagesCopy(sortedData);
        const buttonsName = await getMonths(sortedData);
        setButtonMonths(buttonsName);
      } catch (error) {
        setPackages([]);
        setPackagesCopy([]);
        setButtonMonths([]);
        dispatch(openSnackbarFunction("Failed to fetch sales pack", "error"));
      }
    },
    handleOrderNow = (id: string) => {},
    handleClick = (month: any) => {
      if (!month) {
        setPackages(packagesCopy);
        return;
      }
      // Filtering logic
      const filtered = packagesCopy.filter((item) => {
        const endDate = item?.PackEndDate;
        if (!endDate) return true;

        const endMonth = new Date(endDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        return endMonth === month;
      });

      setPackages(filtered);
    },
    handleShowAll = () => {
      handleClick(null);
    };

  useEffect(() => {
    getInitialValues();
  }, []);

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          courseId: Yup.string().required("Course is required !"),
        })}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  id="courseId"
                  name="courseId"
                  label=" Select Course"
                  select
                  value={values.courseId}
                  onChange={(event) => {
                    handleChangeCourse(event.target.value);
                    setFieldValue("courseId", event.target.value);
                  }}
                  sx={{ mb: 2 }}
                >
                  {course.map((courseItem) => (
                    <MenuItem key={courseItem._id} value={courseItem._id}>
                      {courseItem.courseName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      {buttonMonths?.length !== 0 && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          {buttonMonths.map((month: any) => (
            <Button
              key={month}
              variant="contained"
              color="primary"
              onClick={() => handleClick(month)}
            >
              {month}
            </Button>
          ))}
          <Button variant="contained" color="secondary" onClick={handleShowAll}>
            Show All
          </Button>
        </Box>
      )}
      {packages?.length !== 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Features</TableCell>
                {packages.map((pack, index) => (
                  <TableCell key={index} align="center">
                    <strong>{pack.nameSalesPack}</strong>
                    <br />
                    {pack.salepackprice === "0"
                      ? "FREE"
                      : `${pack.salepackprice} INR`}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {staticFeatures
                .filter((feature: string) =>
                  packages.some((pack) => pack.features.includes(feature))
                )
                .map((feature: string, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{feature}</TableCell>
                    {packages.map((pack, index) => (
                      <TableCell key={index} align="center">
                        <ListItem type={pack.features.includes(feature)} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={1} />
                {packages.map((pack, index) => (
                  <TableCell key={index} align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOrderNow(pack.nameSalesPack)}
                    >
                      Order Now
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default PlanList;
