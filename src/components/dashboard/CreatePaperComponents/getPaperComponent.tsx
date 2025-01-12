"use client";

import { MenuItem, TextField } from "utils/genericExports/theme-imports";
import { useEffect, useState } from "react";
import { getAxios } from "shared";
import { useDispatch } from "store";
import { openSnackbarFunction } from "utils/utils";
import { GET_PAPERS } from "shared/constants/routerUrls";


export interface Paper {
  _id: string;
  displayName: string;
}

interface GetPaperComponentProps {
  onPaperChange: (paper: Paper | null) => void;
  selectedPaper?: Paper | null;
  onItemChangeName?: (displayName: string | undefined) => void;
}

const GetPaperComponent: React.FC<GetPaperComponentProps> = ({
  onPaperChange,
  selectedPaper = null,
}) => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const dispatch = useDispatch();

  const getPapers = async () => {
    try {
      const paperResponse = await getAxios({ url: GET_PAPERS });
      setPapers(paperResponse?.data || []);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch papers", "error"));
    }
  };

  useEffect(() => {
    getPapers();
  }, []);

  const handlePaperChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPaperId = event.target.value;
    const paper = papers.find((paper) => paper._id === selectedPaperId);
    onPaperChange(paper || null);
  };

  return (
    <div>
      <TextField
        select
        fullWidth
        label="Select Paper"
        placeholder="Select Paper"
        margin="none"
        name="paperName"
        value={selectedPaper?._id || ""}
        onChange={handlePaperChange}
        sx={{ mb: 2 }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              style: {
                maxHeight: 200,
                width: 250,
              },
            },
          },
        }}
      >
        {papers.map((paper) => (
          <MenuItem key={paper._id} value={paper._id}>
            {paper.displayName}
          </MenuItem>
        ))}
      </TextField>
     
    </div>
  );
};

export default GetPaperComponent;
