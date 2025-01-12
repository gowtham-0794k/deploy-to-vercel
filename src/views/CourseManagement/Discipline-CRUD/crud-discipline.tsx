"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  GET_DISCIPLINES,
  PUT_DISCIPLINES,
  BASE_URL,
} from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, postAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Discipline {
  _id: string;
  discName: string;
}

interface Department {
  _id: string;
  departmentName: string;
}

interface Organization {
  _id: string;
  organizationName: string;
}

const CrudDiscipline: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(
    null
  );
  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesAndPermissions } = useConfig();

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await getAxios({ url: `${BASE_URL}/org` });
      setOrganizations(response.data.entities);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch organizations", "error"));
    }
  }, [dispatch]);

  const fetchDepartments = useCallback(
    async (orgId: string) => {
      try {
        const response = await getAxios({
          url: `${BASE_URL}/${orgId}/departments`,
        });
        setDepartments(response.data);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch departments", "error"));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const courseManagement = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Course Management"
      );
      const createDepartmentFeature = courseManagement?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Discipline"
      );
      if (createDepartmentFeature) {
        setCanEdit(
          createDepartmentFeature.permissions.allowed.includes("edit")
        );
        setCanDelete(
          createDepartmentFeature.permissions.allowed.includes("delete")
        );
        setCanCreate(
          createDepartmentFeature.permissions.allowed.includes("assign")
        );
      }
    }
  }, [rolesAndPermissions]);

  const fetchDisciplines = useCallback(
    async (departmentId: string) => {
      try {
        const response = await postAxios({
          url: `${GET_DISCIPLINES}`,
          values: { departmentId: departmentId, orgId: selectedOrg },
        });
        setDisciplines(response.data);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch disciplines", "error"));
      }
    },
    [dispatch, selectedOrg]
  );

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgChange = (event: SelectChangeEvent<string>) => {
    const orgId = event.target.value;
    setSelectedOrg(orgId);
    setSelectedDepartment("");
    setDisciplines([]);
    fetchDepartments(orgId);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    fetchDisciplines(departmentId);
  };

  const handleEdit = (discipline: Discipline) => {
    setEditingDiscipline(discipline);
    setNewDisciplineName(discipline.discName);
    setOpenDialog(true);
  };

  const handleDelete = async (disciplineId: string) => {
    try {
      await axios({
        method: "delete",
        url: `${PUT_DISCIPLINES}`,
        data: {
          orgId: selectedOrg,
          departmentId: selectedDepartment,
          disciplineId: disciplineId,
        },
      });
      dispatch(
        openSnackbarFunction("Discipline deleted successfully", "success")
      );
      fetchDisciplines(selectedDepartment);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete discipline", "error"));
    }
  };

  const handleSave = async () => {
    if (!editingDiscipline) return;

    try {
      await axios({
        method: "put",
        url: `${PUT_DISCIPLINES}`,
        data: {
          orgId: selectedOrg,
          departmentId: selectedDepartment,
          disciplineId: editingDiscipline._id,
          discName: newDisciplineName,
        },
      });
      dispatch(
        openSnackbarFunction("Discipline updated successfully", "success")
      );
      setOpenDialog(false);
      setEditingDiscipline(null);
      setNewDisciplineName("");
      fetchDisciplines(selectedDepartment);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to update discipline", "error"));
    }
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl fullWidth>
            <InputLabel>Select Organization</InputLabel>
            <Select value={selectedOrg} onChange={handleOrgChange}>
              {organizations.map((org) => (
                <MenuItem key={org._id} value={org._id}>
                  {org.organizationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl fullWidth>
            <InputLabel>Select Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              disabled={!selectedOrg}
            >
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              router.push("/coursemanagement/create-new-discipline")
            }
            disabled={!selectedDepartment && !canCreate}
          >
            Create New Discipline
          </Button>
        </Grid>
      </Grid>
      {disciplines.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Discipline Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disciplines.map((discipline) => (
                <TableRow key={discipline._id}>
                  <TableCell>{discipline.discName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(discipline)} disabled={!canEdit}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(discipline._id)} disabled={!canDelete}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingDiscipline ? "Edit Discipline" : "Add New Discipline"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Discipline Name"
            type="text"
            fullWidth
            value={newDisciplineName}
            onChange={(e) => setNewDisciplineName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudDiscipline;