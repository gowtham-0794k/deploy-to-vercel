'use client';

import * as React from 'react';
import { useState } from 'react';

// Material UI imports
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

// Project-specific imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const DeletePackagesPage = () => {
  const [department, setDepartment] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [division, setDivision] = useState('');
  const [course, setCourse] = useState('');
  const [group, setGroup] = useState('');
  const [packageValue, setPackage] = useState('');
  const [salesPackName, setSalesPackName] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <MainCard
            secondary={<SecondaryAction link="https://next.material-ui.com/components/text-fields/" />}
          >
            <Grid container spacing={gridSpacing}>
              <Grid item container xs={12} md={12} spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Select Department</Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    <option value="Department 1">Department 1</option>
                    <option value="Department 2">Department 2</option>
                    <option value="Department 3">Department 3</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Select discipline</Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    <option value="discipline 1">discipline 1</option>
                    <option value="discipline 2">discipline 2</option>
                    <option value="discipline 3">discipline 3</option>
                  </TextField>
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Select Division</Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    <option value="Division 1">Division 1</option>
                    <option value="Division 2">Division 2</option>
                    <option value="Division3">Division 3</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Select the Course</Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="Course 1">Course 1</option>
                    <option value="Course 2">Course 2</option>
                    <option value="Course 3">Course 3</option>
                  </TextField>
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Select the Group</Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    <option value="group1">Group 1</option>
                    <option value="group2">Group 2</option>
                    <option value="group3">Group 3</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Select the Package</Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    select
                    value={packageValue}
                    onChange={(e) => setPackage(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    <option value="Package 1">Package 1</option>
                    <option value="Package 2">Package 2</option>
                    <option value="Package 3">Package 3</option>
                  </TextField>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h6" gutterBottom>Select the Organisation Pack</Typography>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  select
                  value={salesPackName}
                  onChange={(e) => setSalesPackName(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  <option value="Pack 1">Pack 1</option>
                  <option value="Pack 2">Pack 2</option>
                  <option value="Pack 3">Pack 3</option>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item>
                    <Button variant="contained" onClick={handleClickOpen}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      {/* Dialog */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Confirm Delete
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you want to delete this package?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Yes, Delete
          </Button>
          <Button onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};
export default DeletePackagesPage;
