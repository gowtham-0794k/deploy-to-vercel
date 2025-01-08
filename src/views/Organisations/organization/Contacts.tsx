import * as React from "react";
import { Grid, Typography, TextField, Stack, Button, Divider } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";

const validationSchema = yup.object({
  contactPerson1: yup.object().shape({
    firstName: yup.string().required("First Name is required !"),
    lastName: yup.string().required("Last Name is required !"),
    contactNumber1: yup.string().required("Contact Number 1 is required !"),
    emailId: yup
      .string()
      .email("Invalid email")
      .required("Email Id is required !"),
    designation: yup.string().required("Designation is required !"),
  }),
});

interface ContactPerson {
  firstName: string;
  lastName: string;
  contactNumber1: string;
  contactNumber2: string;
  emailId: string;
  designation: string;
}

export type ContactDataType = {
  contactPerson1: ContactPerson;
  contactPerson2: ContactPerson;
};

interface ContactFormProps {
  handleNext: (props: any) => void;
  handleBack: () => void;
  setErrorIndex: (i: number | null) => void;
  contactData: ContactDataType;
}

const Contacts = ({
  handleNext,
  setErrorIndex,
  handleBack,
  contactData,
}: ContactFormProps): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      contactPerson1: contactData.contactPerson1 || {
        firstName: "",
        lastName: "",
        contactNumber1: "",
        contactNumber2: "",
        emailId: "",
        designation: "",
      },
      contactPerson2: contactData.contactPerson2 || {
        firstName: "",
        lastName: "",
        contactNumber1: "",
        contactNumber2: "",
        emailId: "",
        designation: "",
      },
    },
    validationSchema,
    onSubmit: (values) => {
      handleNext({
        contactData: {
          contactPerson1: {
            firstName: values.contactPerson1.firstName,
            lastName: values.contactPerson1.lastName,
            contactNumber1: values.contactPerson1.contactNumber1,
            contactNumber2: values.contactPerson1.contactNumber2,
            emailId: values.contactPerson1.emailId,
            designation: values.contactPerson1.designation,
          },
          contactPerson2: {
            firstName: values.contactPerson2.firstName,
            lastName: values.contactPerson2.lastName,
            contactNumber1: values.contactPerson2.contactNumber1,
            contactNumber2: values.contactPerson2.contactNumber2,
            emailId: values.contactPerson2.emailId,
            designation: values.contactPerson2.designation,
          },
        },
      });
    },
  });

  const renderContactPersonFields = (
    personKey: "contactPerson1" | "contactPerson2"
  ) => (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {personKey === "contactPerson1"
          ? "Contact Person 1"
          : "Contact Person 2"}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${personKey}.firstName`}
            name={`${personKey}.firstName`}
            label="First Name"
            value={formik.values[personKey].firstName}
            onChange={formik.handleChange}
            error={
              formik.touched[personKey]?.firstName &&
              Boolean(formik.errors[personKey]?.firstName)
            }
            helperText={
              formik.touched[personKey]?.firstName &&
              formik.errors[personKey]?.firstName
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${personKey}.lastName`}
            name={`${personKey}.lastName`}
            label="Last Name"
            value={formik.values[personKey].lastName}
            onChange={formik.handleChange}
            error={
              formik.touched[personKey]?.lastName &&
              Boolean(formik.errors[personKey]?.lastName)
            }
            helperText={
              formik.touched[personKey]?.lastName &&
              formik.errors[personKey]?.lastName
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id={`${personKey}.contactNumber1`}
            name={`${personKey}.contactNumber1`}
            label="Contact Number 1"
            value={formik.values[personKey].contactNumber1}
            onChange={formik.handleChange}
            error={
              formik.touched[personKey]?.contactNumber1 &&
              Boolean(formik.errors[personKey]?.contactNumber1)
            }
            helperText={
              formik.touched[personKey]?.contactNumber1 &&
              formik.errors[personKey]?.contactNumber1
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id={`${personKey}.contactNumber2`}
            name={`${personKey}.contactNumber2`}
            label="Contact Number 2"
            value={formik.values[personKey].contactNumber2}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${personKey}.emailId`}
            name={`${personKey}.emailId`}
            label="Email Id"
            value={formik.values[personKey].emailId}
            onChange={formik.handleChange}
            error={
              formik.touched[personKey]?.emailId &&
              Boolean(formik.errors[personKey]?.emailId)
            }
            helperText={
              formik.touched[personKey]?.emailId &&
              formik.errors[personKey]?.emailId
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${personKey}.designation`}
            name={`${personKey}.designation`}
            label="Designation"
            value={formik.values[personKey].designation}
            onChange={formik.handleChange}
            error={
              formik.touched[personKey]?.designation &&
              Boolean(formik.errors[personKey]?.designation)
            }
            helperText={
              formik.touched[personKey]?.designation &&
              formik.errors[personKey]?.designation
            }
          />
        </Grid>
      </Grid>
    </>
  );

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Provide Contact Details
      </Typography>
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        {renderContactPersonFields("contactPerson1")}
        <Divider sx={{ my: 2 }}></Divider>
        {renderContactPersonFields("contactPerson2")}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
              Back
            </Button>
            <AnimateButton>
              <Button
                variant="contained"
                type="submit"
                sx={{ my: 3, ml: 1 }}
                onClick={() => setErrorIndex(2)}
              >
                next
              </Button>
            </AnimateButton>
          </Stack>
        </Grid>
      </form>
    </>
  );
};

export default Contacts;
