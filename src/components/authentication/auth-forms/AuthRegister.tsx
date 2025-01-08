"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "ui-component/extended/AnimateButton";
import { dispatch } from "store";
import { strengthColor, strengthIndicator } from "utils/password-strength";
import { StringColorProps } from "types";
import { registerUser } from "store/slices/authSlice";
import {
  useTheme,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Select,
  MenuItem,
  VisibilityOff,
  Visibility,
} from "utils/genericExports/theme-imports";
import { openSnackbarFunction } from "utils/utils";
import { CHECK_MAIL } from "shared/constants/routerUrls";
import {
  ACCEPT_TERMS_AND_CONDITIONS,
  EMAIL_REQUIRED,
  INVALID_INDIAN_MOBILE_NUMBER,
  INVALID_MOBILE_NUMBER,
  MOBILE_NUMBER_REQUIRED,
  OTP_SENT,
  PASSWORD_REQUIRED,
  REGISTER_FAILED,
  UN_EXPECTED_ERROR,
} from "shared/errorMessages";

const JWTRegister = ({ ...others }) => {
  const theme = useTheme(),
    router = useRouter(),
    [showPassword, setShowPassword] = React.useState(false),
    [strength, setStrength] = React.useState(0),
    [level, setLevel] = React.useState<StringColorProps>();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const onSubmitClick = async (values: any, responseObject: any) => {
    const { setErrors, setStatus, setSubmitting } = responseObject,
      { isdCode, mobileNumber, email, password } = values,
      formData = {
        isdCode: isdCode,
        mobileNumber: mobileNumber,
        email: email,
        password: password,
      };

    try {
      const actionResult = await dispatch(registerUser(formData));
      if (registerUser.rejected.match(actionResult)) {
        // Handle API error responses
        const errorPayload = actionResult.payload as {
            error?: string;
            message?: string;
          },
          errorMessage =
            errorPayload?.error || errorPayload?.message || REGISTER_FAILED;
        dispatch(openSnackbarFunction(errorMessage, "error"));
        setStatus({ success: false });
      } else if (registerUser.fulfilled.match(actionResult)) {
        const responseData = actionResult.payload as {
          message?: string;
          user?: any;
        };
        dispatch(openSnackbarFunction(responseData.message || OTP_SENT, "success"));
        setTimeout(() => {
          router.push(CHECK_MAIL);
        }, 1500);
      }
    } catch (error: any) {
      dispatch(openSnackbarFunction(UN_EXPECTED_ERROR, "error"));
      setErrors({ submit: UN_EXPECTED_ERROR });
      setStatus({ success: false });
    } finally {
      setSubmitting(false);
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
          password: "",
          isdCode: "+91",
          mobileNumber: "",
          termsAccepted: false,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          mobileNumber: Yup.string()
            .required(MOBILE_NUMBER_REQUIRED)
            .test("mobile", INVALID_MOBILE_NUMBER, function (value) {
              const { isdCode } = this.parent;

              // Only validate Indian mobile numbers
              if (isdCode === "+91") {
                // Ensure exactly 10 digits and starts with 6-9
                const indianmobileRegex = /^[6-9]\d{9}$/;
                if (!indianmobileRegex.test(value)) {
                  return this.createError({
                    message: INVALID_INDIAN_MOBILE_NUMBER,
                  });
                }
              }

              return true;
            }),
          termsAccepted: Yup.boolean()
            .oneOf([true], ACCEPT_TERMS_AND_CONDITIONS)
            .required(ACCEPT_TERMS_AND_CONDITIONS),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required(EMAIL_REQUIRED),
          password: Yup.string().max(255).required(PASSWORD_REQUIRED),
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
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.mobileNumber && errors.mobileNumber)}
              sx={{ mb: 2 }}
            >
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.isdCode}
                    label="ISD Code"
                    name="isdCode"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    placeholder="ISD Code"
                    sx={{
                      padding: "6px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <MenuItem value="+91">+91</MenuItem>
                    <MenuItem value="+4">+4</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={9}>
                  <OutlinedInput
                    id="outlined-adornment-mobile-register"
                    type="text"
                    value={values.mobileNumber}
                    name="mobileNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    placeholder="mobile Number"
                    sx={{ padding: "6px" }}
                  />
                </Grid>
              </Grid>
              {touched.isdCode && errors.isdCode && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.isdCode}
                </FormHelperText>
              )}
              {touched.mobileNumber && errors.mobileNumber && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.mobileNumber}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-register">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-register">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-register"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        sx={{
                          bgcolor: level?.color,
                          width: 85,
                          height: 8,
                          borderRadius: "7px",
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.termsAccepted}
                      onChange={handleChange}
                      name="termsAccepted"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="subtitle1">
                      Agree with &nbsp;
                      <Typography variant="subtitle1" component={Link} href="/">
                        Terms & Condition.
                      </Typography>
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            {touched.termsAccepted && errors.termsAccepted && (
              <FormHelperText error>{errors.termsAccepted}</FormHelperText>
            )}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
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
                  Sign up
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
