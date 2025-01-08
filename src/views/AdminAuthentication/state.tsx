"use client";

import Link from "next/link";

// material-ui
import { Theme } from "@mui/material/styles";
// import Box from '@mui/material/Box';
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

// project imports
import AuthRegister from "components/authentication/admin-auth-forms/AuthState";
import AuthWrapper1 from "components/authentication/AuthWrapper1";
import AuthCardWrapper from "components/authentication/AuthCardWrapper";
import Logo from "ui-component/Logo";

// ===============================|| AUTH1 - REGISTER ||=============================== //

const Register = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <AuthWrapper1>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid
          item
          container
          justifyContent="center"
          xs={12}
          sm={8}
          md={6}
          lg={4}
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
                <AuthRegister />
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
                    href="/pages/authentication/auth1/login"
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
      </Grid>
    </AuthWrapper1>
  );
};

export default Register;
