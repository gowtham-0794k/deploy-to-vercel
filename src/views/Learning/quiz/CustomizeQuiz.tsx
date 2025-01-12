// Type of Questions you Want to Try:import Box from '@mui/material/Box'
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";

// third-party
import { useFormik } from "formik";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

// ==============================|| FORM WIZARD - VALIDATION ||============================== //

export type PaymentData = { cardName?: string; cardNumber?: number };
interface PaymentFormProps {
  paymentData: PaymentData;
  setPaymentData: (d: PaymentData) => void;
  handleNext: () => void;
  handleBack: () => void;
  setErrorIndex: (i: number | null) => void;
}

export default function PaymentForm({
  paymentData,
  setPaymentData,
  handleNext,
  handleBack,
  setErrorIndex,
}: PaymentFormProps) {
  const formik = useFormik({
    initialValues: {
      cardName: paymentData.cardName,
      cardNumber: paymentData.cardNumber,
    },
    onSubmit: (values) => {
      setPaymentData({
        cardName: values.cardName,
        cardNumber: values.cardNumber,
      });
      handleNext();
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <InputLabel>Difficulty Level</InputLabel>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Easy" />
                <FormControlLabel control={<Checkbox />} label="Medium" />
                <FormControlLabel control={<Checkbox />} label="Hard" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <InputLabel>Question Types</InputLabel>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="MCQ" />
                <FormControlLabel control={<Checkbox />} label="True/False" />
                <FormControlLabel control={<Checkbox />} label="MRQ" />
                <FormControlLabel control={<Checkbox />} label="Yes/No" />
                <FormControlLabel control={<Checkbox />} label="Answer With Number" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <InputLabel>Number of Questions</InputLabel>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Select sx={{ minWidth: 200 }}>
                  <MenuItem value="positive">5</MenuItem>
                  <MenuItem value="negative">10</MenuItem>
                  <MenuItem value="neutral">15</MenuItem>
                  <MenuItem value="neutral">20</MenuItem>
                  <MenuItem value="neutral">25</MenuItem>
                </Select>
              </Grid>
            </Grid>
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