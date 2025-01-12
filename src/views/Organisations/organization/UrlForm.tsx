import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  adminUrl: yup.string().required("adminUrl is required"),
  domainUrl: yup.string().required("domainUrl is required"),
  userUrl: yup.string().required("appUrl is required"),
});


export type UrlData = {
  adminUrl?: string;
  userUrl?: string;
  websiteUrl?: string;
  domainUrl?: string;
};
interface UrlFormProps {
  handleNext: (props: any) => void;
  handleBack: () => void;
  setErrorIndex: (i: number | null) => void;
  urlData: UrlData;
}

export default function UrlForm({
  handleNext,
  handleBack,
  setErrorIndex,
  urlData,
}: UrlFormProps) {
  const formik = useFormik({
    initialValues: {
      adminUrl: urlData.adminUrl,
      userUrl: urlData.userUrl,
      websiteUrl: urlData.websiteUrl,
      domainUrl: urlData.domainUrl,
    },
    validationSchema,
    onSubmit: (values) => {
      handleNext({
        urlData: {
          adminUrl: values.adminUrl,
          userUrl: values.userUrl,
          websiteUrl: values.websiteUrl,
          domainUrl: values.domainUrl,
        },
      });
    },
  });

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Url's
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <TextField
              id="domainUrl"
              name="domainUrl"
              value={formik.values.domainUrl}
              onChange={formik.handleChange}
              error={formik.touched.domainUrl && Boolean(formik.errors.domainUrl)}
              helperText={formik.touched.domainUrl && formik.errors.domainUrl}
              label="Domain URL *"
              fullWidth
              autoComplete="cc-name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="adminUrl"
              name="adminUrl"
              value={formik.values.adminUrl}
              onChange={formik.handleChange}
              error={formik.touched.adminUrl && Boolean(formik.errors.adminUrl)}
              helperText={formik.touched.adminUrl && formik.errors.adminUrl}
              label="Admin URL *"
              fullWidth
              autoComplete="cc-name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="userUrl"
              name="userUrl"
              label="App URL *"
              value={formik.values.userUrl}
              onChange={formik.handleChange}
              error={formik.touched.userUrl && Boolean(formik.errors.userUrl)}
              helperText={formik.touched.userUrl && formik.errors.userUrl}
              fullWidth
              autoComplete="cc-number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="websiteUrl"
              name="websiteUrl"
              label="Website URL"
              fullWidth
              value={formik.values.websiteUrl}
              onChange={formik.handleChange}
              autoComplete="cc-exp"
            />
          </Grid>

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
                  onClick={() => setErrorIndex(1)}
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
}
