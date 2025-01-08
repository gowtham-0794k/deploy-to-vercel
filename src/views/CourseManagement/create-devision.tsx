"use client";
import { gridSpacing } from "store/constant";
import React, { useState } from "react";
import { Grid, MainCard } from "utils/genericExports/theme-imports";
import { InputWithChild, MMTreeView } from "components/meraMaster";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { BASE_URL } from "shared/constants/routerUrls";
import GetOrgComponent, {
  Organization,
} from "components/dashboard/OrganizationComponents/getOrgComponent";
import GetItemComponent from "components/dashboard/CourseManagementComponent/getCourseItem";

function CreateDivision() {
  const [_, setDivisions] = useState([]),
    dispatch = useDispatch(),
    [selectedOrg, setSelectedOrg] = useState<Organization | null>(null),
    [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(
      null
    ),
    [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(
      null
    ),
    [resetInputs, setResetInputs] = useState(false),
    [treeData, setTreeData] = useState<any>([]),
    [departmentName, setDepartmentName] = useState<any>([]),
    [disciplineName, setDisciplineName] = useState<any>([]),
    
    handleOrganizationChange = (org: Organization | null) => {
      setSelectedOrg(org);
      setSelectedDepartmentId(""); // Reset selected department
      setSelectedDisciplineId("");
      setDivisions([]); // Reset divisions
      
    },
    handleGetData = async (divisionData: any) => {
      setDivisions(divisionData);
      if (!selectedOrg || !selectedDepartmentId || !selectedDisciplineId) {
        dispatch(
          openSnackbarFunction(
            "Please select an organization, department and discipline",
            "error"
          )
        );
        return;
      }
      if (divisionData.length === 0) {
        dispatch(openSnackbarFunction("Please add at least one division", "error"));
        return;
      }
      const formData = {
        orgId: selectedOrg?._id,
        departmentId: selectedDepartmentId,
        disciplineId: selectedDisciplineId,
        divisions: divisionData.map((division: any) => ({
          divisionName: division.name,
        })),
      };

      try {
        const response = await axios.post(`${BASE_URL}/division`, formData);
        if (response.status === 201) {
          dispatch(
            openSnackbarFunction(
              response.data.message || "Division data created successfully.",
              "success"
            )
          );
          setSelectedOrg(null);
          setSelectedDepartmentId(null);
          setSelectedDisciplineId(null);
          setDivisions([]);
          setResetInputs(true);
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          dispatch(
            openSnackbarFunction(
              error.response.data.message ||
                (error.response.data &&
                  Object.values(error.response.data)[0]) ||
                "Division data already exists for the selected department and discipline.",
              "error"
            )
          );
        } else {
          dispatch(
            openSnackbarFunction(
              error.response.data.message || "Adding Division data failed.",
              "error"
            )
          );
        }
      } finally {
        setTimeout(() => {
          setResetInputs(false);
        }, 0);
      }
    },
    changedData = (items: any) => {
      const setTreeDataMap = [
        {
          name: departmentName,
          id: "1",
          levelOne: [{
            name: disciplineName,
            id: "2",
            levelTwo: items?.map((division: any) => ({
              name: division.name,
              id: "3" + division.id.toString(),
            }))
          }],
        },
      ];
      setTreeData(setTreeDataMap);
    };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <MainCard
          title="Create Division"
          sx={{ height: "100%", position: "relative" }}
        >
          <GetOrgComponent
            onOrganizationChange={handleOrganizationChange}
            selectedOrg={selectedOrg}
          />
          <Grid container spacing={2} alignItems="center" sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <Grid container alignItems="center">
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
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <InputWithChild
                    label="Division Name"
                    placeholder="Name the Division..."
                    buttonName="Create Division"
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
}

export default CreateDivision;
