"use client";

import React, { useState } from "react";
import { Grid, MainCard } from "utils/genericExports/theme-imports";
import { gridSpacing } from "utils/genericExports/uiComponentsimports";
import { InputWithChild, MMTreeView } from "components/meraMaster";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { BASE_URL } from "shared/constants/routerUrls";
import GetOrgComponent, {
  Organization,
} from "components/dashboard/OrganizationComponents/getOrgComponent";
import GetItemComponent from "components/dashboard/CourseManagementComponent/getCourseItem";
function CreateCourse() {
  const dispatch = useDispatch();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<
    string | null
  >(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(
    null
  );
  const [resetInputs, setResetInputs] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [departmentName, setDepartmentName] = useState<any>([]);
  const [disciplineName, setDisciplineName] = useState<any>([]);
  const [divisionName, setDivisionName] = useState<any>([]);

  const handleOrganizationChange = (org: Organization | null) => {
    setSelectedOrg(org);
  };

  const handleGetData = async (courseData: any) => {
    if (
      !selectedOrg ||
      !selectedDepartmentId ||
      !selectedDisciplineId ||
      !selectedDivisionId
    ) {
      dispatch(
        openSnackbarFunction(
          "Please select an organization, department, discipline and division",
          "error"
        )
      );
      return;
    }
    if (courseData.length === 0) {
      dispatch(openSnackbarFunction("Please add at least one course", "error"));
      return;
    }

    const formData = {
      orgId: selectedOrg?._id,
      departmentId: selectedDepartmentId,
      disciplineId: selectedDisciplineId,
      divisionId: selectedDivisionId,
      courses: courseData.map((course: { name: string }) => ({
        courseName: course.name,
      })),
    };

    try {
      const response = await axios.post(`${BASE_URL}/addCourses`, formData);
      if (response.status === 201) {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Course data created successfully.",
            "success"
          )
        );
        setSelectedOrg(null);
        setSelectedDepartmentId(null);
        setSelectedDisciplineId(null);
        setSelectedDivisionId(null);
        setResetInputs(true);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Course data already exists.",
            "error"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Creating Course data failed.",
            "error"
          )
        );
      }
    } finally {
      setTimeout(() => {
        setResetInputs(false);
      }, 0);
    }
  };

  const changedData = (items: any) => {
    const setTreeDataMap = [
      {
        name: departmentName,
        id: "1",
        levelOne: [{
          name: disciplineName,
          id: "2",
          levelTwo: [{
            name: divisionName,
            id: "3",
            levelThree: items?.map((course: any) => ({
              name: course.name,
              id: "4" + course.id.toString()
            }))
          }]
        }]
      }
    ];
    setTreeData(setTreeDataMap);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <MainCard
          title="Create Courses"
          sx={{ height: "100%", position: "relative" }}
        >
          <GetOrgComponent
            onOrganizationChange={handleOrganizationChange}
            selectedOrg={selectedOrg}
          />
          <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                  <GetItemComponent
                    type="department"
                    onItemChange={(deptId) => {
                      setSelectedDepartmentId(deptId);
                    }}
                    selectedItemId={selectedDepartmentId}
                    selectedOrg={selectedOrg}
                    onItemChangeName={(name) => {
                      setDepartmentName(name);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <GetItemComponent
                    type="discipline"
                    onItemChange={(disciplineId) => {
                      setSelectedDisciplineId(disciplineId);
                    }}
                    selectedItemId={selectedDisciplineId}
                    selectedDeptId={selectedDepartmentId}
                    selectedOrg={selectedOrg}
                    onItemChangeName={(name) => {
                      setDisciplineName(name);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <GetItemComponent
                    type="division"
                    onItemChange={(divisionId) => {
                      setSelectedDivisionId(divisionId);
                    }}
                    selectedItemId={selectedDivisionId}
                    selectedDeptId={selectedDepartmentId}
                    selectedDiscId={selectedDisciplineId}
                    selectedOrg={selectedOrg}
                    onItemChangeName={(name) => {
                      setDivisionName(name);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <InputWithChild
                    label="Course Name"
                    placeholder="Name the Course..."
                    buttonName="Create Course"
                    getData={handleGetData}
                    onDataChange={changedData}
                    resetTrigger={resetInputs}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard title="Select the courses for the level">
          <MMTreeView data={treeData} />
        </MainCard>
      </Grid>
    </Grid>
  );
}export default CreateCourse;