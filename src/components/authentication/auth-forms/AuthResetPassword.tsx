"use client";

import React, { useEffect } from "react";
import {
  useTheme,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  VisibilityOff,
  Visibility,
} from "utils/genericExports/theme-imports";
import * as Yup from "yup";
import { Formik } from "formik";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import { dispatch } from "store";
import { strengthColor, strengthIndicator } from "utils/password-strength";
import { useRouter, useSearchParams } from "next/navigation";
import { StringColorProps } from "types";
import { resetPassword } from "store/slices/authSlice";
import { openSnackbarFunction } from "utils/utils";
import {
  AN_ERROR_OCCURRED,
  PASSWORD_REQUIRED,
  PASSWORD_RESET_FAILED,
  PASSWORD_RESET_SUCCESS,
} from "shared/errorMessages";
import { LOGIN } from "shared/constants/routerUrls";

const AuthResetPassword = ({ ...others }) => {
  const theme = useTheme(),
    scriptedRef = useScriptRef(),
    [showPassword, setShowPassword] = React.useState(false),
    [strength, setStrength] = React.useState(0),
    [level, setLevel] = React.useState<StringColorProps>(),
    searchParams = useSearchParams(),
    token = searchParams.get("token") ?? "",
    router = useRouter();

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

  useEffect(() => {
    changePassword("");
  }, []);

  const onSubmitClick = async (values: any, responseObject: any) => {
    const { setErrors, setStatus, setSubmitting } = responseObject;
    try {
      const response = await dispatch(
        resetPassword({ token, newPassword: values.password })
      );
      if (resetPassword.fulfilled.match(response)) {
        if (scriptedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
          dispatch(
            openSnackbarFunction(
              response.payload.message || PASSWORD_RESET_SUCCESS,
              "success"
            )
          );
        }
        setTimeout(() => {
          router.push(LOGIN);
        }, 1000);
      } else if (resetPassword.rejected.match(response)) {
        if (scriptedRef.current) {
          const errorMessage =
            typeof response.payload === "object" && response.payload !== null
              ? response.error || PASSWORD_RESET_FAILED
              : PASSWORD_RESET_FAILED;

          setStatus({ success: false });
          setErrors({ submit: errorMessage as string });
          setSubmitting(false);
        }
      }
    } catch (err: any) {
      if (scriptedRef.current) {
        const errorMessage = err.message || AN_ERROR_OCCURRED;
        setStatus({ success: false });
        setErrors({ submit: errorMessage });
        setSubmitting(false);
        dispatch(openSnackbarFunction(errorMessage, "error"));
      }
    }
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().max(255).required(PASSWORD_REQUIRED),
        confirmPassword: Yup.string()
          .required("Confirm Password is required")
          .test(
            "confirmPassword",
            "Both Password must be same!",
            (confirmPassword, yup) => yup.parent.password === confirmPassword
          ),
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
            error={Boolean(touched.password && errors.password)}
            sx={{ ...theme.typography.customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-password-reset">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-reset"
              type={showPassword ? "text" : "password"}
              value={values.password}
              name="password"
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
          </FormControl>
          {touched.password && errors.password && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-reset">
                {errors.password}
              </FormHelperText>
            </FormControl>
          )}
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

          <FormControl
            fullWidth
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            sx={{ ...theme.typography.customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              label="Confirm Password"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
          </FormControl>

          {touched.confirmPassword && errors.confirmPassword && (
            <FormControl fullWidth>
              <FormHelperText
                error
                id="standard-weight-helper-text-confirm-password"
              >
                {" "}
                {errors.confirmPassword}{" "}
              </FormHelperText>
            </FormControl>
          )}

          {errors.submit && (
            <Box
              sx={{
                mt: 3,
              }}
            >
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box
            sx={{
              mt: 1,
            }}
          >
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
                Reset Password
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
