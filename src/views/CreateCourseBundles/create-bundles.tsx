"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  SearchIcon,
  Button,
  Autocomplete,
  InputAdornment,
  Chip,
  MainCard,
  MenuItem,
  Stack,
} from "utils/genericExports/theme-imports";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAxios, postAxios } from "shared";
import {
  ADD_PACKAGES,
  DUPLICATE_PACK_NAME,
  GET_GROUPS,
  GET_PAPERS,
} from "shared/constants/routerUrls";
import { dispatch } from "store";
import { openSnackbarFunction } from "utils/utils";
import { EnhancedTableHeadBundle } from "./EnancedTable";

const CreateBundles = () => {
  const [showFeatureTable, setShowFeatureTable] = useState(false),
    [showAddPapers, setShowAddPapers] = useState(false),
    [groups, setGroups] = useState<any>([]),
    [papers, setPapers] = useState<any>([]),
    formik = useFormik({
      initialValues: {
        groupValue: "",
        packName: "",
        selectedPapers: [],
      },
      validationSchema: Yup.object({
        groupValue: Yup.string().required("Group is required"),
        packName: Yup.string().required("Pack name is required"),
        selectedPapers: Yup.array().min(
          1,
          "At least one paper must be selected"
        ),
      }),
      onSubmit: () => {},
    }),
    getInitialResponse = async () => {
      const groupResponse = await getAxios({ url: GET_GROUPS });
      setGroups(groupResponse?.data);
      const getPapers = await getAxios({ url: GET_PAPERS });
      setPapers(getPapers?.data);
    },
    handlePack = async () => {
      const value = formik.values;
      try {
        const packResponse = await getAxios({
          url: `${DUPLICATE_PACK_NAME}/${value?.groupValue}?packageName=${value?.packName}`,
        });
        if (packResponse?.data?.isDuplicate) {
          dispatch(
            openSnackbarFunction(
              "Package Name already exist !",
              "error"
            )
          );
        } else {
          dispatch(
            openSnackbarFunction(
              "Package Name is created successfully.",
              "success"
            )
          );
          setShowAddPapers(true);
        }
      } catch (error) {
        dispatch(
          openSnackbarFunction(
            "Group Name Not Found !",
            "error"
          )
        );
      }
    },
    postPack = async (items: any) => {
      const payload = {
        packageName: formik.values.packName,
        papers: items.map((el: any) => ({
          paper_id: el._id,
          features: el.features,
        })),
      };
      await postAxios({
        url: `${ADD_PACKAGES}/${formik.values.groupValue}`,
        values: payload,
      });
    };

  useEffect(() => {
    getInitialResponse();
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <MainCard title="Create Packs">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  id="groupValue"
                  name="groupValue"
                  label="Group of bundles"
                  value={formik.values.groupValue || ""}
                  onChange={formik.handleChange}
                >
                  {groups.map((group: any) => (
                    <MenuItem key={group?._id} value={group?._id}>
                      {group?.groupName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="packName"
                    name="packName"
                    label="Pack Name"
                    value={formik.values.packName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.packName && Boolean(formik.errors.packName)
                    }
                    helperText={
                      formik.touched.packName && formik.errors.packName
                    }
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "8px" }}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlePack}
                    disabled={
                      !formik.values.groupValue || !formik.values.packName
                    }
                  >
                    Add Paper
                  </Button>
                </Stack>
              </Grid>
            </MainCard>
            {showAddPapers && (
              <MainCard title="Add Papers" sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="selectedPapers"
                    options={papers}
                    filterSelectedOptions
                    disableListWrap
                    freeSolo
                    value={formik.values.selectedPapers}
                    onChange={(_, value) => {
                      formik.setFieldValue("selectedPapers", value);
                    }}
                    getOptionLabel={(option: any) => option.displayName}
                    isOptionEqualToValue={(option: any, value: any) => {
                      return value._id === option._id;
                    }}
                    renderOption={(props, option: any) => (
                      <li {...props} key={option._id}>
                        {option.displayName}
                      </li>
                    )}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option: any, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option._id}
                          label={option.displayName}
                        />
                      ));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Search Papers"
                        error={
                          formik.touched.selectedPapers &&
                          Boolean(formik.errors.selectedPapers)
                        }
                        helperText={
                          formik.touched.selectedPapers &&
                          formik.errors.selectedPapers
                        }
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: "8px" }}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={!formik.values.selectedPapers.length}
                      onClick={() => setShowFeatureTable(true)}
                    >
                      Add Feature
                    </Button>
                  </Stack>
                </Grid>
              </MainCard>
            )}
            {showFeatureTable && (
              <MainCard title="Add Features to Each Paper" sx={{ mt: 5 }}>
                <EnhancedTableHeadBundle
                  papers={formik.values.selectedPapers}
                  onChange={(event: any) => {
                    postPack(event);
                  }}
                />
              </MainCard>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CreateBundles;
