"use client";

import React from "react";

// material-ui
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project imports
import AddressForm, { ShippingData } from "./Chapter-selection";
import PaymentForm, { PaymentData } from "./CustomizeQuiz";
import Review from "./Settings";
import MainCard from "ui-component/cards/MainCard";
import AnimateButton from "ui-component/extended/AnimateButton";
import Grow from "@mui/material/Grow/Grow";
import Fade from "@mui/material/Fade";
import { useRouter } from "next/navigation";

// step options
const steps = ["Select Chapter", "Customize Quiz", "Settings"];

const getStepContent = (
  step: number,
  handleNext: () => void,
  handleBack: () => void,
  setErrorIndex: (i: number | null) => void,
  shippingData: ShippingData,
  setShippingData: (d: ShippingData) => void,
  paymentData: PaymentData,
  setPaymentData: (d: PaymentData) => void
) => {
  switch (step) {
    case 0:
      return (
        <AddressForm
          handleNext={handleNext}
          setErrorIndex={setErrorIndex}
          shippingData={{
            ...shippingData,
            paperName: shippingData.paperName || "",
            selectedChapters: shippingData.selectedChapters || [],
          }}
          setShippingData={setShippingData}
        />
      );
    case 1:
      return (
        <PaymentForm
          handleNext={handleNext}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
          paymentData={paymentData}
          setPaymentData={setPaymentData}
        />
      );
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
};

// ==============================|| FORMS WIZARD - BASIC ||============================== //

const QuizCreation = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [shippingData, setShippingData] = React.useState<ShippingData>({
    paperName: "",
    selectedChapters: [],
  });
  const [paymentData, setPaymentData] = React.useState<PaymentData>({});
  const [errorIndex, setErrorIndex] = React.useState<number | null>(null);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const router = useRouter();
  const StartQuiz = () => {
    router.push("/QuizPage/quizPage");
  };
  return (
    <MainCard
      title={
        <Grow in timeout={1000}>
          <Typography variant="h3" component="div">
            Quiz Creation
          </Typography>
        </Grow>
      }
      sx={{ maxWidth: "800px", margin: "auto" }}
    >
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label, index) => {
          const labelProps: { error?: boolean; optional?: React.ReactNode } =
            {};

          if (index === errorIndex) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Error
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <>
        {activeStep === steps.length ? (
          <>
            <Fade in timeout={1000}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  textAlign: "center",
                  animation: "fadeIn 1s ease-in-out",
                  color: "secondary.main",
                }}
              >
                Lets Start The Quiz !
              </Typography>
            </Fade>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setShippingData({});
                    setPaymentData({});
                    setActiveStep(0);
                  }}
                  sx={{ my: 3, ml: 1 }}
                >
                  Change/Update
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={StartQuiz}
                  sx={{ my: 3, ml: 1 }}
                >
                  Start Quiz
                </Button>
              </AnimateButton>
            </Stack>
          </>
        ) : (
          <>
            {getStepContent(
              activeStep,
              handleNext,
              handleBack,
              setErrorIndex,
              shippingData,
              setShippingData,
              paymentData,
              setPaymentData
            )}
            {activeStep === steps.length - 1 && (
              <Stack
                direction="row"
                justifyContent={activeStep !== 0 ? "space-between" : "flex-end"}
              >
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <AnimateButton>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ my: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? "Continue" : "Next"}
                  </Button>
                </AnimateButton>
              </Stack>
            )}
          </>
        )}
      </>
    </MainCard>
  );
};
export default QuizCreation;
