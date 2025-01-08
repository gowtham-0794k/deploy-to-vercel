"use client";
import { useState } from "react";
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

function CreateDiscipline() {
  const [_, setDisciplines] = useState([]),
    [treeData, setTreeData] = useState<any>([]),
    [departmentName, setDepartmentName] = useState<any>([]),
    dispatch = useDispatch(),
    [selectedOrg, setSelectedOrg] = useState<Organization | null>(null),
    [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(
      null
    ),
    [resetInputs, setResetInputs] = useState(false),
    handleOrganizationChange = (org: Organization | null) => {
      setSelectedOrg(org);
      setSelectedDepartmentId(""); // Reset selected department
      setDisciplines([]); // Reset disciplines
    },
    handleGetData = async (disciplinesData: any) => {
      setDisciplines(disciplinesData);
      if (!selectedOrg || !selectedDepartmentId) {
        dispatch(
          openSnackbarFunction(
            "Please select an organization and department",
            "error"
          )
        );
        return;
      }
      if (disciplinesData.length === 0) {
        dispatch(
          openSnackbarFunction("Please add at least one discipline", "error")
        );
        return;
      }
      const formData = {
        orgId: selectedOrg?._id,
        departmentId: selectedDepartmentId,
        disciplines: disciplinesData.map((disc: any) => ({
          discName: disc.name,
        })),
      };
      try {
        const response = await axios.post(`${BASE_URL}/discipline`, formData);
        if (response.status === 201) {
          dispatch(
            openSnackbarFunction(
              response.data.message || "Discipline data created successfully.",
              "success"
            )
          );
          setSelectedOrg(null);
          setSelectedDepartmentId(null);
          setDisciplines([]);
          setResetInputs(true);
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          dispatch(
            openSnackbarFunction(
              error.response.data.message ||
                (error.response.data &&
                  Object.values(error.response.data)[0]) ||
                "Discipline data already exists for the selected department.",
              "error"
            )
          );
        } else {
          dispatch(
            openSnackbarFunction(
              error.response.data.message || "Adding Discipline data failed.",
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
          levelOne: items?.map((discipline: any) => ({
            name: discipline.name,
            id: "2" + discipline.id.toString(),
          })),
        },
      ];
      setTreeData(setTreeDataMap);
    };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <MainCard
          title="Create Discipline"
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
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <InputWithChild
                label="Discipline Name"
                placeholder="Name the Discipline..."
                buttonName="Create Discipline"
                getData={handleGetData}
                onDataChange={changedData}
                resetTrigger={resetInputs}
              />
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

export default CreateDiscipline;
