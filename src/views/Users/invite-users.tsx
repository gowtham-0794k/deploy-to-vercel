"use client";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import MenuItem from "@mui/material/MenuItem";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAxios, postAxios } from "shared";
import {
  ASSIGN_ROLES,
  GET_COURSES,
  GET_SALES_PACKAGES,
  POST_INVITE_USER_PACKAGES,
  SEND_SUPER_ADMIN_INVITE,
} from "shared/constants/routerUrls";
import { useSession } from "next-auth/react";
import { openSnackbarFunction } from "utils/utils";
import { flattenCourseData } from "views/AdminPages/mapSalesPack";

// Validation schema
const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_no: Yup.string().required("Phone number is required"),
  course: Yup.string().required("Course selection is required"),
  package: Yup.string().required("Package selection is required"),
});

function InviteUsers() {
  const initialValues = {
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      course: "",
      package: "",
    },
    { data: session } = useSession(),
    [course, setCourse] = useState<any[]>([]),
    [packages, setPackages] = useState<any[]>([]),
    userData: any = session?.user,
    orgId = userData?._doc?.orgId,
    dispatch = useDispatch(),
    handleSubmit = async (values: any, { resetForm }: { resetForm: any }) => {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobileNumber: values.phone_no,
        OrgName: orgId,
        orgId: orgId,
        roleName: "User",
      };
      try {
        const inviteResponse = await postAxios({
          url: SEND_SUPER_ADMIN_INVITE,
          values: payload,
        });
        if (inviteResponse.status === 200) {
          const { data: userData } = inviteResponse;
          const inviteSuperAdminPayload = {
            userID: userData?.data?._id,
            roleName: userData?.data?.roleName,
            createdBy: orgId,
            org_id: orgId,
          };
          await postAxios({
            url: ASSIGN_ROLES,
            values: inviteSuperAdminPayload,
          });
          const userPackPayload = {
            userId: userData?.data?._id,
            packId: values.package,
            courseId: values.course,
          };
          await postAxios({
            url: POST_INVITE_USER_PACKAGES,
            values: userPackPayload,
          });
          dispatch(
            openSnackbarFunction(
              inviteResponse.data.message || "Invitaion sent successfully.",
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
                "Invitation Already sent to email.",
              "error"
            )
          );
        } else {
          dispatch(
            openSnackbarFunction(
              error.response.data.message || "Invitation Failed.",
              "error"
            )
          );
        }
      }
    },
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
      } catch (error) {
        setPackages([]);
        dispatch(openSnackbarFunction("Failed to fetch sales pack", "error"));
      }
    };

  useEffect(() => {
    getInitialValues();
  }, []);

  return (
    <Grid
      container
      spacing={gridSpacing}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <MainCard content={false}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={12} lg={8}>
                      <Typography variant="h5" sx={{ mb: 3 }}>
                        Personal Info
                      </Typography>
                      <TextField
                        id="first_name"
                        name="first_name"
                        label="First Name"
                        fullWidth
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.first_name && Boolean(errors.first_name)}
                        helperText={touched.first_name && errors.first_name}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        id="last_name"
                        name="last_name"
                        label="Last Name"
                        fullWidth
                        value={values.last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.last_name && Boolean(errors.last_name)}
                        helperText={touched.last_name && errors.last_name}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        id="phone_no"
                        name="phone_no"
                        label="Phone Number"
                        fullWidth
                        value={values.phone_no}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone_no && Boolean(errors.phone_no)}
                        helperText={touched.phone_no && errors.phone_no}
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>
                        Course Info
                      </Typography>
                      <TextField
                        id="course"
                        name="course"
                        fullWidth
                        label="Choose Course"
                        select
                        value={values.course}
                        onChange={(event) => {
                          handleChangeCourse(event.target.value);
                          setFieldValue("course", event.target.value);
                        }}
                        onBlur={handleBlur}
                        error={touched.course && Boolean(errors.course)}
                        helperText={touched.course && errors.course}
                        sx={{ mb: 2 }}
                      >
                        {course.map((courseItem) => (
                          <MenuItem key={courseItem._id} value={courseItem._id}>
                            {courseItem.courseName}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        id="package"
                        name="package"
                        fullWidth
                        label="Assign Package"
                        select
                        value={values.package}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.package && Boolean(errors.package)}
                        helperText={touched.package && errors.package}
                      >
                        {packages.map((pack) => (
                          <MenuItem
                            key={pack.salesPackId}
                            value={pack.salesPackId}
                          >
                            {pack.nameSalesPack}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Grid item>
                    <Button variant="contained" color="secondary" type="submit">
                      Send Invite
                    </Button>
                  </Grid>
                </CardActions>
              </Form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default InviteUsers;
