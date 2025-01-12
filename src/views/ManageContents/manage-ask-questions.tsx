"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/SaveTwoTone";
import { getAxios } from "shared";
import {
  GET_ADMIN_AI_SERVICES,
  GET_COURSE_BY_ORGID,
  GET_ORGS,
  GET_PAPERS,
} from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useDispatch } from "store";

type FormValues = {
  orgId: string;
  course: string;
  paper: string;
  serviceProvider: string;
  modelName: string;
  temperature: number;
  contextLength: string;
  systemInstruction?: string;
};

interface EntityWithId {
  _id: string;
  [key: string]: any;
}

const validationSchema = Yup.object().shape({
  orgId: Yup.string().required("Organization is required"),
  course: Yup.string().required("Course is required"),
  paper: Yup.string().required("Paper is required"),
  serviceProvider: Yup.string().required("Service Provider is required"),
  modelName: Yup.string().required("Model Name is required"),
  temperature: Yup.number().min(0).max(100).required("Temperature is required"),
  contextLength: Yup.string().required("Context Length is required"),
});

const initialValues: FormValues = {
  orgId: "",
  course: "",
  paper: "",
  serviceProvider: "",
  modelName: "",
  temperature: 10,
  contextLength: "",
  systemInstruction: "",
};

const FormSelect: React.FC<{
  name: string;
  label: string;
  options: EntityWithId[];
  nameKey?: string;
  onChange?: (value: string) => void;
}> = ({ name, label, options, nameKey = "name", onChange }) => (
  <Field name={name}>
    {({ field, meta: { touched, error } }: any) => (
      <FormControl fullWidth sx={{ mb: 2 }} error={touched && !!error}>
        <InputLabel>{label}</InputLabel>
        <Select
          {...field}
          label={label}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            field.onChange(e);
            onChange?.(e.target.value);
          }}
        >
          {options.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option[nameKey]}
            </MenuItem>
          ))}
        </Select>
        {touched && error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )}
  </Field>
);

const ManageAskQuestions: React.FC = () => {
  const [organizations, setOrganizations] = useState<EntityWithId[]>([]);
  const [papers, setPapers] = useState<EntityWithId[]>([]);
  const [courses, setCourses] = useState<EntityWithId[]>([]);
  const [llmServiceProviders, setLlmServiceProviders] = useState<any[]>([]);
  const [llmModelNames, setLlmModelNames] = useState<string[]>([]);
  const dispatch = useDispatch();

  const fetchData = useCallback(
    async (url: string, setter: Function, errorMessage: string) => {
      try {
        const response = await getAxios({ url });
        setter(response.data.entities || response.data);
      } catch (error) {
        dispatch(
          openSnackbarFunction(`Failed to fetch ${errorMessage}`, "error")
        );
      }
    },
    [dispatch]
  );

  const fetchCourses = useCallback(
    (orgId: string) =>
      fetchData(`${GET_COURSE_BY_ORGID}/${orgId}`, setCourses, "courses"),
    [fetchData]
  );

  useEffect(() => {
    fetchData(GET_ORGS, setOrganizations, "organizations");
    fetchData(GET_PAPERS, setPapers, "papers");

    const fetchAIServices = async () => {
      try {
        const response = await getAxios({ url: GET_ADMIN_AI_SERVICES });
        const providers = response.data[0]?.llm_service_providers || [];
        setLlmServiceProviders(providers);
        if (providers.length > 0) {
          const firstProvider = providers[0];
          const firstProviderName = Object.keys(firstProvider)[0];
          setLlmModelNames(firstProvider[firstProviderName].model_name || []);
        }
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to fetch AI services", "error"));
      }
    };

    fetchAIServices();
  }, [fetchData, dispatch]);

  const updateModelNames = (serviceProvider: string) => {
    const provider = llmServiceProviders.find((p) => p[serviceProvider]);
    setLlmModelNames(
      provider ? provider[serviceProvider].model_name || [] : []
    );
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      // Add your API call here if needed
      // await submitData(values);
      dispatch(openSnackbarFunction("Form submitted successfully", "success"));
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to submit form", "error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form noValidate>
            {" "}
            {/* Added noValidate to prevent browser validation */}
            <FormSelect
              name="orgId"
              label="Select Organisation"
              options={organizations}
              nameKey="organizationName"
              onChange={(value) => {
                fetchCourses(value);
                setFieldValue("course", "");
              }}
            />
            <FormSelect
              name="course"
              label="Select Course"
              options={courses}
              nameKey="courseName"
            />
            <FormSelect
              name="paper"
              label="Select Paper"
              options={papers}
              nameKey="displayName"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field name="serviceProvider">
                  {({ field, meta: { touched, error } }: any) => (
                    <FormControl fullWidth error={touched && !!error}>
                      <InputLabel>Service Provider</InputLabel>
                      <Select
                        {...field}
                        label="Service Provider"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const serviceProvider = e.target.value;
                          field.onChange(e);
                          updateModelNames(serviceProvider);
                          setFieldValue("modelName", "");
                        }}
                      >
                        {llmServiceProviders.map((provider) => {
                          const name = Object.keys(provider)[0];
                          return (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched && error && (
                        <FormHelperText>{error}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field name="modelName">
                  {({ field, meta: { touched, error } }: any) => (
                    <FormControl fullWidth error={touched && !!error}>
                      <InputLabel>Model Name</InputLabel>
                      <Select {...field} label="Model Name">
                        {llmModelNames.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched && error && (
                        <FormHelperText>{error}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                </Field>
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              sx={{ mt: 2 }}
              error={touched.temperature && !!errors.temperature}
            >
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1">Temperature</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="temperature">
                    {({ field }: any) => (
                      <Slider
                        {...field}
                        value={field.value}
                        onChange={(_, value) =>
                          setFieldValue("temperature", value)
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={50}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {values.temperature}
                  </Typography>
                </Grid>
              </Grid>
              {touched.temperature && errors.temperature && (
                <FormHelperText>{errors.temperature}</FormHelperText>
              )}
            </FormControl>
            <Field name="contextLength">
              {({ field, meta: { touched, error } }: any) => (
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={touched && !!error}
                >
                  <InputLabel>Context Length</InputLabel>
                  <Select {...field} label="Context Length">
                    {[...Array(10)].map((_, i) => (
                      <MenuItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched && error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              )}
            </Field>
            <Field name="systemInstruction">
              {({ field }: any) => (
                <TextField
                  {...field}
                  fullWidth
                  label="System Instructions"
                  multiline
                  rows={4}
                  sx={{ mt: 2, mb: 2 }}
                />
              )}
            </Field>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ManageAskQuestions;
