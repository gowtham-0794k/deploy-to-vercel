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
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  GET_DISCIPLINES,
  PUT_DIVISIONS,
  BASE_URL,
  GET_ORGS,
} from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, postAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Division {
  _id: string;
  divisionName: string;
  courses: string[];
}

interface Discipline {
  _id: string;
  discName: string;
  divisions: Division[];
}

interface Department {
  _id: string;
  departmentName: string;
}

interface Organization {
  _id: string;
  organizationName: string;
}

const CrudDivision: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<Discipline | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [newDivisionName, setNewDivisionName] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesAndPermissions } = useConfig();

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

  const fetchDisciplines = useCallback(
    async (departmentId: string) => {
      try {
        const response = await postAxios({
          url: `${GET_DISCIPLINES}`,
          values: { departmentId: departmentId, orgId: selectedOrg },
        });
        setDisciplines(response.data);
        return response.data;
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch disciplines", "error"));
      }
    },
    [dispatch, selectedOrg]
  );

  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const courseManagement = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Course Management"
      );
      const createDepartmentFeature = courseManagement?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Division"
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

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgChange = (event: SelectChangeEvent<string>) => {
    const orgId = event.target.value;
    setSelectedOrg(orgId);
    setSelectedDepartment("");
    setSelectedDiscipline(null);
    fetchDepartments(orgId);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    setSelectedDiscipline(null);
    fetchDisciplines(departmentId);
  };

  const handleDisciplineChange = (event: SelectChangeEvent<string>) => {
    const disciplineId = event.target.value;
    const discipline = disciplines.find((d) => d._id === disciplineId);
    setSelectedDiscipline(discipline || null);
  };

  const handleEdit = (division: Division) => {
    setEditingDivision(division);
    setNewDivisionName(division.divisionName);
    setOpenDialog(true);
  };

  const handleDelete = async (divisionId: string) => {
    if (!selectedDiscipline) return;
    try {
      const payload = {
        orgId: selectedOrg,
        departmentId: selectedDepartment,
        disciplineId: selectedDiscipline._id,
        divisionId: divisionId,
      };
      await axios({
        method: "delete",
        url: PUT_DIVISIONS,
        data: payload,
      });
      dispatch(
        openSnackbarFunction("Division deleted successfully", "success")
      );
      fetchDisciplines(selectedDepartment);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete division", "error"));
    }
  };

 const handleSave = async () => {
   if (!selectedDiscipline || !editingDivision) return;
 
   try {
     const payload = {
       orgId: selectedOrg,
       departmentId: selectedDepartment,
       disciplineId: selectedDiscipline._id,
       divisionId: editingDivision._id,
       divisionName: newDivisionName,
     };
     await axios({
       method: "put",
       url: PUT_DIVISIONS,
       data: payload,
     });
     
     // Update the local state
     setDisciplines(prevDisciplines => 
       prevDisciplines.map(discipline => 
         discipline._id === selectedDiscipline._id
           ? {
               ...discipline,
               divisions: discipline.divisions.map(division =>
                 division._id === editingDivision._id
                   ? { ...division, divisionName: newDivisionName }
                   : division
               )
             }
           : discipline
       )
     );
 
     dispatch(
       openSnackbarFunction("Division updated successfully", "success")
     );
     setOpenDialog(false);
     setEditingDivision(null);
     setNewDivisionName("");
   } catch (error) {
     dispatch(openSnackbarFunction("Failed to update division", "error"));
   }
 };
 
 useEffect(() => {
   if (selectedDiscipline) {
     const updatedSelectedDiscipline = disciplines.find(d => d._id === selectedDiscipline._id);
     if (updatedSelectedDiscipline) {
       setSelectedDiscipline(updatedSelectedDiscipline);
     }
   }
 }, [disciplines]);

  return (
    <div>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
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
          <FormControl fullWidth>
            <InputLabel>Select Discipline</InputLabel>
            <Select
              value={selectedDiscipline?._id ?? ""}
              onChange={handleDisciplineChange}
              disabled={!selectedDepartment}
            >
              {disciplines.map((discipline) => (
                <MenuItem key={discipline._id} value={discipline._id}>
                  {discipline.discName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              router.push("/coursemanagement/create-new-division");
            }}
            disabled={!selectedDiscipline && !canCreate}
            sx={{ mb: 2 }}
          >
            Create New Division
          </Button>
        <Grid item xs={12}>
        {selectedDiscipline?.divisions && selectedDiscipline?.divisions.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Division Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDiscipline?.divisions.map((division) => (
                  <TableRow key={division._id}>
                    <TableCell>{division.divisionName}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(division)} disabled={!canEdit}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(division._id)} disabled={!canDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Edit Division
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Division Name"
            type="text"
            fullWidth
            value={newDivisionName}
            onChange={(e) => setNewDivisionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudDivision;
