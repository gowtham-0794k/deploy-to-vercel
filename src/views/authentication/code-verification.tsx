"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import {
  Box,
  Button,
  Grid,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
} from "utils/genericExports/theme-imports";
import AuthWrapper1 from "components/authentication/AuthWrapper1";
import AuthCardWrapper from "components/authentication/AuthCardWrapper";
import Logo from "ui-component/Logo";
import AnimateButton from "ui-component/extended/AnimateButton";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";
import { RootState } from "../../store/index";
import { useSelector } from "react-redux";
import AuthEmailVerification from "components/authentication/auth-forms/AuthEmailVerification";
import AuthMobileVerification from "components/authentication/auth-forms/AuthMobileVerification";
import { SliderForAuth } from "components/meraMaster";

// assets
const AuthBlueCard = "/assets/images/auth/auth-signup-blue-card.svg";
const AuthWhiteCard = "/assets/images/auth/auth-signup-white-card.svg";

const CodeVerification = () => {
  const router = useRouter(),
    downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")),
    user = useSelector((state: RootState) => state.auth.user),
    userEmail = user?.email,
    userMobile = user?.mobileNumber,
    otpExpireAt = user?.otpExpiresAt,
    [isEmailVerified, setIsEmailVerified] = useState(false),
    [isMobileVerified, setIsMobileVerified] = useState(false),
    [time, setTime] = useState(10 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // Handle email verification status
  const handleEmailVerification = (status: boolean) => {
    setIsEmailVerified(status);
  };

  // Handle mobile verification status
  const handleMobileVerification = (status: boolean) => {
    setIsMobileVerified(status);
  };

  // Handle proceed button click
  const handleProceed = () => {
    if (isEmailVerified && isMobileVerified) {
      // Navigate to login page
      router.push("/complete-registeration");
    } else {
      // Show error or alert that both verifications are required
      alert(
        "Please complete both email and mobile verification before proceeding"
      );
    }
  };

  const countDown = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
      <Typography variant="h6" color="secondary.main" textAlign="center">
        Otp Expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Typography>
    );
  };

  return (
    <AuthWrapper1>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid
          item
          container
          justifyContent="center"
          md={6}
          lg={7}
          sx={{ my: 3 }}
        >
          <AuthCardWrapper>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Grid
                  container
                  direction={{ xs: "column-reverse", md: "row" }}
                  alignItems={{ xs: "center", md: "inherit" }}
                  justifyContent={{ xs: "center", md: "space-between" }}
                >
                  <Grid item>
                    <Stack
                      justifyContent={{ xs: "center", md: "flex-start" }}
                      textAlign={{ xs: "center", md: "inherit" }}
                    >
                      <Typography
                        color="secondary.main"
                        gutterBottom
                        variant={downMD ? "h3" : "h2"}
                      >
                        Verification Code
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item sx={{ mb: { xs: 3, sm: 0 } }}>
                    <Link href="#" aria-label="theme-logo">
                      <Logo />
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Stack
                  direction="row"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Typography
                    variant="caption"
                    fontSize="16px"
                    textAlign={{ xs: "center", md: "inherit" }}
                  >
                    We&apos;ve send you code on your {userEmail}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <AuthEmailVerification
                  email={user?.email}
                  emailOtp={user?.emailOtp}
                  otpExpireAt={otpExpireAt as Date}
                  onVerificationComplete={handleEmailVerification}
                />
              </Grid>
              <Grid item>
                <Stack
                  direction="row"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Typography
                    variant="caption"
                    fontSize="16px"
                    textAlign={{ xs: "center", md: "inherit" }}
                  >
                    We&apos;ve send you code on your {userMobile}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <AuthMobileVerification
                  mobile={user?.mobileNumber}
                  mobileOtp={user?.mobileOtp}
                  onVerificationComplete={handleMobileVerification}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  item
                  container
                  direction="column"
                  alignItems="flex-end"
                  xs={12}
                >
                  <Typography
                    component={Link}
                    href="#"
                    variant="subtitle1"
                    sx={{ textDecoration: "none" }}
                    textAlign={{ xs: "center", md: "inherit" }}
                  >
                    Did not receive the email? Check your spam folder.
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary.main">
                  {countDown()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    size="large"
                    variant="outlined"
                    color="secondary"
                    onClick={handleProceed}
                  >
                    Proceed
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid
          item
          md={6}
          lg={5}
          sx={{
            position: "relative",
            alignSelf: "stretch",
            display: { xs: "none", md: "block" },
          }}
        >
          <BackgroundPattern1>
            <Grid
              item
              container
              alignItems="flex-end"
              justifyContent="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <span />
                <Box
                  sx={{
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: { xs: "50%", xl: "45%" },
                      left: { xs: "25%", xl: "35%" },
                      width: 260,
                      backgroundSize: 380,
                      height: 290,
                      backgroundImage: `url(${AuthWhiteCard})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      animation: "15s wings ease-in-out infinite",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: { xs: "10%", xl: "12%" },
                      left: { xs: "15%", xl: "25%" },
                      width: 360,
                      height: 350,
                      backgroundSize: 460,
                      backgroundImage: `url(${AuthBlueCard})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      animation: "15s wings ease-in-out infinite",
                      animationDelay: "1s",
                    },
                  }}
                />
              </Grid>

              <SliderForAuth />
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default CodeVerification;
