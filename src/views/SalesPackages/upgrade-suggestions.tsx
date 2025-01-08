// material-ui
"use client";
import {
  Button,
  Grid,
  MainCard,
  TextField,
} from "utils/genericExports/theme-imports";
import { useFormik } from "formik";
import { gridSpacing } from "utils/genericExports/uiComponentsimports";

const UpgradeSuggestions = () => {
  const formik = useFormik({
    initialValues: {
      selectCourseGroup: "",
      salesPackName: "",
      suggestion: "",
    },
    onSubmit: (values) => {},
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <MainCard title="Chose the Excisting Pack">
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    id="selectCourseGroup"
                    name="selectCourseGroup"
                    value={formik.values.selectCourseGroup}
                    onChange={formik.handleChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Select Course Group</option>
                    <option value="group1">Course Group 1</option>
                    <option value="group2">Course Group 2</option>
                    <option value="group3">Course Group 3</option>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid spacing={gridSpacing} sx={{ mt: 2 }}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    id="salesPackName"
                    name="salesPackName"
                    value={formik.values.salesPackName}
                    onChange={formik.handleChange}
                    label="Select the Sales Pack"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=""></option>
                    <option value="pack1">Sales Pack 1</option>
                    <option value="pack2">Sales Pack 2</option>
                    <option value="pack3">Sales Pack 3</option>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Button variant="contained" type="submit">
                  Create Sale Pack
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </form>
      <form onSubmit={formik.handleSubmit}>
        <MainCard title="Chose the Excisting Pack" sx={{ mt: 4 }}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    id="suggestion"
                    name="suggestion"
                    value={formik.values.suggestion}
                    onChange={formik.handleChange}
                    label="Suggestions"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="suggestion1">Suggestion 1</option>
                    <option value="suggestion2">Suggestion 2</option>
                    <option value="suggestion3">Suggestion 3</option>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </form>
    </div>
  );
};
export default UpgradeSuggestions;
