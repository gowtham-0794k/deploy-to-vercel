"use client";

import Link from "next/link";
import { Theme } from "@mui/material/styles";
import {
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  Stack,
  Box,
} from "utils/genericExports/theme-imports";
import AuthWrapper1 from "components/authentication/AuthWrapper1";
import AuthCardWrapper from "components/authentication/AuthCardWrapper";
import Logo from "ui-component/Logo";
import AuthLogin from "components/authentication/auth-forms/AuthLogin";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";
import { useTenant } from "../../components/tenantLayout";
import { SliderForAuth } from "components/meraMaster";

const AuthBlueCard = "/assets/images/auth/auth-blue-card.svg";
const AuthPurpleCard = "/assets/images/auth/auth-purple-card.svg";

const Login = () => {
  const { loading, error } = useTenant();
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  // Handle error state
  if (error) {
    return <div>Error loading tenant information</div>; // Or error handling component
  }

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
                        Hi, Welcome Back
                      </Typography>
                      <Typography color="textPrimary" gutterBottom variant="h4">
                        Login in to your account
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
                <AuthLogin />
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
                    href="/register"
                    variant="subtitle1"
                    sx={{ textDecoration: "none" }}
                  >
                    Don&apos;t have an account?
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
                      top: "32%",
                      left: "40%",
                      width: 313,
                      backgroundSize: 380,
                      height: 280,
                      backgroundImage: `url(${AuthPurpleCard})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      animation: "15s wings ease-in-out infinite",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: "23%",
                      left: "37%",
                      width: 243,
                      height: 210,
                      backgroundSize: 380,
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
export default Login;
