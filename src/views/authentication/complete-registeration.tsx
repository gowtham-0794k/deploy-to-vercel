"use client";

import Link from "next/link";
import { Theme } from "@mui/material/styles";
import AuthCompleteRegisteration from "components/authentication/auth-forms/AuthCompleteRegisteration";
import AuthWrapper1 from "components/authentication/AuthWrapper1";
import AuthCardWrapper from "components/authentication/AuthCardWrapper";
import Logo from "ui-component/Logo";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
} from "utils/genericExports/theme-imports";
import { SliderForAuth } from "components/meraMaster";

const AuthBlueCard = "/assets/images/auth/auth-signup-blue-card.svg";
const AuthWhiteCard = "/assets/images/auth/auth-signup-white-card.svg";
// ===============================|| AUTH1 - REGISTER ||=============================== //
const CompleteRegister = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

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
                      pt={{ sm: 1 }}
                    >
                      <Typography
                        color="secondary.main"
                        gutterBottom
                        variant={downMD ? "h3" : "h2"}
                      >
                        Sign up
                      </Typography>
                      <Typography color="textPrimary" gutterBottom variant="h4">
                        Enter credentials to continue
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
                <AuthCompleteRegisteration />
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
                    href="/login"
                    variant="subtitle1"
                    sx={{ textDecoration: "none" }}
                  >
                    Already have an account?
                  </Typography>
                </Grid>
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
export default CompleteRegister;
