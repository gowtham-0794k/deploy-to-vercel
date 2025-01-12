"use client";
import React, { useState } from "react";
import { Grid, MainCard } from "utils/genericExports/theme-imports";
import { gridSpacing } from "utils/genericExports/uiComponentsimports";
import { InputWithChild, MMTreeView } from "components/meraMaster";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { BASE_URL } from "shared/constants/routerUrls";
import GetPaperComponent, {
  Paper,
} from "components/dashboard/CreatePaperComponents/getPaperComponent";
import GetPartComponent, {
  Part,
} from "components/dashboard/CreatePaperComponents/getPartComponent";

interface Chapter {
  name: string;
}

function ColumnsLayouts() {
  const [_, setChapters] = useState<Chapter[]>([]);
  const dispatch = useDispatch();
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [resetInputs, setResetInputs] = useState(false);
  const [partName, setPartName] = useState<any>([]);
  const [paperName, setPaperName] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const handlePaperChange = (paper: Paper | null) => {
    setSelectedPaper(paper);
    setPaperName(paper?.displayName);
  };

  const handlePartChange = (part: Part | null) => {
    setSelectedPart(part);
    setPartName(part?.partName);
  };

  const handleGetData = async (chapterData: Chapter[]) => {
    setChapters(chapterData);

    if (!selectedPaper) {
      dispatch(openSnackbarFunction("Please select a paper", "error"));
      return;
    }
    if (!selectedPart) {
      dispatch(openSnackbarFunction("Please select a part", "error"));
      return;
    }
    if (chapterData.length === 0) {
      dispatch(
        openSnackbarFunction("Please add at least one chapter", "error")
      );
      return;
    }
    const formData = {
      paperId: selectedPaper._id,
      partId: selectedPart._id,
      chapters: chapterData.map((chapter: Chapter) => ({
        chapterName: chapter.name,
      })),
    };

    try {
      const response = await axios.post(`${BASE_URL}/chapters`, formData);
      if (response.status === 200) {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Chapters created successfully.",
            "success"
          )
        );
        setSelectedPaper(null);
        setSelectedPart(null);
        setChapters([]);
        setResetInputs(true);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Chapters Already created.",
            "error"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction(
            error.response.data.message || "Chapters creation Failed.",
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
        levelOne: [
          {
            name: partName,
            id: "2",
            levelTwo: items?.map((chapter: any) => ({
              name: chapter.name,
              id: "3" + chapter.id.toString(),
            })),
          },
        ],
      },
    ];
    setTreeData(setTreeDataMap);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <MainCard title="Create Chapters">
          <GetPaperComponent
            onPaperChange={handlePaperChange}
            selectedPaper={selectedPaper}
            onItemChangeName={(displayName) => {
              if (displayName !== undefined) {
                setPaperName(displayName);
              }
            }}
          />
          <GetPartComponent
            onPartChange={handlePartChange}
            selectedPart={selectedPart}
            selectedPaper={selectedPaper}
            onItemChangeName={(partName) => {
              if (partName !== undefined) {
                setPartName(partName);
              }
            }}
          />
          <InputWithChild
            label="Chapter Name"
            placeholder="Chapter Name"
            getData={handleGetData}
            buttonName="Create Chapters"
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

export default ColumnsLayouts;
