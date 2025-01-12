"use client";

import React, { useState } from "react";
import { Grid, MainCard } from "utils/genericExports/theme-imports";
import { InputWithChild, MMTreeView } from "components/meraMaster";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { BASE_URL } from "shared/constants/routerUrls";
import GetPaperComponent, {
  Paper,
} from "components/dashboard/CreatePaperComponents/getPaperComponent";

interface Part {
  name: string;
}

function CreateParts() {
  const [_, setParts] = useState<Part[]>([]);
  const dispatch = useDispatch();
  const [selectedPaper, setSelectedPaper] = useState<any>([]);
  const [resetInputs, setResetInputs] = useState(false);
  const [paperName, setPaperName] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const handlePaperChange = (paper: Paper | null) => {
    setSelectedPaper(paper);
    setPaperName(paper?.displayName);
  };

  const handleGetData = async (partData: Part[]) => {
    setParts(partData);

    if (!selectedPaper) {
      dispatch(openSnackbarFunction("Please select a paper", "error"));
      return;
    }
    if (partData.length === 0) {
      dispatch(openSnackbarFunction("Please add at least one part", "error"));
      return;
    }

    const formData = {
      paperId: selectedPaper._id,
      parts: partData.map((part: Part) => ({ partName: part.name })),
    };

    try {
      const response = await axios.post(`${BASE_URL}/parts`, formData);
      if (response.status === 200) {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Parts created successfully.",
            "success"
          )
        );
        setSelectedPaper(null);
        setParts([]);
        setResetInputs(true);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Parts Already created.",
            "error"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction(
            error.response.data.message || "Parts creation Failed.",
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
        name: paperName,
        id: "1",
        levelOne: items?.map((part: any) => ({
          name: part.name,
          id: "2" + part.id.toString(),
        })),
      },
    ];
    setTreeData(setTreeDataMap);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <MainCard title="Create Parts">
          <GetPaperComponent
            onPaperChange={handlePaperChange}
            selectedPaper={selectedPaper}
            onItemChangeName={(displayName) => {
              if (displayName !== undefined) {
                setPaperName(displayName);
              }
            }}
          />
          <InputWithChild
            label="Part Name"
            placeholder="Enter Part Name"
            getData={handleGetData}
            buttonName="Create Parts"
            resetTrigger={resetInputs}
            onDataChange={changedData}
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

export default CreateParts;
