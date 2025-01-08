import React from "react";
import {
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from "utils/genericExports/theme-imports";
import {
  MainCard,
  UploadAvatar,
} from "utils/genericExports/uiComponentsimports";

type UploadProps = {
  title: string;
  setValue: any;
  values: any;
  touched: any;
  errors: any;
  id: string;
};

export const Upload = ({
  title,
  setValue,
  values,
  touched,
  errors,
  id,
}: UploadProps) => {
  return (
    <MainCard title={title}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack alignItems="center">
            <Stack spacing={1.5} alignItems="center">
              <UploadAvatar
                setFieldValue={setValue}
                file={values[id]}
                error={touched[id] && !!errors[id]}
                id={id}
              />
              <Stack spacing={0}>
                <Typography align="center" variant="caption">
                  Allowed 'image/*'
                </Typography>
                <Typography align="center" variant="caption">
                  *.png, *.jpeg, *.jpg, *.gif
                </Typography>
              </Stack>
            </Stack>
            {touched[id] && errors[id] && (
              <FormHelperText
                error
                id="standard-weight-helper-text-password-login"
              >
                {errors[id] as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};