"use client";
import { Chapter } from "components/dashboard/CreatePaperComponents/getChapterComponent";
import { Paper } from "components/dashboard/CreatePaperComponents/getPaperComponent";
import { Part } from "components/dashboard/CreatePaperComponents/getPartComponent";
import { Unit } from "components/dashboard/CreatePaperComponents/getUnitComponent";
import QuestionManager from "./ManageQuestions";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";
import { UPLOAD_RISE_FILES } from "shared/constants/routerUrls";

function ManageRiseFiles() {
  const dispatch = useDispatch();
  const handleFileUpload = async (
    file: File,
    paper: Paper,
    part?: Part,
    chapter?: Chapter,
    unit?: Unit
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("paperId", paper._id);
    if(part){
      formData.append("partId", part._id);
    }
    if(chapter){
      formData.append("chapterId", chapter._id);
    }
    if(unit){
      formData.append("unitId", unit._id);
    }
    try {
      console.log({ formData });
      console.log({ file, paper, part, chapter, unit });
      const response = await axios.post(UPLOAD_RISE_FILES, formData,{
        headers:{
          "Content-Type": "multipart/form-data"
        }
      });
      console.log({response});
      if(response.status === 200){
        dispatch(openSnackbarFunction(response.data.message || "File uploaded successfully.", "success"));
      }
    } catch (error: any) {
      if(error.response.status === 409 || error.response.status === 400){
        dispatch(openSnackbarFunction(error.response.data.message || "File already exists.", "warning"));
      }else{
        dispatch(openSnackbarFunction(error.response.data.message || "Something went wrong.", "error"));
      }
    }
  };
  return (
    <QuestionManager onFileUpload={handleFileUpload} title="Rise Files" />
  );
}
export default ManageRiseFiles;