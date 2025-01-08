"use client";

import { useState, useEffect } from "react";
import {
  useTheme,
  Button,
  Grid,
  Typography,
  Stack,
} from "utils/genericExports/theme-imports";
import OtpInput from "react18-input-otp";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import {
  resendOTP,
  ResendOTPPayload,
  deleteIncompleteUser,
} from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";
import { REGISTER } from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import {
  EMAIL_REQUIRED,
  FAILED_TO_RESEND_OTP,
  OTP_EXPIRED,
  OTP_RESENT_SUCCESSFULLY,
} from "shared/errorMessages";

interface AuthEmailVerificationProps {
  email?: string;
  emailOtp?: string;
  otpExpireAt?: Date;
  onVerificationComplete?: (status: boolean) => void;
}

const AuthEmailVerification = ({
  email,
  emailOtp,
  otpExpireAt,
  onVerificationComplete,
}: AuthEmailVerificationProps) => {
  const theme = useTheme(),
    [enteredOtp, setEnteredOtp] = useState<string>(""),
    [isWrongOtp, setIsWrongOtp] = useState(false),
    [isVerified, setIsVerified] = useState(false),
    [resendCount, setResendCount] = useState(0),
    dispatch = useDispatch<AppDispatch>(),
    router = useRouter();

  const borderColor =
    theme.palette.mode === "dark"
      ? theme.palette.grey[200]
      : theme.palette.grey[300];

  useEffect(() => {
    // Reset verification status when OTP changes
    if (emailOtp) {
      setIsVerified(false);
      setEnteredOtp("");
      setIsWrongOtp(false);
    }
  }, [emailOtp]);
  // Call this when OTP verification is successful
  const handleVerificationSuccess = () => {
    onVerificationComplete?.(true);
  };

  // Call this when OTP verification fails
  const handleVerificationFailure = () => {
    onVerificationComplete?.(false);
  };
  // Check if OTP is expired
  const isOTPExpired = () => {
    if (!otpExpireAt) return true;

    const currentTime = new Date();
    return currentTime > otpExpireAt;
  };
  const handleOtpChange = (otpNumber: string) => {
    setEnteredOtp(otpNumber);
    setIsWrongOtp(false);
    if (isOTPExpired()) {
      setIsWrongOtp(true);
      dispatch(openSnackbarFunction(OTP_EXPIRED, "error"));
      return;
    }

    if (otpNumber.length === 4) {
      const entered = otpNumber.toString().trim();
      const stored = emailOtp?.toString().trim();

      if (entered === stored) {
        setIsVerified(true);
        setIsWrongOtp(false);
        handleVerificationSuccess?.();
      } else {
        setIsWrongOtp(true);
        setIsVerified(false);
        handleVerificationFailure?.();
      }
    }
  };

  const handleResend = async () => {
    setResendCount((prevCount) => prevCount + 1);
    if (resendCount >= 4) {
      if (email) {
        await dispatch(deleteIncompleteUser(email));
      }
      router.push(REGISTER);
      return;
    }

    setIsWrongOtp(false);
    setEnteredOtp("");
    setIsVerified(false);
    if (!email) {
      console.error(EMAIL_REQUIRED);
      return;
    }

    const otpData: ResendOTPPayload = {
      email,
      type: "email",
    };

    try {
      await dispatch(resendOTP(otpData));
      dispatch(openSnackbarFunction(OTP_RESENT_SUCCESSFULLY, "success"));
    } catch (error: any) {
      dispatch(openSnackbarFunction(FAILED_TO_RESEND_OTP, "error"));
    }
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Verify Email OTP
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <OtpInput
          value={enteredOtp}
          onChange={handleOtpChange}
          numInputs={4}
          containerStyle={{
            justifyContent: "space-between",
          }}
          inputStyle={{
            width: "100%",
            margin: "4px",
            padding: "10px",
            border: `1px solid ${isWrongOtp ? theme.palette.error.main : borderColor}`,
            borderRadius: 4,
            animation: isWrongOtp ? "shake 0.5s ease-in-out" : "none",
            "@keyframes shake": {
              "0%, 100%": { transform: "translateX(0)" },
              "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
              "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
            },
          }}
          focusStyle={{
            outline: "none",
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        />
        {enteredOtp.length === 4 ? (
          <Typography
            component="span"
            sx={{
              color: isVerified ? "success.main" : "error.main",
              fontSize: "1.2rem",
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "scale(0)" },
                to: { opacity: 1, transform: "scale(1)" },
              },
            }}
          >
            {isVerified ? (
              "✓"
            ) : (
              <Button
                variant="text"
                onClick={handleResend}
                sx={{ color: "secondary.main" }}
              >
                Resend Code
              </Button>
            )}
          </Typography>
        ) : (
          <Button
            variant="text"
            onClick={handleResend}
            sx={{ color: "secondary.main" }}
          >
            Resend Code
          </Button>
        )}
      </Stack>
      {isWrongOtp && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: "block" }}
        >
          Invalid email OTP. Please try again.
        </Typography>
      )}
      {resendCount == 4 && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: "block" }}
        >
          Resend limit exceeded. You have only 1 try left.
        </Typography>
      )}
      {resendCount >= 5 && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: "block" }}
        >
          Resend limit exceeded. Please start the registration process again.
        </Typography>
      )}
    </Grid>
  );
};

export default AuthEmailVerification;
