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
  Select,
  Stack,
  TextField,
} from "utils/genericExports/theme-imports";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getAxios, postAxios } from "shared";
import {
  ASSIGN_ROLES,
  DEFAULT_ROLES,
  GET_ORGS,
  SEND_SUPER_ADMIN_INVITE,
} from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { USERS } from "shared/constants/messages";

function InviteSuperAdmins() {
  const validationSchema = Yup.object({
      organizationName: Yup.string().required("Organisation is required !"),
      firstName: Yup.string().required("First Name is required !"),
      lastName: Yup.string().required("Last Name is required !"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required !"),
      phoneNumber: Yup.string().required("Phone Number is required !"),
      roles: Yup.string().required("role is required !"),
    }),
    { data: session } = useSession<any>(),
    [organizations, setOrganizations] = useState<any[]>([]),
    [defaultRoles, setDefaultRoles] = useState<any[]>([]),
    dispatch = useDispatch(),
    getOrganizations = async () => {
      try {
        const organizationResponse = await getAxios({ url: GET_ORGS });
        setOrganizations(organizationResponse?.data?.entities || []);
      } catch (error) {
        dispatch(
          openSnackbarFunction("Failed to fetch organizations", "error")
        );
      }
    },
    user: any = session?.user,
    orgId = user?._doc?.orgId,
    role = user?._doc?.roleName,
    formik = useFormik({
      initialValues: {
        organizationName: orgId,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        roles: "",
      },
      validationSchema,
      onSubmit: async (values) => {
        const formData = {
          OrgName: values.organizationName,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          mobileNumber: values.phoneNumber,
          orgId: values.organizationName,
          roleName: defaultRoles.find(
            (roleItem: any) => roleItem._id === values.roles
          ).roleName,
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
              createdBy: values?.organizationName,
              org_id: values?.organizationName,
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
    }),
    getRoles = async () => {
      try {
        const rolesResponse = await getAxios({ url: DEFAULT_ROLES }),
          data: any = rolesResponse?.data || [],
          targetRole = data.find(
            (roleItem: any) => roleItem.roleName === role
          ).level,
          formatData = data
            .filter((role: any) => role.level > targetRole)
            .sort((a: any, b: any) => a.level - b.level)
            .map((role: any) => ({
              _id: role._id || "",
              roleName: role.roleName,
            }));
        setDefaultRoles(formatData);
      } catch (error) {
        dispatch(
          openSnackbarFunction("Failed to fetch default roles", "error")
        );
      }
    };

  useEffect(() => {
    getOrganizations();
    getRoles();
  }, []);

  return (
    <Grid container spacing={gridSpacing} justifyContent="center">
      <Grid item xs={12} lg={6}>
        <form onSubmit={formik.handleSubmit}>
          <MainCard content={false} sx={{ overflow: "visible" }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} lg={12}>
                  <InputLabel>
                    Select Organisation
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </InputLabel>
                  <TextField
                    select
                    fullWidth
                    name="organizationName"
                    value={formik.values.organizationName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    // error={
                    //   formik.touched.organizationName &&
                    //   Boolean(formik.errors.organizationName)
                    // }
                    // helperText={
                    //   formik.touched.organizationName &&
                    //   formik.errors.organizationName
                    // }
                    disabled={!USERS.find((user) => user === role)}
                  >
                    {organizations.map((org) => (
                      <MenuItem key={org._id} value={org._id}>
                        {org.organizationName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <InputLabel>
                    First Name
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </InputLabel>
                  <TextField
                    fullWidth
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <InputLabel>
                    Last Name
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </InputLabel>
                  <TextField
                    fullWidth
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <InputLabel>
                    Email
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </InputLabel>
                  <TextField
                    fullWidth
                    name="email"
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <InputLabel>
                    Phone Number
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </InputLabel>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.phoneNumber &&
                      Boolean(formik.errors.phoneNumber)
                    }
                    helperText={
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <InputLabel>
                    Roles
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    name="roles"
                    value={formik.values.roles}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.roles && Boolean(formik.errors.roles)}
                    displayEmpty
                  >
                    {defaultRoles.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.roles && formik.errors.roles && (
                    <FormHelperText error>{formik.errors.roles}</FormHelperText>
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button type="submit" variant="contained" color="secondary">
                      Invite
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardActions>
          </MainCard>
        </form>
      </Grid>
    </Grid>
  );
}

export default InviteSuperAdmins;
