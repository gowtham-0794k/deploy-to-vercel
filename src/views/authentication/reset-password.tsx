"use client";

import Link from "next/link";
import { Theme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Typography,
  Stack,
  useMediaQuery,
} from "utils/genericExports/theme-imports";
import AuthResetPassword from "../../components/authentication/auth-forms/AuthResetPassword";
import AuthWrapper1 from "components/authentication/AuthWrapper1";
import AuthCardWrapper from "components/authentication/AuthCardWrapper";
import Logo from "ui-component/Logo";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";
import { useTenant } from "components/tenantLayout";
import { SliderForAuth } from "components/meraMaster";

const ResetPassword = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")),
  { tenant } = useTenant(),
  resetPasswordImage = tenant?.Organisation?.branding?.resetPasswordImage;
  const AuthErrorCard = resetPasswordImage || "/assets/images/auth/auth-reset-error-card.svg";
  const AuthPurpleCard = resetPasswordImage || "/assets/images/auth/auth-reset-purple-card.svg";


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
                        Reset Password
                      </Typography>
                      <Typography color="textPrimary" gutterBottom variant="h4">
                        Please choose new password.
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
              <Grid item xs={12}>
                <AuthResetPassword />
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
                      top: { xs: "35%", xl: "35%" },
                      left: { xs: "25%", xl: "35%" },
                      width: 400,
                      height: 400,
                      backgroundImage: `url(${AuthPurpleCard})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      animation: "15s wings ease-in-out infinite",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: { xs: "10%", xl: "12%" },
                      left: { xs: "15%", xl: "25%" },
                      width: 400,
                      height: 270,
                      backgroundImage: `url(${AuthErrorCard})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      animation: "15s wings ease-in-out infinite",
                      animationDelay: "1s",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                  <Grid item xs={10} lg={8} sx={{ "& .slick-list": { pb: 2 } }}>
                    <SliderForAuth />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ResetPassword;
