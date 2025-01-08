import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  CircularProgress,
  VisibilityOff,
  Visibility,
} from "utils/genericExports/theme-imports";
import * as Yup from "yup";
import { Formik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { SAMPLE_PAGE, USER_ROLES } from "shared/constants/routerUrls";
import {
  INVALID_EMAIL_AND_PASSWORD,
  SIGN_IN_ERROR,
} from "shared/errorMessages";
import useConfig from "hooks/useConfig";
import { postAxios } from "shared";

const JWTLogin = ({ ...others }) => {
  const { rolesAndPermissionsChange } = useConfig(),
    { data: session } = useSession(),
    theme = useTheme(),
    router = useRouter(),
    searchParams = useSearchParams(),
    callbackUrl = searchParams.get("callbackUrl") || SAMPLE_PAGE,
    [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const onSubmitClick = async (values: any, responseObject: any) => {
    const { setErrors, setStatus, setSubmitting } = responseObject;
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (result?.error) {
        setStatus({ success: false });
        setErrors({ submit: INVALID_EMAIL_AND_PASSWORD });
        setSubmitting(false);
      } else {
        setStatus({ success: true });
        router.push(callbackUrl);
        const userRolesPayload = {
          id: session?.user?.id,
        };
        const userRolesResponse = await postAxios({
          url: USER_ROLES,
          values: userRolesPayload,
        });
        if (!userRolesResponse) {
          throw new Error("Could't fetch roles and permissions !");
        }
        const rolesResponse = userRolesResponse?.data?.role;
        rolesAndPermissionsChange(rolesResponse);
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: SIGN_IN_ERROR });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9]{10,15}$/,
            "Please enter a valid email or mobile number"
          )
          .required("Email/Mobile Number is required"),
        password: Yup.string().max(255).required("Password is required"),
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
            error={Boolean(touched.email && errors.email)}
            sx={{ ...theme.typography.customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-email-login">
              Email Address / Mobile Number
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
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
                id="standard-weight-helper-text-email-login"
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
            <InputLabel htmlFor="outlined-adornment-password-login">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? "text" : "password"}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
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
                id="standard-weight-helper-text-password-login"
              >
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel
                control={<Checkbox name="checked" color="primary" />}
                label="Keep me logged in"
              />
            </Grid>
            <Grid item>
              <Typography
                variant="subtitle1"
                component={Link}
                href={"/forgot-password"}
                color="secondary"
                sx={{ textDecoration: "none" }}
              >
                Forgot Password?
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              disableElevation
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
