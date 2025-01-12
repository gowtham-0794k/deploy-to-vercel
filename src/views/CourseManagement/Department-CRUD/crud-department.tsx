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
  GET_ORGS,
  PUT_DEPARTMENT,
  BASE_URL,
} from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Department {
  _id: string;
  departmentName: string;
}

interface Organization {
  _id: string;
  organizationName: string;
}

const CrudDepartment: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesAndPermissions } = useConfig();

  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const courseManagement = rolesAndPermissions.permissions.features.find(
        (feature: any) => feature.featureName === "Course Management"
      );
      const createDepartmentFeature = courseManagement?.subFeatures.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Department"
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

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await getAxios({ url: `${GET_ORGS}` });
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
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgChange = (event: SelectChangeEvent<string>) => {
    const orgId = event.target.value;
    setSelectedOrg(orgId);
    setDepartments([]);
    fetchDepartments(orgId);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.departmentName);
    setOpenDialog(true);
  };

  const handleDelete = async (departmentId: string) => {
    try {
      await axios({
        method: "delete",
        url: `${PUT_DEPARTMENT}`,
        data: {
          orgId: selectedOrg,
          departmentId: departmentId,
        },
      });
      dispatch(
        openSnackbarFunction("Department deleted successfully", "success")
      );
      fetchDepartments(selectedOrg);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete department", "error"));
    }
  };

  const handleSave = async () => {
    if (!editingDepartment) return;

    try {
      await axios({
        method: "put",
        url: `${PUT_DEPARTMENT}`,
        data: {
          orgId: selectedOrg,
          departmentId: editingDepartment._id,
          departmentName: newDepartmentName,
        },
      });
      dispatch(
        openSnackbarFunction("Department updated successfully", "success")
      );
      setOpenDialog(false);
      setEditingDepartment(null);
      setNewDepartmentName("");
      fetchDepartments(selectedOrg);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to update department", "error"));
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
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              router.push("/coursemanagement/create-new-department")
            }
            disabled={!selectedOrg && !canCreate}
          >
            Create New Department
          </Button>
        </Grid>
      </Grid>
      {departments.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department._id}>
                  <TableCell>{department.departmentName}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(department)}
                      disabled={!canEdit}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(department._id)}
                      disabled={!canDelete}
                    >
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
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            type="text"
            fullWidth
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
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

export default CrudDepartment;