"use client";
import React, { useState, useRef } from "react";
import {
  Grid,
  CardContent,
  Button,
  Checkbox,
  Typography,
  Input,
  SvgIcon,
  CloudUploadIcon,
  Box,
} from "utils/genericExports/theme-imports";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import GetPaperComponent, {
  Paper,
} from "components/dashboard/CreatePaperComponents/getPaperComponent";
import GetPartComponent, {
  Part,
} from "components/dashboard/CreatePaperComponents/getPartComponent";
import GetChapterComponent, {
  Chapter,
} from "components/dashboard/CreatePaperComponents/getChapterComponent";
import GetUnitComponent, {
  Unit,
} from "components/dashboard/CreatePaperComponents/getUnitComponent";
import FilePreview from "./FilePreview";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";

interface QuestionManagerProps {
  onFileUpload: (
    file: File,
    paper: Paper,
    part?: Part,
    chapter?: Chapter,
    unit?: Unit
  ) => Promise<void>;
  title?: string;
}

function QuestionManager({
  onFileUpload,
  title = "Question Manager",
}: QuestionManagerProps) {
  const [paperChecked, setPaperChecked] = useState(false);
  const [partChecked, setPartChecked] = useState(false);
  const [chapterChecked, setChapterChecked] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handlePaperChange = (paper: Paper | null) => {
    setSelectedPaper(paper);
    setPaperChecked(false);
    setPartChecked(false);
    setChapterChecked(false);
    setSelectedPart(null);
    setSelectedChapter(null);
    setSelectedUnit(null);
  };

  const handlePartChange = (part: Part | null) => {
    setSelectedPart(part);
    setPartChecked(false);
    setChapterChecked(false);
    setSelectedChapter(null);
    setSelectedUnit(null);
  };

  const handleChapterChange = (chapter: Chapter | null) => {
    setSelectedChapter(chapter);
    setChapterChecked(false);
    setSelectedUnit(null);
  };

  const handleUnitChange = (unit: Unit | null) => {
    setSelectedUnit(unit);
  };

  // Add this new function to clear all states
  const clearAllStates = () => {
    setPaperChecked(false);
    setPartChecked(false);
    setChapterChecked(false);
    setSelectedPaper(null);
    setSelectedPart(null);
    setSelectedChapter(null);
    setSelectedUnit(null);
    setSelectedFile(null);
  };

  const handleUploadClick = async () => {
    if (selectedFile && selectedPaper) {
      setIsUploading(true);
      try {
        await onFileUpload(
          selectedFile,
          selectedPaper,
          partChecked ? selectedPart ?? undefined : undefined,
          chapterChecked ? selectedChapter ?? undefined : undefined,
          selectedUnit!
        );
        // Clear all states after successful upload
        clearAllStates();
        // You might want to show a success message here
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle error - maybe show a notification
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
        setSelectedFile(file);
      } else {
        dispatch(openSnackbarFunction("Please select zip file only!", "warning"));
        // Clear the file input
        event.target.value = '';
      }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Grid
      container
      spacing={gridSpacing}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={10} md={10} lg={8}>
        <MainCard
          title={title}
          content={false}
          sx={{
            overflow: "visible",
            width: { xs: "100%", sm: "600px", md: "700px", lg: "800px" },
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={10} sm={11}>
                    <GetPaperComponent
                      onPaperChange={handlePaperChange}
                      selectedPaper={selectedPaper}
                    />
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <Checkbox
                      checked={paperChecked}
                      onChange={(event) =>
                        setPaperChecked(event.target.checked)
                      }
                      disabled={!selectedPaper}
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: { xs: 28, sm: 38 } },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {paperChecked && selectedPaper && (
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={10} sm={11}>
                      <GetPartComponent
                        onPartChange={handlePartChange}
                        selectedPart={selectedPart}
                        selectedPaper={selectedPaper}
                      />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                      <Checkbox
                        checked={partChecked}
                        onChange={(event) =>
                          setPartChecked(event.target.checked)
                        }
                        disabled={!selectedPart}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: { xs: 28, sm: 38 },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {paperChecked && partChecked && selectedPart && (
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={10} sm={11}>
                      <GetChapterComponent
                        onChapterChange={handleChapterChange}
                        selectedPaper={selectedPaper}
                        selectedPart={selectedPart}
                        selectedChapter={selectedChapter}
                      />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                      <Checkbox
                        checked={chapterChecked}
                        onChange={(event) =>
                          setChapterChecked(event.target.checked)
                        }
                        disabled={!selectedChapter}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: { xs: 28, sm: 38 },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {paperChecked &&
                partChecked &&
                chapterChecked &&
                selectedChapter && (
                  <Grid item xs={12}>
                    <GetUnitComponent
                      onUnitChange={handleUnitChange}
                      selectedPaper={selectedPaper}
                      selectedPart={selectedPart}
                      selectedChapter={selectedChapter}
                      selectedUnit={selectedUnit}
                    />
                  </Grid>
                )}

              <Grid item xs={12}>
                <Input
                  type="file"
                  inputRef={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <Grid
                  container
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={handleAttachClick}
                    disabled={!paperChecked || isUploading}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <SvgIcon sx={{ width: 16, height: 16, mr: 0.3 }}>
                      <path d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"></path>
                    </SvgIcon>
                    Attach File
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
        {selectedFile && selectedPaper && (
          <MainCard sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 500,
                fontSize: 16,
                color: "text.secondary",
              }}
            >
              Selected Paper:{" "}
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 700, fontSize: 16 }}
              >
                {selectedPaper.displayName}
              </Typography>
            </Typography>
            {partChecked && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  fontSize: 16,
                  color: "text.secondary",
                }}
              >
                Selected Part:{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: 700, fontSize: 16 }}
                >
                  {selectedPart?.partName}
                </Typography>
              </Typography>
            )}
            {chapterChecked && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  fontSize: 16,
                  color: "text.secondary",
                }}
              >
                Selected Chapter:{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: 700, fontSize: 16 }}
                >
                  {selectedChapter?.chapterName}
                </Typography>
              </Typography>
            )}
            {selectedUnit && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  fontSize: 16,
                  color: "text.secondary",
                }}
              >
                Selected Unit:{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: 700, fontSize: 16 }}
                >
                  {selectedUnit.unitName}
                </Typography>
              </Typography>
            )}
            {/* <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 500,
                fontSize: 16,
                color: "text.secondary",
              }}
            >
              Selected file:{" "}
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 700, fontSize: 16 }}
              >
                {selectedFile.name}
              </Typography>
            </Typography> */}
            <FilePreview file={selectedFile} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleUploadClick}
                disabled={!paperChecked || isUploading}
                sx={{ mt: 2 }}
                startIcon={<CloudUploadIcon />}
              >
                {isUploading ? "Uploading..." : "Submit"}
              </Button>
            </Box>
          </MainCard>
        )}
      </Grid>
    </Grid>
  );
}

export default QuestionManager;