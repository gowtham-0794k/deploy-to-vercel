"use client";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import Button from "@mui/material/Button";
import { Formik, Form } from "formik";
import {
  MenuItem,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "utils/genericExports/theme-imports";
import { useEffect, useState } from "react";
import { getAxios, postAxios } from "shared";
import {
  GET_GROUPS,
  GET_ORGS,
  GET_SALES_PACKS,
  POST_ASSIGN_PACK,
} from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "react-redux";
import { Checkbox, Paper, TableBody } from "@mui/material";

interface AssignCourseValues {
  selectOrganisation: string;
  selectGroup: string;
}

function AssignCourse() {
  const initialValues = {
      selectOrganisation: "",
      selectGroup: "",
    },
    [organizations, setOrganizations] = useState<any[]>([]),
    [salesPack, setSalesPack] = useState<any[]>([]),
    [groups, setGroups] = useState<any>([]),
    [selected, setSelected] = useState<any>([]),
    [salesPackBasedOnId, setSalesPackBasedOnId] = useState<any>([]),
    [formValues, setFormValues] = useState<any>([]),
    dispatch = useDispatch(),
    getOrganizations = async () => {
      try {
        const organizationResponse = await getAxios({ url: GET_ORGS });
        setOrganizations(organizationResponse?.data?.entities || []);
      } catch (error) {
        dispatch(
          openSnackbarFunction("Failed to fetch organizations", "error")
        );
      }
    },
    getSalesPackages = async () => {
      try {
        const salesPackResponse = await getAxios({ url: GET_SALES_PACKS });
        setSalesPack(salesPackResponse?.data || []);
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch sales pack", "error"));
      }
    },
    getGroups = async () => {
      try {
        const groupResponse = await getAxios({ url: GET_GROUPS });
        setGroups(groupResponse?.data);
      } catch (error) {
        dispatch(
          openSnackbarFunction("Failed to fetch bundle groups", "error")
        );
      }
    },
    handleSubmit = (values: AssignCourseValues) => {
      setFormValues(values);
      const filteritems = salesPack.filter((pack) =>
        pack.selectCourseGroup.includes(values.selectGroup)
      );
      setSalesPackBasedOnId(filteritems);
    },
    handleCheckboxChange = (id: any) => {
      setSelected((prevSelected: any) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item: any) => item !== id)
          : [...prevSelected, id]
      );
    },
    isAllSelected =
      selected.length === salesPackBasedOnId.length &&
      salesPackBasedOnId.length > 0,
    handleSelectAllChange = (event: any) => {
      if (event.target.checked) {
        const allIds = salesPackBasedOnId.map((item: any) => item._id);
        setSelected(allIds);
      } else {
        setSelected([]);
      }
    },
    handleAssign = async () => {
      const payload = {
        SelectedPacks: selected,
        selectOrganisation: formValues.selectOrganisation,
        selectGroup: formValues.selectGroup,
      };
      try {
        await postAxios({
          url: POST_ASSIGN_PACK,
          values: payload,
        });
        dispatch(
          openSnackbarFunction("Successfully created assign pack", "success")
        );
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to assign pack", "error"));
      }
    };

  useEffect(() => {
    getOrganizations();
    getSalesPackages();
    getGroups();
  }, []);

  return (
    <div>
      <Grid
        container
        spacing={gridSpacing}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <MainCard>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, handleChange }) => (
                <Form>
                  <Grid item xs={12} spacing={2}>
                    <TextField
                      fullWidth
                      id="selectOrganisation"
                      name="selectOrganisation"
                      label=" Select Organisation"
                      select
                      value={values.selectOrganisation}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    >
                      {organizations.map((org) => (
                        <MenuItem key={org._id} value={org._id}>
                          {org.organizationName}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="selectGroup"
                        name="selectGroup"
                        label=" Select Group"
                        select
                        value={values.selectGroup}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                      >
                        {groups.map((group: any) => (
                          <MenuItem key={group?._id} value={group?._id}>
                            {group?.groupName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          Submit
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </MainCard>
        </Grid>
      </Grid>
      {salesPackBasedOnId?.length !== 0 && (
        <Grid
          container
          spacing={gridSpacing}
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "8px" }}
        >
          <Grid item xs={12}>
            <MainCard>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < salesPackBasedOnId.length
                          }
                          onChange={handleSelectAllChange}
                        />
                      </TableCell>
                      <TableCell>Sales Pack Name</TableCell>
                      <TableCell>Free or Paid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesPackBasedOnId.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Checkbox
                            checked={selected.includes(item._id)}
                            onChange={() => handleCheckboxChange(item._id)}
                          />
                        </TableCell>
                        <TableCell>{item.nameSalesPack}</TableCell>
                        <TableCell>{item.FreePack ? "Free" : "Paid"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAssign}
              >
                Assign
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
export default AssignCourse;
