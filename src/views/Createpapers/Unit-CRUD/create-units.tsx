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
import GetChapterComponent, {
  Chapter,
} from "components/dashboard/CreatePaperComponents/getChapterComponent";

interface Units {
  name: string;
}
function ColumnsLayouts() {
  const [_, setUnits] = useState<Units[]>([]);
  const dispatch = useDispatch();
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [resetInputs, setResetInputs] = useState(false);
  const [PaperName, setPaperName] = useState<any>([]);
  const [PartName, setPartName] = useState<any>([]);
  const [ChapterName, setChapterName] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const handlePaperChange = (paper: Paper | null) => {
    setSelectedPaper(paper);
    setPaperName(paper?.displayName);
  };

  const handlePartChange = (part: Part | null) => {
    setSelectedPart(part);
    setPartName(part?.partName);
  };
  const handleChapterChange = (chapter: Chapter | null) => {
    setSelectedChapter(chapter);
    setChapterName(chapter?.chapterName);
  };

  const handleGetData = async (unitData: Units[]) => {
    setUnits(unitData);

    if (!selectedPaper) {
      dispatch(openSnackbarFunction("Please select a paper", "error"));
      return;
    }
    if (!selectedPart) {
      dispatch(openSnackbarFunction("Please select a part", "error"));
      return;
    }
    if (unitData.length === 0) {
      dispatch(openSnackbarFunction("Please add at least one unit", "error"));
      return;
    }

    const formData = {
      paperId: selectedPaper._id,
      partId: selectedPart._id,
      chapterId: selectedChapter?._id,
      units: unitData.map((unit: Units) => ({ unitName: unit.name })),
    };

    try {
      const response = await axios.post(`${BASE_URL}/units`, formData);
      if (response.status === 200) {
        dispatch(
          openSnackbarFunction(
            response.data.message || "Units created successfully.",
            "success"
          )
        );
        setSelectedPaper(null);
        setSelectedPart(null);
        setSelectedChapter(null);
        setUnits([]);
        setResetInputs(true);
       
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        dispatch(
          openSnackbarFunction(
            error.response.data.message ||
              (error.response.data && Object.values(error.response.data)[0]) ||
              "Units Already created.",
            "error"
          )
        );
      } else {
        dispatch(
          openSnackbarFunction(
            error.response.data.message || "Units creation Failed.",
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
        name: PaperName,
        id: "1",
        levelOne: [{
          name: PartName,
          id: "2",
          levelTwo: [{
            name: ChapterName,
            id: "3",
            levelThree: items?.map((unit: any) => ({
              name: unit.name,
              id: "4" + unit.id.toString()
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
        <MainCard title="Create Units">
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
            onItemChangeName={(displayName) => {
               if (displayName !== undefined) {
                setPartName(displayName);
              }
            }}
          />
          <GetChapterComponent
            onChapterChange={handleChapterChange}
            selectedPaper={selectedPaper}
            selectedPart={selectedPart}
            selectedChapter={selectedChapter}
            onItemChangeName={(chapterName) => {
              if (chapterName !== undefined) {
                setChapterName(chapterName);
              }
            }}
          />
          <InputWithChild
            label="Unit Name"
            placeholder="Unit Name"
            getData={handleGetData}
            buttonName="Create Units"
            resetTrigger={resetInputs}
            onDataChange={changedData}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard title="Select the courses for the level">
          <MMTreeView data={treeData}/>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default ColumnsLayouts;
