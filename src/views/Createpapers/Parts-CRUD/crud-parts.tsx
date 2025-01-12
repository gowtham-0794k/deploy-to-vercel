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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { GET_PAPERS, PUT_PARTS } from "shared/constants/routerUrls";
import { useDispatch } from "react-redux";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, putAxios } from "shared";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConfig from "hooks/useConfig";

interface Part {
  _id: string;
  partName: string;
}

interface Paper {
  _id: string;
  displayName: string;
  parts: Part[];
}

const CrudParts: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [newPartName, setNewPartName] = useState("");
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

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const createPapers = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Create Papers"
      );
      const createPaperFeature = createPapers?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Parts"
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

  const handlePaperChange = (event: SelectChangeEvent<string>) => {
    const paperId = event.target.value;
    const paper = papers.find(p => p._id === paperId);
    setSelectedPaper(paper || null);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setNewPartName(part.partName);
    setOpenDialog(true);
  };

  const handleDelete = async (partId: string) => {
    if (!selectedPaper) return;
    try {
      const payload = { paperId: selectedPaper._id, partId: partId };
      await axios({
        method: 'delete',
        url: PUT_PARTS,
        data: payload
      });
      dispatch(openSnackbarFunction('Part deleted successfully', 'success'));
      
      // Update the selectedPaper state to reflect the changes
      setSelectedPaper(prevPaper => {
        if (!prevPaper) return null;
        const filteredParts = prevPaper.parts.filter(p => p._id !== partId);
        return {
          ...prevPaper,
          parts: filteredParts
        };
      });
    } catch (error) {
      dispatch(openSnackbarFunction('Failed to delete part', 'error'));
    }
  };

  const handleSave = async () => {
    if (!selectedPaper || !editingPart) return;
  
    try {
      await putAxios({
        url: `${PUT_PARTS}`,
        values: { paperId: selectedPaper._id, partId: editingPart._id, partName: newPartName }
      });
      dispatch(openSnackbarFunction('Part updated successfully', 'success'));
      setOpenDialog(false);
      setEditingPart(null);
      setNewPartName("");
  
      // Update the selectedPaper state to reflect the changes
      setSelectedPaper(prevPaper => {
        if (!prevPaper) return null;
        return {
          ...prevPaper,
          parts: prevPaper.parts.map(part => 
            part._id === editingPart._id ? { ...part, partName: newPartName } : part
          )
        };
      });
  
      // Optionally, still fetch papers to ensure consistency with the server
      fetchPapers();
    } catch (error) {
      dispatch(openSnackbarFunction('Failed to update part', 'error'));
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl margin="normal" sx={{ width: 300 }}>
          <InputLabel id="paper-select-label">Select Paper</InputLabel>
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/createpapers/create-new-parts")}
          disabled={!selectedPaper && !canCreate}
        >
          Create New Part
        </Button>
      </Stack>

      {selectedPaper && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Part Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedPaper.parts.map((part) => (
                <TableRow key={part._id}>
                  <TableCell>{part.partName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(part)} disabled={!canEdit}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(part._id)} disabled={!canDelete}>
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
        <DialogTitle>Edit Part</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Part Name"
            fullWidth
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
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

export default CrudParts;