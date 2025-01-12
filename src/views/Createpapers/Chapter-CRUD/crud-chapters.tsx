"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  GET_CHAPTERS,
  GET_PAPERS,
  GET_PARTS,
  PUT_CHAPTERS,
} from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, postAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Paper {
  _id: string;
  displayName: string;
}

interface Part {
  _id: string;
  partName: string;
}

interface Chapter {
  _id: string;
  chapterName: string;
}

const CrudChapters: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [newChapterName, setNewChapterName] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesAndPermissions } = useConfig();

  const fetchPapers = useCallback(async () => {
    try {
      const response = await getAxios({ url: GET_PAPERS });
      setPapers(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch papers", "error"));
    }
  }, [dispatch]);

  const fetchParts = useCallback(async () => {
    if (!selectedPaper) return;
    try {
      const response = await postAxios({
        url: `${GET_PARTS}`,
        values: { paperId: selectedPaper._id },
      });
      setParts(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch parts", "error"));
    }
  }, [selectedPaper, dispatch]);

  const fetchChapters = useCallback(async () => {
    if (!selectedPaper || !selectedPart) return;
    try {
      const response = await postAxios({
        url: `${GET_CHAPTERS}`,
        values: { paperId: selectedPaper._id, partId: selectedPart._id },
      });
      setChapters(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch chapters", "error"));
    }
  }, [selectedPaper, selectedPart, dispatch]);

  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const createPapers = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Create Papers"
      );
      const createPaperFeature = createPapers?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Chapters"
      );
      if (createPaperFeature) {
        setCanEdit(
          createPaperFeature.permissions.allowed.includes("edit")
        );
        setCanDelete(
          createPaperFeature.permissions.allowed.includes("delete")
        );
        setCanCreate(
          createPaperFeature.permissions.allowed.includes("assign")
        );
      }
    }
  }, [rolesAndPermissions]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  useEffect(() => {
    fetchParts();
    setSelectedPart(null);
    setChapters([]);
  }, [fetchParts, selectedPaper]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const handlePaperChange = (event: SelectChangeEvent<string>) => {
    const paperId = event.target.value;
    const paper = papers.find((p) => p._id === paperId);
    setSelectedPaper(paper || null);
    setSelectedPart(null);
  };

  const handlePartChange = (event: SelectChangeEvent<string>) => {
    const partId = event.target.value;
    const part = parts.find((p) => p._id === partId);
    setSelectedPart(part || null);
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setNewChapterName(chapter.chapterName);
    setOpenDialog(true);
  };

  const handleDelete = async (chapterId: string) => {
    if (!selectedPaper || !selectedPart) return;
    try {
      const payload = {
        paperId: selectedPaper._id,
        partId: selectedPart._id,
        chapterId: chapterId,
      };
      await axios({
        method: "delete",
        url: PUT_CHAPTERS,
        data: payload,
      });
      dispatch(openSnackbarFunction("Chapter deleted successfully", "success"));
      fetchChapters();
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete chapter", "error"));
    }
  };

  const handleSave = async () => {
    if (!selectedPaper || !selectedPart || !editingChapter) return;

    try {
      const payload = {
        paperId: selectedPaper._id,
        partId: selectedPart._id,
        chapterId: editingChapter._id,
        chapterName: newChapterName,
      };
      await axios({
        method: "put",
        url: PUT_CHAPTERS,
        data: payload,
      });
      dispatch(openSnackbarFunction("Chapter updated successfully", "success"));
      setOpenDialog(false);
      setEditingChapter(null);
      setNewChapterName("");
      fetchChapters();
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to update chapter", "error"));
    }
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl margin="normal" sx={{ width: "100%" }}>
            <InputLabel>Select Paper</InputLabel>
            <Select
              labelId="paper-select-label"
              value={selectedPaper?._id ?? ""}
              onChange={handlePaperChange}
              label="Select Paper"
            >
              {papers.map((paper) => (
                <MenuItem key={paper._id} value={paper._id}>
                  {paper.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl margin="normal" sx={{ width: "100%" }}>
            <InputLabel>Select Part</InputLabel>
            <Select
              value={selectedPart?._id ?? ""}
              onChange={handlePartChange}
              disabled={!selectedPaper}
            >
              {parts.map((part) => (
                <MenuItem key={part._id} value={part._id}>
                  {part.partName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/createpapers/create-new-chapters")}
            disabled={!selectedPart && !canCreate}
          >
            Create New Chapters
          </Button>
        </Grid>
      </Grid>

      {chapters.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chapter Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chapters.map((chapter) => (
                <TableRow key={chapter._id}>
                  <TableCell>{chapter.chapterName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(chapter)} disabled={!canEdit}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(chapter._id)} disabled={!canDelete}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Chapter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chapter Name"
            type="text"
            fullWidth
            value={newChapterName}
            onChange={(e) => setNewChapterName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudChapters;