"use client";
import React, { useEffect, useState } from "react";
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
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { GET_PAPERS } from "shared/constants/routerUrls";
import { useDispatch } from "store";
import { openSnackbarFunction } from "utils/utils";
import { getAxios, putAxios, deleteAxios } from "shared";
import { useRouter } from "next/navigation";
import useConfig from "hooks/useConfig";
interface Paper {
  _id: string;
  referenceName: string;
  displayName: string;
}

const CrudPapers: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [newPaper, setNewPaper] = useState({
    referenceName: "",
    displayName: "",
  });
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesAndPermissions } = useConfig();

  const fetchPapers = async () => {
    try {
      const response = await getAxios({ url: GET_PAPERS });
      setPapers(response.data);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch papers", "error"));
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    if (rolesAndPermissions?.permissions) {
      const createPapers = rolesAndPermissions.permissions?.features?.find(
        (feature: any) => feature.featureName === "Create Papers"
      );
      const createPaperFeature = createPapers?.subFeatures?.find(
        (subFeature: any) => subFeature.subFeatureName === "Create Papers"
      );
      if (createPaperFeature) {
        setCanEdit(createPaperFeature.permissions.allowed.includes("edit"));
        setCanDelete(createPaperFeature.permissions.allowed.includes("delete"));
        setCanCreate(createPaperFeature.permissions.allowed.includes("assign"));
      }
    }
  }, [rolesAndPermissions]);

  const handleEdit = (paper: Paper) => {
    setEditingPaper(paper);
    setNewPaper({
      referenceName: paper.referenceName,
      displayName: paper.displayName,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAxios({ url: `${GET_PAPERS}/${id}` });
      dispatch(openSnackbarFunction("Paper deleted successfully", "success"));
      fetchPapers();
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to delete paper", "error"));
    }
  };

  const handleSave = async () => {
    try {
      if (editingPaper) {
        await putAxios({
          url: `${GET_PAPERS}/${editingPaper._id}`,
          values: newPaper,
        });
        dispatch(openSnackbarFunction("Paper updated successfully", "success"));
      }
      setOpenDialog(false);
      setEditingPaper(null);
      setNewPaper({ referenceName: "", displayName: "" });
      fetchPapers();
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to save paper", "error"));
    }
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/createpapers/create-new-papers")}
          disabled={!canCreate}
        >
          Create New Paper
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference Name</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper._id}>
                <TableCell>{paper.referenceName}</TableCell>
                <TableCell>{paper.displayName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(paper)}
                    disabled={!canEdit}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(paper._id)}
                    disabled={!canDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Paper</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reference Name"
            fullWidth
            value={newPaper.referenceName}
            onChange={(e) =>
              setNewPaper({ ...newPaper, referenceName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Display Name"
            fullWidth
            value={newPaper.displayName}
            onChange={(e) =>
              setNewPaper({ ...newPaper, displayName: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CrudPapers;
