"use client";
import Grid from "@mui/material/Grid";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import { Form, Formik } from "formik";
import {
  Button,
  Checkbox,
  FormHelperText,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "utils/genericExports/theme-imports";
import { useEffect, useState } from "react";
import { getAxios, postAxios } from "shared";
import { useDispatch } from "react-redux";
import {
  GET_ASSIGN_PACK,
  GET_COURSES,
  POST_ASSIGN_PACKAGES,
} from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useSession } from "next-auth/react";
import * as Yup from "yup";

function AssignPackages() {
  const initialValues = {
      courseId: "",
      salesPackageId: "",
    },
    { data: session } = useSession(),
    userData: any = session?.user,
    [course, setCourse] = useState<any[]>([]),
    [selected, setSelected] = useState<any>([]),
    [assignedCourse, setAssignedCourse] = useState<any[]>([]),
    dispatch = useDispatch(),
    handleSubmit = async (values: any) => {
      try {
        const assignPackageResponse = await postAxios({
          url: POST_ASSIGN_PACKAGES,
          values,
        });
        if (assignPackageResponse)
          openSnackbarFunction(
            "Successfully assigned package to course",
            "success"
          );
      } catch (error: any) {
        dispatch(
          openSnackbarFunction(
            error?.response?.data?.message ?? "Failed to fetch course",
            "error"
          )
        );
      }
    },
    getInitialValues = async () => {
      try {
        const groupResponse = await getAxios({
          url: `${GET_COURSES}${userData?._doc?.orgId}`,
        });
        setCourse(groupResponse?.data);
        const assignedCoursesResponse = await getAxios({
          url: `${GET_ASSIGN_PACK}${userData?._doc?.orgId}`,
        });
        setAssignedCourse(assignedCoursesResponse?.data);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch course", "error"));
      }
    },
    handleCheckboxChange = (id: any, setFieldValue: any) => {
      setSelected((prevSelected: any) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item: any) => item !== id)
          : [...prevSelected, id]
      );
      setFieldValue("salesPackageId", selected);
    };

  useEffect(() => {
    getInitialValues();
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        courseId: Yup.string().required("Course is required !"),
        salesPackageId: Yup.array().required("Package is required !"),
      })}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        touched,
        errors,
        handleBlur,
      }) => (
        <Form>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <MainCard title="Assign Course">
                <Grid item xs={12} spacing={2}>
                  <TextField
                    fullWidth
                    id="courseId"
                    name="courseId"
                    label=" Select Course"
                    select
                    value={values.courseId}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    onBlur={handleBlur}
                    error={touched.courseId && Boolean(errors.courseId)}
                  >
                    {course.map((courseItem) => (
                      <MenuItem key={courseItem._id} value={courseItem._id}>
                        {courseItem.courseName}
                      </MenuItem>
                    ))}
                  </TextField>
                  {touched.courseId && errors.courseId && (
                    <FormHelperText error>{errors.courseId}</FormHelperText>
                  )}
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title="Assigned Courses">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Select</TableCell>
                        <TableCell>Group Name</TableCell>
                        <TableCell>Package Name</TableCell>
                        <TableCell>Package Type</TableCell>
                        <TableCell>Papers</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedCourse.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell>
                            <Checkbox
                              checked={selected.includes(row._id)}
                              onChange={() =>
                                handleCheckboxChange(row._id, setFieldValue)
                              }
                            />
                          </TableCell>
                          <TableCell>{row.groupName}</TableCell>
                          <TableCell>{row.packageName}</TableCell>
                          <TableCell>{row.nameSalesPack}</TableCell>
                          <TableCell>
                            {row.papers.map((paper: string, index: number) => (
                              <div key={index}>
                                {index + 1}. {paper}
                              </div>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {touched.salesPackageId && errors.salesPackageId && (
                  <FormHelperText error>{errors.salesPackageId}</FormHelperText>
                )}
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="contained" color="secondary" type="submit">
                  Assign
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default AssignPackages;
