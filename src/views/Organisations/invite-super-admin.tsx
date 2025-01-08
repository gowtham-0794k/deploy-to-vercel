"use client";
import MainCard from "ui-component/cards/MainCard";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { gridSpacing } from "store/constant";
import {
  Button,
  CardActions,
  CardContent,
  FormHelperText,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "utils/genericExports/theme-imports";
import { InputWithLabel } from "components/meraMaster";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch } from "store";
import {
  GET_ORGS,
  ASSIGN_ROLES,
  SEND_SUPER_ADMIN_INVITE,
} from "shared/constants/routerUrls";
import { getAxios, postAxios } from "shared";
import { openSnackbarFunction } from "utils/utils";

function InviteSuperAdmins() {
  const [organizations, setOrganizations] = useState<any[]>([]),
    dispatch = useDispatch(),
    initialValues = {
      organizationName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    getOrganizations = async () => {
      const organizationResponse = await getAxios({ url: GET_ORGS });
      setOrganizations(organizationResponse?.data?.entities);
    },
    handleSubmit = async (
      values: any,
      { setValues, setTouched }: FormikHelpers<typeof initialValues>
    ) => {
      const formData = {
        OrgName: values.organizationName,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        mobileNumber: values.phoneNumber,
        orgId: values.organizationId,
      };
      try {
        const inviteResponse = await postAxios({
          url: SEND_SUPER_ADMIN_INVITE,
          values: formData,
        });
        if (inviteResponse.status === 200) {
          const { data: userData } = inviteResponse;
          const inviteSuperAdminPayload = {
            userID: userData?.data?._id,
            roleName: userData?.data?.roleName,
            createdBy: values?.organizationId,
            org_id: values?.organizationId,
          };
          await postAxios({
            url: ASSIGN_ROLES,
            values: inviteSuperAdminPayload,
          });
          dispatch(
            openSnackbarFunction(
              inviteResponse.data.message || "Invitaion sent successfully.",
              "success"
            )
          );
          setValues(initialValues);
          setTouched({});
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
    };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <Grid container spacing={gridSpacing} justifyContent="center">
      <Grid item xs={12} lg={6}>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            organizationName: Yup.string().required(
              "Organisation is required !"
            ),
            firstName: Yup.string().required("First Name is required !"),
            lastName: Yup.string().required("Last Name is required !"),
            email: Yup.string().required("Email  is required !"),
            phoneNumber: Yup.string().required("Phone Number is required !"),
          })}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleSubmit,
            handleBlur,
            handleChange,
            setFieldValue,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit}>
              <MainCard content={false} sx={{ overflow: "visible" }}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} lg={12}>
                      <InputLabel>
                        Select Organisation{" "}
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      </InputLabel>
                      <TextField
                        select
                        fullWidth
                        label="Select Organisation"
                        placeholder="Select Organisation"
                        margin="normal"
                        name="organizationName"
                        value={values.organizationName}
                        onBlur={handleBlur}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const selectedOrg = organizations.find(
                            (org) => org.organizationName === event.target.value
                          );
                          if (selectedOrg) {
                            setFieldValue(
                              "organizationName",
                              selectedOrg.organizationName
                            );
                            setFieldValue("organizationId", selectedOrg._id);
                          }
                        }}
                        error={
                          touched.organizationName &&
                          Boolean(errors.organizationName)
                        }
                      >
                        {organizations.length > 0 ? (
                          organizations.map((org) => (
                            <MenuItem
                              key={org._id}
                              value={org.organizationName}
                            >
                              {org.organizationName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">
                            No organizations available
                          </MenuItem>
                        )}
                      </TextField>
                      {touched.organizationName &&
                        Boolean(errors.organizationName) && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text--register"
                          >
                            Organization name is required !
                          </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <InputWithLabel
                        label="First Name"
                        id="firstName"
                        placeholder="Enter First Name"
                        values={values}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <InputWithLabel
                        label="Last Name"
                        id="lastName"
                        placeholder="Enter Last Name"
                        values={values}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <InputWithLabel
                        label="Email"
                        id="email"
                        placeholder="Enter email"
                        values={values}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <InputWithLabel
                        label="Phone Number"
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        values={values}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          Invite
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardActions>
              </MainCard>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default InviteSuperAdmins;
