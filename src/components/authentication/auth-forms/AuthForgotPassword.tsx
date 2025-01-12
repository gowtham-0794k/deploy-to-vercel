"use client";

import * as Yup from "yup";
import { Formik } from "formik";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import { dispatch } from "store";
import { forgotPassword } from "store/slices/authSlice";
import {
  useTheme,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "utils/genericExports/theme-imports";
import { openSnackbarFunction } from "utils/utils";
import {
  AN_ERROR_OCCURRED,
  CHECK_MAIL_FOR_RESET_PASSWORD_LINK,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  USER_NOT_FOUND,
} from "shared/errorMessages";
const AuthForgotPassword = ({
  loginProp,
  ...others
}: {
  loginProp?: number;
}) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const onSubmitClick = async (values: any, responseObject: any) => {
    const { setErrors, setStatus, setSubmitting } = responseObject;
    try {
      const response = await dispatch(forgotPassword(values.email));

      if (forgotPassword.fulfilled.match(response)) {
        setStatus({ success: true });
        setSubmitting(false);
        dispatch(openSnackbarFunction(CHECK_MAIL_FOR_RESET_PASSWORD_LINK, "success"));
      } else if (forgotPassword.rejected.match(response)) {
        throw new Error(USER_NOT_FOUND);
      }
    } catch (err: any) {
      if (scriptedRef.current) {
        setStatus({ success: false });
        setErrors({ submit: AN_ERROR_OCCURRED });
        setSubmitting(false);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email(INVALID_EMAIL)
          .max(255)
          .required(EMAIL_REQUIRED),
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
            <InputLabel htmlFor="outlined-adornment-email-forgot">
              Email Address / Username
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email Address"
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText
                error
                id="standard-weight-helper-text-email-forgot"
              >
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

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
                Send Mail
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForgotPassword;
