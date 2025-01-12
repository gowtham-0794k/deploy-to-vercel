"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { completeRegistration, selectUser } from "store/slices/authSlice";
import {
  useTheme,
  Box,
  Button,
  Grid,
  Typography,
  MenuItem,
  TextField,
} from "utils/genericExports/theme-imports";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "ui-component/extended/AnimateButton";
import { dispatch } from "store";
import { openSnackbarFunction } from "utils/utils";
import {
  REGISTRATION_COMPLETED,
  REGISTRATION_FAILED,
} from "shared/errorMessages";
import { LOGIN } from "shared/constants/routerUrls";

const JWTRegister = ({ ...others }) => {
  const theme = useTheme(),
    router = useRouter(),
    [showOtherState, setShowOtherState] = React.useState(false),
    { user } = useSelector(selectUser),
    userEmail = user?.email as string;
  const onSubmitClick = async (values: any, responseObject: any) => {
    const { setStatus, setSubmitting } = responseObject,
      { firstName, lastName, course, states } = values,
      formData = {
        email: userEmail,
        firstName: firstName,
        lastName: lastName,
        course: course,
        states: states,
      };
    try {
      const response = await dispatch(completeRegistration(formData));
      if (response.payload.error) {
        throw new Error(REGISTRATION_FAILED);
      } else {
        setStatus({ success: true });
        setSubmitting(false);
        dispatch(openSnackbarFunction(REGISTRATION_COMPLETED, "success"));

        setTimeout(() => {
          router.push(LOGIN);
        }, 1500);
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || REGISTRATION_FAILED,
      });
      setSubmitting(false);
      dispatch(
        openSnackbarFunction(err.message || REGISTRATION_FAILED, "error")
      );
    }
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
          firstName: "",
          lastName: "",
          course: "",
          states: "",
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required("First Name is required"),
          lastName: Yup.string().required("Last Name is required"),
          course: Yup.string().required("Course is required"),
          states: Yup.string().required("State is required"),
        })}
        onSubmit={(values, { setErrors, setStatus, setSubmitting }) =>
          onSubmitClick(values, { setErrors, setStatus, setSubmitting })
        }
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={{ xs: 0, sm: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ ...theme.typography.customInput }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ ...theme.typography.customInput }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={{ xs: 0, sm: 2 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Courses"
                  margin="normal"
                  name="course"
                  value={values.course}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.course && Boolean(errors.course)}
                  helperText={touched.course && errors.course}
                  sx={{
                    ...theme.typography.customInput,
                    "& .MuiInputBase-root": { height: "64px" },
                    "& .MuiSelect-select": {
                      paddingTop: "30px",
                      paddingBottom: "12px",
                    },
                  }}
                >
                  <MenuItem value="CS101">
                    Introduction to Computer Science
                  </MenuItem>
                  <MenuItem value="CS201">Data Structures</MenuItem>
                  <MenuItem value="CS301">Algorithms</MenuItem>
                  <MenuItem value="CS401">Database Management</MenuItem>
                  <MenuItem value="CS501">Web Development</MenuItem>
                  <MenuItem value="CS601">Machine Learning</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {!showOtherState ? (
              <TextField
                select
                fullWidth
                label="States"
                margin="normal"
                name="states"
                value={values.states}
                onBlur={handleBlur}
                onChange={(e) => {
                  if (e.target.value === "others") {
                    setShowOtherState(true);
                    setFieldValue("states", "");
                  } else {
                    handleChange(e);
                  }
                }}
                error={touched.states && Boolean(errors.states)}
                helperText={touched.states && errors.states}
                sx={{
                  ...theme.typography.customInput,
                  "& .MuiInputBase-root": { height: "64px" },
                  "& .MuiSelect-select": {
                    paddingTop: "30px",
                    paddingBottom: "12px",
                  },
                }}
              >
                <MenuItem value="AP">Andhra Pradesh</MenuItem>
                <MenuItem value="AR">Arunachal Pradesh</MenuItem>
                <MenuItem value="AS">Assam</MenuItem>
                <MenuItem value="BR">Bihar</MenuItem>
                <MenuItem value="CT">Chhattisgarh</MenuItem>
                <MenuItem value="GA">Goa</MenuItem>
                <MenuItem value="GJ">Gujarat</MenuItem>
                <MenuItem value="HR">Haryana</MenuItem>
                <MenuItem value="HP">Himachal Pradesh</MenuItem>
                <MenuItem value="JH">Jharkhand</MenuItem>
                <MenuItem value="KA">Karnataka</MenuItem>
                <MenuItem value="KL">Kerala</MenuItem>
                <MenuItem value="MP">Madhya Pradesh</MenuItem>
                <MenuItem value="MH">Maharashtra</MenuItem>
                <MenuItem value="MN">Manipur</MenuItem>
                <MenuItem value="ML">Meghalaya</MenuItem>
                <MenuItem value="MZ">Mizoram</MenuItem>
                <MenuItem value="NL">Nagaland</MenuItem>
                <MenuItem value="OR">Odisha</MenuItem>
                <MenuItem value="PB">Punjab</MenuItem>
                <MenuItem value="RJ">Rajasthan</MenuItem>
                <MenuItem value="SK">Sikkim</MenuItem>
                <MenuItem value="TN">Tamil Nadu</MenuItem>
                <MenuItem value="TG">Telangana</MenuItem>
                <MenuItem value="TR">Tripura</MenuItem>
                <MenuItem value="UP">Uttar Pradesh</MenuItem>
                <MenuItem value="UT">Uttarakhand</MenuItem>
                <MenuItem value="WB">West Bengal</MenuItem>
                <MenuItem value="AN">Andaman and Nicobar Islands</MenuItem>
                <MenuItem value="CH">Chandigarh</MenuItem>
                <MenuItem value="DN">Dadra and Nagar Haveli</MenuItem>
                <MenuItem value="DD">Daman and Diu</MenuItem>
                <MenuItem value="DL">Delhi</MenuItem>
                <MenuItem value="JK">Jammu and Kashmir</MenuItem>
                <MenuItem value="LA">Ladakh</MenuItem>
                <MenuItem value="LD">Lakshadweep</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Enter State"
                margin="normal"
                name="states"
                value={values.states}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.states && Boolean(errors.states)}
                helperText={touched.states && errors.states}
                sx={{ ...theme.typography.customInput }}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => {
                        setShowOtherState(false);
                        setFieldValue("states", "");
                      }}
                      size="small"
                    >
                      Back to List
                    </Button>
                  ),
                }}
              />
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Complete Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTRegister;
