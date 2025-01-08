import {
  Grid,
  Button,
  Stack,
  TextField,
  CircularProgress,
} from "utils/genericExports/theme-imports";
import { gridSpacing, SubCard } from "utils/genericExports/uiComponentsimports";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { BASE_URL, LOGIN } from "shared/constants/routerUrls";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  reEnterNewPassword: "",
};

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current password is required")
    .notOneOf(
      [Yup.ref("newPassword")],
      "Current password and new password must not be the same"
    ),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  reEnterNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Re-entering the new password is required"),
});

const Security = () => {
  const [loading, setLoading] = useState(false),
    dispatch = useDispatch(),
    { data: session } = useSession();

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/changePassword/${session?.user?.id}`,
        payload
      );
      console.log({ response });

      if (response.statusText === "OK") {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Password changed successfully",
            "success"
          )
        );
        await signOut({ callbackUrl: LOGIN });
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        dispatch(openSnackbarFunction(error.response.data.message, "error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ touched, errors }) => (
        <Form>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={6}>
              <SubCard title="Change Password">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      fullWidth
                      label="Current Password"
                      error={
                        touched.currentPassword &&
                        Boolean(errors.currentPassword)
                      }
                      helperText={<ErrorMessage name="currentPassword" />}
                      inputProps={{
                        "aria-required": true,
                        "aria-invalid": !!errors.currentPassword,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      fullWidth
                      label="New Password"
                      error={touched.newPassword && Boolean(errors.newPassword)}
                      helperText={<ErrorMessage name="newPassword" />}
                      inputProps={{
                        "aria-required": true,
                        "aria-invalid": !!errors.newPassword,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      type="password"
                      id="reEnterNewPassword"
                      name="reEnterNewPassword"
                      fullWidth
                      label="Re-enter New Password"
                      error={
                        touched.reEnterNewPassword &&
                        Boolean(errors.reEnterNewPassword)
                      }
                      helperText={<ErrorMessage name="reEnterNewPassword" />}
                      inputProps={{
                        "aria-required": true,
                        "aria-invalid": !!errors.reEnterNewPassword,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={
                          loading && (
                            <CircularProgress size={20} color="inherit" />
                          )
                        }
                      >
                        {loading ? "Processing..." : "Change Password"}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default Security;