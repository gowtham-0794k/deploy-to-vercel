import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  organisationName: yup.string().required("Organisation Name is required !"),
  addressLine1: yup.string().required("Address Line 1 is required !"),
  city: yup.string().required("City is required !"),
  state: yup.string().required("State is required !"),
  typeOfOrganization: yup.string().required("Type of Organization is required !"),
  pincode: yup.string().required("Pincode is required !"),
  brandName: yup.string().required("Brand Name is required !"),
});

export type OrganizationType = {
  organisationName: string;
  brandName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  typeOfOrganization: string;
  pincode: string;
};

interface OrganizationFormProps {
  handleNext: (props: any) => void;
  setErrorIndex: (i: number | null) => void;
  organisationData: OrganizationType;
}

const OrganizationForm = ({
  handleNext,
  setErrorIndex,
  organisationData,
}: OrganizationFormProps) => {
  const formik = useFormik({
    initialValues: {
      organisationName: organisationData.organisationName,
      brandName: organisationData.brandName,
      addressLine1: organisationData.addressLine1,
      addressLine2: organisationData.addressLine2,
      city: organisationData.city,
      state: organisationData.state,
      typeOfOrganization: organisationData.typeOfOrganization,
      pincode: organisationData.pincode,
    },
    validationSchema,
    onSubmit: (values) => {
      handleNext({
        organizationData: {
          organisationName: values.organisationName,
          brandName: values.brandName,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          typeOfOrganization: values.typeOfOrganization,
          pincode: values.pincode,
        },
      });
    },
  });

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Provide Organisation Details
      </Typography>
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="organisationName"
              name="organisationName"
              label="Organisation Name *"
              value={formik.values.organisationName}
              onChange={formik.handleChange}
              error={
                formik.touched.organisationName &&
                Boolean(formik.errors.organisationName)
              }
              helperText={
                formik.touched.organisationName &&
                formik.errors.organisationName
              }
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="brandName"
              name="brandName"
              label="Brand Name *"
              value={formik.values.brandName}
              onChange={formik.handleChange}
              error={
                formik.touched.brandName && Boolean(formik.errors.brandName)
              }
              helperText={formik.touched.brandName && formik.errors.brandName}
              fullWidth
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="addressLine1"
              name="addressLine1"
              label="Address line 1 *"
              value={formik.values.addressLine1}
              onChange={formik.handleChange}
              error={
                formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)
              }
              helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
              fullWidth
              autoComplete="shipping address-line1"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="addressLine2"
              name="addressLine2"
              label="Address line 2"
              value={formik.values.addressLine2}
              onChange={formik.handleChange}
              fullWidth
              autoComplete="shipping address-line2"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="city"
              name="city"
              label="City *"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              fullWidth
              autoComplete="shipping address-level2"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
              label="State/Province/Region *"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="pincode"
              name="pincode"
              label="Zip / Postal code *"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              error={formik.touched.pincode && Boolean(formik.errors.pincode)}
              helperText={formik.touched.pincode && formik.errors.pincode}
              fullWidth
              autoComplete="shipping postal-code"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="typeOfOrganization"
              name="typeOfOrganization"
              label="Type of Organisation *"
              value={formik.values.typeOfOrganization}
              onChange={formik.handleChange}
              error={
                formik.touched.typeOfOrganization &&
                Boolean(formik.errors.typeOfOrganization)
              }
              helperText={
                formik.touched.typeOfOrganization &&
                formik.errors.typeOfOrganization
              }
              fullWidth
              autoComplete="shipping country"
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button
                  variant="contained"
                  sx={{ my: 3, ml: 1 }}
                  type="submit"
                  onClick={() => setErrorIndex(0)}
                >
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
export default OrganizationForm;
