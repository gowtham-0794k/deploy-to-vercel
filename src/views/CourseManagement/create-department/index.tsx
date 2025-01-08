"use client";
import { gridSpacing } from "store/constant";
import React, { useState } from "react";
import { Grid, MainCard } from "utils/genericExports/theme-imports";
import { InputWithChild, MMTreeView } from "components/meraMaster";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { BASE_URL } from "shared/constants/routerUrls";
import GetOrgComponent from "components/dashboard/OrganizationComponents/getOrgComponent";

interface Organization {
  _id: string;
  organizationName: string;
}

interface Department {
  name: string;
}

function CreateDepartment() {
  const [treeData, setTreeData] = useState<any>([]),
    dispatch = useDispatch(),
    [selectedOrg, setSelectedOrg] = useState<Organization | null>(null),
    [resetInputs, setResetInputs] = useState(false),
    handleOrganizationChange = (org: Organization | null) => {
      setSelectedOrg(org);
    },
    handleGetData = async (departmentData: Department[]) => {
      if (!selectedOrg) {
        dispatch(
          openSnackbarFunction("Please select an organization", "error")
        );
        return;
      }
      if (departmentData.length === 0) {
        dispatch(
          openSnackbarFunction("Please add at least one department", "error")
        );
        return;
      }

      const formData = {
        orgId: selectedOrg._id,
        departments: departmentData.map((dept: Department) => ({
          departmentName: dept.name,
        })),
      };

      try {
        const response = await axios.post(`${BASE_URL}/department`, formData);
        if (response.status === 201) {
          dispatch(
            openSnackbarFunction(
              response.data.message || "Department data created successfully.",
              "success"
            )
          );
          setSelectedOrg(null);
          setResetInputs(true);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          (error.response?.data && Object.values(error.response.data)[0]) ||
          "Creating Department data failed.";

        dispatch(openSnackbarFunction(errorMessage, "error"));
      } finally {
        setTimeout(() => {
          setResetInputs(false);
        }, 0);
      }
    },
    changedData = (items: any) => {
      const setTreeDataMap = items?.map((item: any) => ({
        name: item.name,
        id: item.id.toString(),
      }));
      setTreeData(setTreeDataMap);
    };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <MainCard title="Create Department">
          <GetOrgComponent
            onOrganizationChange={handleOrganizationChange}
            selectedOrg={selectedOrg}
          />
          <InputWithChild
            label="Department Name"
            placeholder="Enter Department Name"
            getData={handleGetData}
            onDataChange={changedData}
            resetTrigger={resetInputs}
          />
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

export default CreateDepartment;
