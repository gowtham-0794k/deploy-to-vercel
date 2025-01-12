"use client";

import * as React from "react";

// material-ui
import Grid from "@mui/material/Grid";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

// ==============================|| FORM WIZARD - VALIDATION ||============================== //

export default function Review() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={3} ml={2}>
            <span>Do You Want to Set Times:</span>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              margin="auto"
              spacing={2}
            >
              <FormControlLabel control={<Switch />} label="No/Yes"/>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={3} ml={2}>
            <span>When do you want to see Results:</span>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              margin="auto"
              spacing={2}
            >
              <Stack direction="column" spacing={1}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Immediately After Every Question"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="After completion of the Entire Quiz"
                />
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
