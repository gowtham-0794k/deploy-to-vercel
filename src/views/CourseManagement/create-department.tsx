"use client";

import { gridSpacing } from "store/constant";
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MainCard,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  DeleteIcon,
  EditIcon,
} from "utils/genericExports/theme-imports";
import { Formik } from "formik";
import * as Yup from "yup";

function CreateDepartment() {
  const [departments, setDepartments] = useState([{ id: 1, name: "" }]);
  const [savedDepartments, setSavedDepartments] = useState<string[]>([]);
  const [_, setTreeItems] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const handleOpen = (index: number) =>
    setOpen((prev) => ({ ...prev, [index]: true }));
  const handleClose = (index: number) =>
    setOpen((prev) => ({ ...prev, [index]: false }));

  const handleDelete = (index: number) => {
    setSavedDepartments((prev) => prev.filter((_, i) => i !== index));
    setTreeItems((prev) => prev.filter((_, i) => i !== index));
    handleClose(index);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setDepartments([{ id: 1, name: savedDepartments[index] }]);
    handleClose(index);
  };

  const handleAddDepartment = () => {
    if (departments[0].name.trim() !== "") {
      if (editIndex !== null) {
        setSavedDepartments((prev) =>
          prev.map((dept, i) => (i === editIndex ? departments[0].name : dept))
        );
        setTreeItems((prev) =>
          prev.map((item, i) => (i === editIndex ? departments[0].name : item))
        );
        setEditIndex(null);
      } else {
        setSavedDepartments((prevDepartments: string[]) => [
          ...prevDepartments,
          departments[0].name,
        ]);
        setTreeItems((prevItems: string[]) => [
          ...prevItems,
          departments[0].name,
        ]);
      }
      setDepartments([{ id: 1, name: "" }]);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setDepartments([{ id: 1, name: "" }]);
  };

  const handleSubmit = () => {};

  const initialValues = {
    departments: [{ name: "" }],
  };

  const validationSchema = Yup.object().shape({
    departments: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Department name is required"),
      })
    ),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, values, errors, touched }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <MainCard
                title="Create Department"
                sx={{ height: "100%", position: "relative" }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 0.5 }}
                >
                  <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box sx={{ flex: 1.5 }}>
                          <InputLabel>Name the Department...</InputLabel>
                          <TextField
                            fullWidth
                            placeholder="Name the Department..."
                            value={departments[0].name}
                            onChange={(e) => {
                              setDepartments([{ id: 1, name: e.target.value }]);
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {savedDepartments.map((dept, index) => (
                    <Grid
                      item
                      xs={12}
                      key={index}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <TextField
                        fullWidth
                        value={dept}
                        disabled={editIndex !== index}
                        onChange={(e) => {
                          if (editIndex === index) {
                            const updatedDepartments = [...savedDepartments];
                            updatedDepartments[index] = e.target.value;
                            setSavedDepartments(updatedDepartments);
                            setDepartments([{ id: 1, name: e.target.value }]);
                          }
                        }}
                      />
                      <SpeedDial
                        ariaLabel={`SpeedDial ${index}`}
                        sx={{
                          position: "relative",
                        }}
                        icon={<SpeedDialIcon />}
                        onClose={() => handleClose(index)}
                        onOpen={() => handleOpen(index)}
                        open={open[index]}
                        direction="right"
                      >
                        <SpeedDialAction
                          key="Delete"
                          icon={<DeleteIcon />}
                          tooltipTitle="Delete"
                          onClick={() => handleDelete(index)}
                        />
                        <SpeedDialAction
                          key="Edit"
                          icon={<EditIcon />}
                          tooltipTitle="Edit"
                          onClick={() => handleEdit(index)}
                        />
                      </SpeedDial>
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    {editIndex !== null ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddDepartment}
                          sx={{ mt: 2, mr: 2 }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleCancel}
                          sx={{ mt: 2 }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddDepartment}
                          sx={{ mt: 2, mr: 2 }}
                        >
                          Add
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          onClick={() => handleSubmit()}
                          sx={{ mt: 2 }}
                        >
                          Create Department
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <MainCard
                title="Select the courses for the level"
                sx={{ height: "100%" }}
              >
                <TreeView
                  aria-label="customized"
                  defaultExpanded={["1"]}
                  defaultCollapseIcon={<MinusSquare />}
                  defaultExpandIcon={<PlusSquare />}
                  defaultEndIcon={<CloseSquare />}
                >
                  <StyledTreeItem nodeId="3" label="Select The Courses">
                    <StyledTreeItem nodeId="6" label="Hello" />
                    <StyledTreeItem nodeId="7" label="Select The level">
                      <StyledTreeItem nodeId="9" label="Level  1" />
                      <StyledTreeItem nodeId="10" label="Level 2" />
                      <StyledTreeItem nodeId="11" label="Level 3" />
                    </StyledTreeItem>
                    <StyledTreeItem nodeId="8" label="Hello" />
                  </StyledTreeItem>
                  <StyledTreeItem nodeId="4" label="World" />
                </TreeView>
              </MainCard>
            </Grid> */}
          </Grid>
        </form>
      )}
    </Formik>
  );
}
export default CreateDepartment;
