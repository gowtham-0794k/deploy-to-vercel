"use client";
import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MainCard,
  Stack,
} from "utils/genericExports/theme-imports";
import { gridSpacing } from "store/constant";
import { CREATE_GROUP } from "shared/constants/routerUrls";
import { postAxios } from "shared";
import { dispatch } from "store";
import { openSnackbarFunction } from "utils/utils";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState(""),
    handleSave = async () => {
      try {
        const groupPayload = {
            groupName: groupName,
          },
          groupResponse = await postAxios({
            url: CREATE_GROUP,
            values: groupPayload,
          });
        setGroupName("");
        dispatch(
          openSnackbarFunction(groupResponse?.data?.message, "success")
        );
      } catch (error: any) {
        dispatch(openSnackbarFunction(error?.response?.data?.error, "error"));
      }
    };

  return (
    <Grid container spacing={gridSpacing} justifyContent="center">
      <Grid item md={6}>
        <MainCard sx={{ height: "100%" }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Name of The Group"
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Grid item xs={12} style={{ marginTop: "8px" }}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
              >
                Save
              </Button>
            </Stack>
          </Grid>
        </MainCard>
      </Grid>
      {/* <Grid item xs={12} md={4}>
        <MainCard
          title="Select the courses for the level"
          sx={{ height: "100%" }}
        >
          <TreeView
            aria-label="customized"
            defaultExpanded={["1"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
          >
            <StyledTreeItem nodeId="3" label="Select The Courses">
              <StyledTreeItem nodeId="6" label="Hello" />
              <StyledTreeItem nodeId="7" label="Select The level">
                <StyledTreeItem nodeId="9" label="Level  1" />
                <StyledTreeItem nodeId="10" label="Level 2" />
                <StyledTreeItem nodeId="11" label="Level 3" />
              </StyledTreeItem>
              <StyledTreeItem nodeId="8" label="Hello" />
            </StyledTreeItem>
            <StyledTreeItem nodeId="4" label="World" />
          </TreeView>
        </MainCard>
      </Grid> */}
    </Grid>
  );
};
export default CreateGroup;
