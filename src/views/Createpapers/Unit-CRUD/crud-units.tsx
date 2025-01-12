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
  Stack,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  GET_PAPERS,
  GET_PARTS,
  GET_CHAPTERS,
  BASE_URL,
  PUT_UNITS,
} from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, postAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Unit {
  _id: string;
  unitName: string;
}

interface Chapter {
  _id: string;
  chapterName: string;
}

interface Part {
  _id: string;
  partName: string;
}

interface Paper {
  _id: string;
  displayName: string;
}

const CrudUnits: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [newUnitName, setNewUnitName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesAndPermissions } = useConfig();

  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAxios({ url: GET_PAPERS });
      setPapers(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch papers", "error"));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const fetchParts = useCallback(async () => {
    if (!selectedPaperId) return;
    setIsLoading(true);
    try {
      const response = await postAxios({
        url: GET_PARTS,
        values: { paperId: selectedPaperId },
      });
      setParts(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch parts", "error"));
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaperId, dispatch]);

  const fetchChapters = useCallback(async () => {
    if (!selectedPaperId || !selectedPartId) return;
    setIsLoading(true);
    try {
      const response = await postAxios({
        url: GET_CHAPTERS,
        values: { paperId: selectedPaperId, partId: selectedPartId },
      });
      setChapters(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch chapters", "error"));
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaperId, selectedPartId, dispatch]);

  const fetchUnits = useCallback(async () => {
    if (!selectedPaperId || !selectedPartId || !selectedChapterId) return;
    setIsLoading(true);
    try {
      const unitResponse = await postAxios({
        url: `${BASE_URL}/unitsByPaperPartChapter`,
        values: {
          paperId: selectedPaperId,
          partId: selectedPartId,
          chapterId: selectedChapterId,
        },
      });
      setUnits(unitResponse.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch units", "error"));
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaperId, selectedPartId, selectedChapterId, dispatch]);

useEffect(() => {
  if (rolesAndPermissions?.permissions) {
    const createPapers = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Create Papers"
      );
      const createPaperFeature = createPapers?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Units"
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
  }, [fetchParts]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handlePaperChange = (event: SelectChangeEvent<string>) => {
    const paperId = event.target.value;
    setSelectedPaperId(paperId);
    setSelectedPartId("");
    setSelectedChapterId("");
    setParts([]);
    setChapters([]);
    setUnits([]);
  };

  const handlePartChange = (event: SelectChangeEvent<string>) => {
    const partId = event.target.value;
    setSelectedPartId(partId);
    setSelectedChapterId("");
    setChapters([]);
    setUnits([]);
  };

  const handleChapterChange = (event: SelectChangeEvent<string>) => {
    const chapterId = event.target.value;
    setSelectedChapterId(chapterId);
    setUnits([]);
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setNewUnitName(unit.unitName);
    setOpenDialog(true);
  };

  const handleDelete = async (unitId: string) => {
    if (!selectedPaperId || !selectedPartId || !selectedChapterId) return;
    setIsLoading(true);
    try {
      const payload = {
        paperId: selectedPaperId,
        partId: selectedPartId,
        chapterId: selectedChapterId,
        unitId: unitId,
      };
      await axios({
        method: "delete",
        url: PUT_UNITS,
        data: payload,
      });
      dispatch(openSnackbarFunction("Unit deleted successfully", "success"));
      fetchUnits();
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete unit", "error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (
      !selectedPaperId ||
      !selectedPartId ||
      !selectedChapterId ||
      !editingUnit
    )
      return;
    setIsLoading(true);
    try {
      const payload = {
        paperId: selectedPaperId,
        partId: selectedPartId,
        chapterId: selectedChapterId,
        unitId: editingUnit._id,
        unitName: newUnitName,
      };
      await axios({
        method: "put",
        url: PUT_UNITS,
        data: payload,
      });
      dispatch(openSnackbarFunction("Unit updated successfully", "success"));
      setOpenDialog(false);
      setEditingUnit(null);
      setNewUnitName("");
      fetchUnits();
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to update unit", "error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FormControl fullWidth>
          <InputLabel id="paper-select-label">Select Paper</InputLabel>
          <Select
            labelId="paper-select-label"
            value={selectedPaperId}
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
        <FormControl fullWidth>
          <InputLabel id="part-select-label">Select Part</InputLabel>
          <Select
            labelId="part-select-label"
            value={selectedPartId}
            onChange={handlePartChange}
            label="Select Part"
            disabled={!selectedPaperId}
          >
            {parts.map((part) => (
              <MenuItem key={part._id} value={part._id}>
                {part.partName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="chapter-select-label">Select Chapter</InputLabel>
          <Select
            labelId="chapter-select-label"
            value={selectedChapterId}
            onChange={handleChapterChange}
            label="Select Chapter"
            disabled={!selectedPartId}
          >
            {chapters.map((chapter) => (
              <MenuItem key={chapter._id} value={chapter._id}>
                {chapter.chapterName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/createpapers/create-new-units")}
        disabled={!selectedChapterId && !canCreate}
        sx={{ mb: 2 }}
      >
        Create New Unit
      </Button>

      {isLoading ? (
        <CircularProgress />
      ) : (
        selectedChapterId && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Unit Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {units?.map((unit) => (
                  <TableRow key={unit._id}>
                    <TableCell>{unit.unitName}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(unit)} disabled={!canEdit}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(unit._id)} disabled={!canDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Unit Name"
            fullWidth
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudUnits;