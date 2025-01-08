"use client";
import { Chapter } from "components/dashboard/CreatePaperComponents/getChapterComponent";
import { Paper } from "components/dashboard/CreatePaperComponents/getPaperComponent";
import { Part } from "components/dashboard/CreatePaperComponents/getPartComponent";
import { Unit } from "components/dashboard/CreatePaperComponents/getUnitComponent";
import QuestionManager from "./ManageQuestions";

function ManageGetQuestions() {
  const handleFileUpload = async (
    file: File,
    paper: Paper,
    part?: Part,
    chapter?: Chapter,
    unit?: Unit
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      console.log({ formData });
      console.log({ file, paper, part, chapter, unit });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  return (
    <QuestionManager onFileUpload={handleFileUpload} title="Get Questions" />
  );
}
export default ManageGetQuestions;