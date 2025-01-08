// @ts-nocheck
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';




import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// third party

import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// types
import { StringColorProps } from 'types';



// ===========================|| JWT - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);

  const [strength, setStrength] = React.useState(0);
  const [level, setLevel] = React.useState<StringColorProps>();

  const { register } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: '',
          password: '',
          isdCode: '+91',
          phoneNumber: '',
          submit: null
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await register(values.isdCode, values.phoneNumber, values.email, values.password);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Your registration has been successfully completed.',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );

              setTimeout(() => {
                router.push('/login');
              }, 1500);
            }
          } catch (err: any) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={{ xs: 0, sm: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ ...theme.typography.customInput }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ ...theme.typography.customInput }}
                />
              </Grid>            
              </Grid> 
            {/* <Grid container spacing={{ xs: 0, sm: 2 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Courses"
                  margin="normal"
                  name="courses"
                  type="text"
                  value={values.courses}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ 
                    ...theme.typography.customInput, 
                    '& .MuiInputBase-root': { height: '64px' },
                    '& .MuiSelect-select': { 
                      paddingTop: '30px',
                      paddingBottom: '12px'
                    }
                  }}
                >
                  <MenuItem value="CS101">Introduction to Computer Science</MenuItem>
                  <MenuItem value="CS201">Data Structures</MenuItem>
                  <MenuItem value="CS301">Algorithms</MenuItem>
                  <MenuItem value="CS401">Database Management</MenuItem>
                  <MenuItem value="CS501">Web Development</MenuItem>
                  <MenuItem value="CS601">Machine Learning</MenuItem>
                </TextField>
              </Grid>
            </Grid>  */}

            {/* Replace your existing TextField state selector with this: */}
<TextField
  select
  fullWidth
  label="States"
  margin="normal"
  name="states" // Changed from password to states for clarity
  value={values.states}
  onBlur={handleBlur}
  onChange={handleChange}
  sx={{ 
    ...theme.typography.customInput, 
    '& .MuiInputBase-root': { height: '64px' },
    '& .MuiSelect-select': { 
      paddingTop: '30px',
      paddingBottom: '12px'
    }
  }}
>
  <MenuItem value="AL">Alabama</MenuItem>
  <MenuItem value="AK">Alaska</MenuItem>
  <MenuItem value="AZ">Arizona</MenuItem>
  <MenuItem value="MD">Maryland</MenuItem>
  <MenuItem value="MA">Massachusetts</MenuItem>
  <MenuItem value="MI">Michigan</MenuItem>
  <MenuItem value="MN">Minnesota</MenuItem>
  <MenuItem value="others">Others</MenuItem>
</TextField>

{values.states === 'others' && (
  <TextField
    fullWidth
    label="Other State"
    margin="normal"
    name="otherState"
    value={values.otherState}
    onBlur={handleBlur}
    onChange={(e) => {
      handleChange(e);
      // Update both otherState and states fields
      setFieldValue('otherState', e.target.value);
      setFieldValue('states', e.target.value);
    }}
    sx={{ ...theme.typography.customInput }}
  />
)}       {/* {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )} */}

            {/* <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                  }
                  label={
                    <Typography variant="subtitle1">
                      Agree with  
                      <Typography variant="subtitle1" component={Link} href="/">
                        Terms & Condition.
                      </Typography>
                    </Typography>
                  }
                />
              </Grid>
            </Grid> */}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                   Complete Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTRegister;