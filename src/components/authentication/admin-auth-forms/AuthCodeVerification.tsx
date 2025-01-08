'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OtpInput from 'react18-input-otp';
import { ThemeMode } from 'types/config';

const AuthCodeVerification = () => {
  const theme = useTheme();
  const [otp, setOtp] = useState<string>();
  const [isWrongOtp, setIsWrongOtp] = useState(false);
  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

  const handleOtpChange = (otpNumber: string) => {
    setOtp(otpNumber);
    setIsWrongOtp(false);
  };

  const handleResendClick = () => {
    setIsWrongOtp(true);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={4}
            containerStyle={{ 
              justifyContent: 'space-between'
            }}
            inputStyle={{
              width: '100%',
              margin: '4px',
              padding: '10px',
              border: `1px solid ${isWrongOtp ? theme.palette.error.main : borderColor}`,
              borderRadius: 4,
              animation: isWrongOtp ? 'shake 0.5s ease-in-out' : 'none',
              '@keyframes shake': {
                '0%, 100%': {
                  transform: 'translateX(0)'
                },
                '10%, 30%, 50%, 70%, 90%': {
                  transform: 'translateX(-5px)'
                },
                '20%, 40%, 60%, 80%': {
                  transform: 'translateX(5px)'
                }
              },
              ':hover': {
                borderColor: theme.palette.primary.main
              }
            }}
            focusStyle={{
              outline: 'none',
              border: `2px solid ${theme.palette.primary.main}`
            }}
          />
          {otp?.length === 4 ? (
            <Typography
              component="span"
              sx={{
                color: 'success.main',
                fontSize: '1.2rem',
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)'
                  }
                }
              }}>
              ✓
            </Typography>
          ) : (
            <Button variant="text" onClick={handleResendClick} sx={{ color: 'secondary.main' }}>
              Resend Code
            </Button>
          )}
        </Stack>
      </Grid>      
      <Grid item xs={12}>
        <Button disableElevation fullWidth size="large" type="submit" variant="contained">
          Continue
        </Button> 
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
           
        </Stack>
      </Grid>
    </Grid>
  );
};export default AuthCodeVerification;
