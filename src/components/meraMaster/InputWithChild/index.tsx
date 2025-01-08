"use client";

import React, { useState, useEffect } from "react";
import { dispatch } from "store";
import {
  Button,
  Grid,
  InputLabel,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  DeleteIcon,
  EditIcon,
} from "utils/genericExports/theme-imports";
import { openSnackbarFunction } from "utils/utils";

type InputWithChildProps = {
  label: string;
  placeholder: string;
  getData: (items: any) => void;
  buttonName?: string;
  onDataChange?: (items: any) => void;
  resetTrigger?: boolean;
};

export const InputWithChild = (props: InputWithChildProps) => {
  const { label, placeholder, getData, onDataChange, resetTrigger } = props;
  const [department, setDepartment] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");  // New state for the input field
  const [savedCoursesData, setSavedCoursesData] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<any>(null);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleAddItem = () => {
    const trimmedDepartment = department.trim();
    if (trimmedDepartment) {
      const isDuplicate = savedCoursesData.some(
        (item) =>
          item.name.toLowerCase().trim() === trimmedDepartment.toLowerCase()
      );
      if (isDuplicate) {
        dispatch(openSnackbarFunction("This Name already exists!", "error"));
        return;
      }
      if (editIndex !== null) {
        setSavedCoursesData((prev) =>
          prev.map((item, index) =>
            index === editIndex ? { ...item, name: trimmedDepartment } : item
          )
        );
        setEditIndex(null);
      } else {
        setSavedCoursesData((prev) => [
          ...prev,
          { id: prev.length + 1, name: trimmedDepartment },
        ]);
      }
      // Clear both input fields
      setDepartment("");
      setInputValue("");
    }
  };

  const handleOpen = (index: number) =>
    setOpen((prev) => ({ ...prev, [index]: true }));

  const handleClose = (index: number) =>
    setOpen((prev) => ({ ...prev, [index]: false }));

  const handleDelete = (index: number) => {
    setSavedCoursesData((prev) => prev.filter((_, i) => i !== index));
    handleClose(index);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setDepartment(savedCoursesData[index].name);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setDepartment("");
  };

  const handleCreateDepartment = () => {
    getData?.(savedCoursesData);
  };

  useEffect(() => {
    onDataChange?.(savedCoursesData);
  }, [savedCoursesData]);

  useEffect(() => {
    if (resetTrigger) {
      setDepartment("");
      setInputValue("");
      setSavedCoursesData([]);
      setEditIndex(null);
      setOpen({});
    }
  }, [resetTrigger]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sx={{ mt: 0, mb: 0 }}>
        <InputLabel>
          {label}
        </InputLabel>
        <TextField
          required
          fullWidth
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setDepartment(e.target.value);
          }}
        />
      </Grid>

      {savedCoursesData.map((dept, index) => (
        <Grid
          item
          xs={12}
          key={dept.id}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TextField
            fullWidth
            value={editIndex === index ? department : dept?.name}
            disabled={editIndex !== index}
            onChange={(e) => {
              if (editIndex === index) {
                setDepartment(e.target.value);
              }
            }}
          />
          <SpeedDial
            ariaLabel={`SpeedDial ${index}`}
            sx={{ position: "relative" }}
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
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            sx={{ mr: 2 }}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          <Button
            variant="contained"
            color={editIndex !== null ? "secondary" : "primary"}
            onClick={editIndex !== null ? handleCancel : handleCreateDepartment}
          >
            {editIndex !== null
              ? "Cancel"
              : props.buttonName ?? "Create Department"}
          </Button>
        </>
      </Grid>
    </Grid>
  );
};