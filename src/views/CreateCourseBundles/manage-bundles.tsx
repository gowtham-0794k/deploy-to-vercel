"use client";
import {
  Grid,
  TextField,
  Button,
  MainCard,
  Stack,
  MenuItem,
} from "utils/genericExports/theme-imports";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAxios } from "shared";
import {
  GET_GROUPS,
  GET_PACKAGES,
  GET_PAPERS_PACK,
  UPDATE_PACKAGE_FEATURES,
} from "shared/constants/routerUrls";
import { EnhancedTableHeadBundle } from "./EnancedTable";
import { putAxios } from "shared/services/generic";

const CreateBundles = () => {
  const [groups, setGroups] = useState<any>([]),
    [packages, setPackages] = useState<any>([]),
    [papers, setPapers] = useState<any>([]),
    formik = useFormik({
      initialValues: {
        selectedGroup: "",
        selectedPackage: "",
      },
      validationSchema: Yup.object({
        selectedGroup: Yup.string().required("Group is required"),
        selectedPackage: Yup.string().required("Group is required"),
      }),
      onSubmit: () => {
        getPapersResponse();
      },
    }),
    getInitialResponse = async () => {
      const groupResponse = await getAxios({ url: GET_GROUPS });
      setGroups(groupResponse?.data);
    },
    getPackagesResponse = async () => {
      const getPackages = await getAxios({
        url: `${GET_PACKAGES}/${formik.values.selectedGroup}`,
      });
      setPackages(getPackages?.data?.packages);
    },
    getPapersResponse = async () => {
      const getFeaturesAndPapers = await getAxios({
        url: `${GET_PAPERS_PACK}/${formik.values.selectedGroup}/${formik.values.selectedPackage}`,
      });
      setPapers(getFeaturesAndPapers?.data?.features?.result?.[0]?.papers);
    },
    updatePack = async (values: any) => {
      await putAxios({
        url: `${UPDATE_PACKAGE_FEATURES}/${formik.values.selectedGroup}/${formik.values.selectedPackage}`,
        values: values,
      });
    };

  useEffect(() => {
    getInitialResponse();
  }, []);

  useEffect(() => {
    if (formik.values.selectedGroup) getPackagesResponse();
  }, [formik.values.selectedGroup]);

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <MainCard title="Manage Bundles">
            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  id="selectedGroup"
                  name="selectedGroup"
                  label="Select Group"
                  value={formik.values.selectedGroup || ""}
                  onChange={formik.handleChange}
                >
                  {groups.map((group: any) => (
                    <MenuItem key={group?._id} value={group?._id}>
                      {group?.groupName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    id="selectedPackage"
                    name="selectedPackage"
                    label="Select Package"
                    value={formik.values.selectedPackage || ""}
                    onChange={formik.handleChange}
                  >
                    {packages.map((group: any) => (
                      <MenuItem key={group?._id} value={group?._id}>
                        {group?.packageName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "8px" }}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={
                      !formik.values.selectedGroup ||
                      !formik.values.selectedPackage
                    }
                  >
                    Modify
                  </Button>
                </Stack>
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
      {papers?.length !== 0 && (
        <MainCard title="Add Features to Each Paper" sx={{ mt: 5 }}>
          <EnhancedTableHeadBundle
            papers={papers}
            type="edit"
            onChange={(event: any) => {
              updatePack(event);
            }}
          />
        </MainCard>
      )}
    </>
  );
};
export default CreateBundles;
