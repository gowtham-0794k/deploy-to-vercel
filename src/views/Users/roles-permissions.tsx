"use client";
import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import {
  Button,
  Checkbox,
  Grid,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "utils/genericExports/theme-imports";
import { postAxios } from "shared";
import {
  USER_ROLES_AND_PERMISSIONS,
  UPDATE_ROLES_AND_PERMISSIONS,
} from "shared/constants/routerUrls";
import { Formik } from "formik";
import { InputWithLabel } from "components/meraMaster";
import { putAxios } from "shared/services/generic";

const EnhancedTableHead = (props: any) => {
  const { data } = props,
    permissions = ["View", "Edit", "Assign", "Deactivate", "Delete"],
    userId = data[0]?.user_id,
    getAllFeatures = data[0]?.permissions?.features
      ?.map((el: any) =>
        el?.subFeatures?.map((childEl: any) => ({
          ...childEl,
          ...{
            featureId: el?.featureId,
            featureName: el?.featureName,
          },
        }))
      )
      .flat(1),
    getAllowedPermissions = (name: string, permissions: any) => {
      const allowedFind = permissions?.allowed?.find(
        (el: string) => el === name?.toLowerCase()
      );
      return allowedFind;
    },
    getDeniedPermissions = (name: string, permissions: any) => {
      const deniedFind = permissions?.denied?.find(
        (el: string) => el === name?.toLowerCase()
      );
      return deniedFind ?? false;
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {permissions.map((permission, index) => (
          <TableCell key={index} align="center">
            {permission}
          </TableCell>
        ))}
      </TableRow>

      {getAllFeatures.map((item: any, index: number) => (
        <TableRow key={index}>
          <TableCell sx={{ minWidth: "16rem", fontSize: "1.1rem" }}>
            {item?.subFeatureName}
          </TableCell>
          {permissions.map((childItem: any, permIndex: number) => {
            return (
              <TableCell key={permIndex} align="center">
                <Checkbox
                  color="primary"
                  checked={getAllowedPermissions(childItem, item?.permissions)}
                  disabled={getDeniedPermissions(childItem, item?.permissions)}
                  onChange={(event) => {
                    getAllowedPermissions(childItem, item?.permissions);
                    props?.onChange?.(
                      item,
                      childItem,
                      event.target.checked,
                      userId
                    );
                  }}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableHead>
  );
};

const TextFieldPage = () => {
  const [userName, setUserName] = useState(""),
    [dense] = React.useState(false),
    [rolesAndPermissions, setRolesAndPermissions] = React.useState([]),
    handleSearch = async (values: any) => {
      const payload = { inItems: Object.values(values) };
      const inviteResponse = await postAxios({
        url: USER_ROLES_AND_PERMISSIONS,
        values: payload,
      });
      const { first_name, last_name, rolesAndPermissions } =
        inviteResponse.data.user[0];
      setRolesAndPermissions(rolesAndPermissions);
      setUserName(first_name + " " + last_name);
    };

  const initialValues = {
    userName: "",
    email: "",
    phoneNumber: "",
  };

  const changeValuesInResponse = async (
    parent: any,
    value: any,
    checkedValue: boolean,
    userId: string
  ) => {
    const payload = {
      id: parent?._id,
      value: value.toLowerCase(),
      type: checkedValue ? "add" : "remove",
      userId: userId,
    };
    try {
      const inviteResponse = await putAxios({
        url: UPDATE_ROLES_AND_PERMISSIONS,
        values: payload,
      });
      if (inviteResponse) {
        let permissions: any = [];
        permissions.push(inviteResponse?.data?.data);
        setRolesAndPermissions(permissions);
      }
    } catch (error) {
      console.log("something went wrong !");
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSearch}>
        {({ values, handleSubmit, handleBlur, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <MainCard title="Search Users">
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={4}>
                  <InputWithLabel
                    label="Name"
                    id="userName"
                    placeholder="User Name"
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    required={false}
                  />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <InputWithLabel
                    label="Email"
                    id="email"
                    placeholder="Email"
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    required={false}
                  />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <InputWithLabel
                    label="Phone Number"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    required={false}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "8px" }}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button type="submit" variant="contained" color="secondary">
                    Search Users
                  </Button>
                </Stack>
              </Grid>
            </MainCard>
          </form>
        )}
      </Formik>
      <div style={{ marginTop: "8px" }}>
        {rolesAndPermissions?.length && (
          <>
            <MainCard
              title={`Name of a User : ${userName}`}
              content={false}
              style={{ marginBottom: "8px" }}
            ></MainCard>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MainCard content={false} title="Feature Access Table">
                  <TableContainer sx={{ flexGrow: 1 }}>
                    <Table
                      aria-labelledby="tableTitle"
                      size={dense ? "small" : "medium"}
                    >
                      <EnhancedTableHead
                        data={rolesAndPermissions}
                        onChange={(
                          parent: any,
                          child: any,
                          checkedValue: boolean,
                          userId: any
                        ) => {
                          changeValuesInResponse(
                            parent,
                            child,
                            checkedValue,
                            userId
                          );
                        }}
                      />
                    </Table>
                  </TableContainer>

                  <Grid item xs={12} style={{ margin: "8px" }}>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                      spacing={2}
                    >
                      <Button variant="contained" color="secondary">
                        Update Feature Role
                      </Button>
                    </Stack>
                  </Grid>
                </MainCard>
              </Grid>

              {/* <Grid item xs={12}>
                <MainCard
                  content={false}
                  title={
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <div>Course Access Table</div>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          select
                          label="Select Course"
                          variant="outlined"
                          sx={{ minWidth: 200 }}
                          size="small"
                        >
                          <MenuItem value="course1">Course 1</MenuItem>
                          <MenuItem value="course2">Course 2</MenuItem>
                          <MenuItem value="course3">Course 3</MenuItem>
                        </TextField>
                        <TextField
                          select
                          label="Select Paper"
                          variant="outlined"
                          sx={{ minWidth: 200 }}
                          size="small"
                        >
                          <MenuItem value="paper1">Paper 1</MenuItem>
                          <MenuItem value="paper2">Paper 2</MenuItem>
                          <MenuItem value="paper3">Paper 3</MenuItem>
                        </TextField>
                      </Stack>
                    </Stack>
                  }
                >
                  <TableContainer sx={{ flexGrow: 1 }}>
                    <Table aria-labelledby="tableTitle">
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        displayType="features"
                      />
                    </Table>
                  </TableContainer>
                  <Grid item xs={12} style={{ margin: "8px" }}>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                      spacing={2}
                    >
                      <Button variant="contained" color="secondary">
                        Update Course Role
                      </Button>
                    </Stack>
                  </Grid>
                </MainCard>
              </Grid> */}
            </Grid>
          </>
        )}
      </div>
    </>
  );
};
export default TextFieldPage;
