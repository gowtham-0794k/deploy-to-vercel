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
  GET_COURSES,
  PUT_COURSES,
  BASE_URL,
  GET_ORGS,
} from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, postAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Organization {
  _id: string;
  organizationName: string;
}

interface Department {
  _id: string;
  departmentName: string;
}

interface Discipline {
  _id: string;
  discName: string;
}

interface Division {
  _id: string;
  divisionName: string;
}

interface Course {
  _id: string;
  courseName: string;
}

const CrudCourse: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
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
  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const courseManagement = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Course Management"
      );
      const createDepartmentFeature = courseManagement?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Course1"
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
          url: `${BASE_URL}/disciplines`,
          values: { departmentId: departmentId, orgId: selectedOrg },
        });
        setDisciplines(response.data);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch disciplines", "error"));
      }
    },
    [dispatch, selectedOrg]
  );

  const fetchDivisions = useCallback(
    async (disciplineId: string) => {
      try {
        const response = await postAxios({
          url: `${BASE_URL}/divisions`,
          values: {
            disciplineId: disciplineId,
            departmentId: selectedDepartment,
            orgId: selectedOrg,
          },
        });
        setDivisions(response.data);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch divisions", "error"));
      }
    },
    [dispatch, selectedOrg, selectedDepartment]
  );

  const fetchCourses = useCallback(
    async (divisionId: string) => {
      try {
        const response = await postAxios({
          url: `${GET_COURSES}`,
          values: {
            divisionId: divisionId,
            disciplineId: selectedDiscipline,
            departmentId: selectedDepartment,
            orgId: selectedOrg,
          },
        });
        setCourses(response.data.courses);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch courses", "error"));
      }
    },
    [dispatch, selectedOrg, selectedDepartment, selectedDiscipline]
  );

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgChange = (event: SelectChangeEvent<string>) => {
    const orgId = event.target.value;
    setSelectedOrg(orgId);
    setSelectedDepartment("");
    setSelectedDiscipline("");
    setSelectedDivision("");
    setCourses([]);
    fetchDepartments(orgId);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    setSelectedDiscipline("");
    setSelectedDivision("");
    setCourses([]);
    fetchDisciplines(departmentId);
  };

  const handleDisciplineChange = (event: SelectChangeEvent<string>) => {
    const disciplineId = event.target.value;
    setSelectedDiscipline(disciplineId);
    setSelectedDivision("");
    setCourses([]);
    fetchDivisions(disciplineId);
  };

  const handleDivisionChange = (event: SelectChangeEvent<string>) => {
    const divisionId = event.target.value;
    setSelectedDivision(divisionId);
    fetchCourses(divisionId);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setNewCourseName(course.courseName);
    setOpenDialog(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      await axios({
        method: "delete",
        url: `${PUT_COURSES}`,
        data: {
          orgId: selectedOrg,
          departmentId: selectedDepartment,
          disciplineId: selectedDiscipline,
          divisionId: selectedDivision,
          courseId,
        },
      });
      dispatch(openSnackbarFunction("Course deleted successfully", "success"));
      fetchCourses(selectedDivision);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete course", "error"));
    }
  };

  const handleSave = async () => {
    if (!editingCourse) return;

    try {
      await axios({
        method: "put",
        url: `${PUT_COURSES}`,
        data: {
          orgId: selectedOrg,
          departmentId: selectedDepartment,
          disciplineId: selectedDiscipline,
          divisionId: selectedDivision,
          courseId: editingCourse?._id,
          courseName: newCourseName,
        },
      });
      dispatch(openSnackbarFunction("Course updated successfully", "success"));
      setOpenDialog(false);
      setEditingCourse(null);
      setNewCourseName("");
      fetchCourses(selectedDivision);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to update course", "error"));
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="org-select-label">Organization</InputLabel>
            <Select
              labelId="org-select-label"
              value={selectedOrg}
              onChange={handleOrgChange}
            >
              {organizations.map((org) => (
                <MenuItem key={org._id} value={org._id}>
                  {org.organizationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="department-select-label">Department</InputLabel>
            <Select
              labelId="department-select-label"
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
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="discipline-select-label">Discipline</InputLabel>
            <Select
              labelId="discipline-select-label"
              value={selectedDiscipline}
              onChange={handleDisciplineChange}
              disabled={!selectedDepartment}
            >
              {disciplines.map((disc) => (
                <MenuItem key={disc._id} value={disc._id}>
                  {disc.discName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="division-select-label">Division</InputLabel>
            <Select
              labelId="division-select-label"
              value={selectedDivision}
              onChange={handleDivisionChange}
              disabled={!selectedDiscipline}
            >
              {divisions.map((div) => (
                <MenuItem key={div._id} value={div._id}>
                  {div.divisionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
     
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/coursemanagement/create-new-course")}
        sx={{ mt: 2 }}
        disabled={!selectedDivision && !canCreate}
        >
        Create New Course
        </Button>

        {courses.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(course)} disabled={!canEdit}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(course._id)} disabled={!canDelete}>
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
          Edit Course
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            type="text"
            fullWidth
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
};

export default CrudCourse;