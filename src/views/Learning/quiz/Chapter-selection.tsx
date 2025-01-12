
"use client";

import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


;
import React, { useState } from "react";

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import SubCard from 'ui-component/cards/SubCard';

import TextField from '@mui/material/TextField';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  paperName: yup.string().required('Paper Name is required'),
});

// ==============================|| FORM WIZARD - VALIDATION ||============================== //

export type ShippingData = {
  firstName?: string;
  lastName?: string;
  paperName?: string;
  selectedChapters?: string[];
};
export interface ExtendedShippingData extends ShippingData {
  paperName: string;
  selectedChapters: string[];
}
interface AddressFormProps {
  shippingData: ExtendedShippingData;
  setShippingData: (d: ExtendedShippingData) => void;
  handleNext: () => void;
  setErrorIndex: (i: number | null) => void;
}

const AddressForm = ({ shippingData, setShippingData, handleNext, setErrorIndex }: AddressFormProps) => {
  const formik = useFormik({
    initialValues: {
      paperName: shippingData.paperName || '',
      selectedChapters: shippingData.selectedChapters || [],
    },
    validationSchema,
    onSubmit: (values) => {
      setShippingData({
        paperName: values.paperName,
        selectedChapters: selectedChapters,
      });
      handleNext();
    }
  });
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const handleCheckboxChange = (chapter: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((item) => item !== chapter)
        : [...prev, chapter]
    );
  };

  return (
    <>
      <Grid item xs={12}>
         <Stack direction="row" alignItems="center" spacing={3}>
         <span style={{ fontWeight: "bold" }}>Paper Name :</span>
           <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            margin="auto"
            spacing={2}
          >
           <TextField
              size="small"
              label="Paper Name"
              name="paperName"
              value={formik.values.paperName}
              onChange={formik.handleChange}
              error={formik.touched.paperName && Boolean(formik.errors.paperName)}
              helperText={formik.touched.paperName && formik.errors.paperName}
            />
          </Stack>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ marginBottom: "20px", marginLeft: "20px" }}
      ></Grid>
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <SubCard >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="secondary"
                                checked={selectedChapters.includes("Chapter 1")}
                                onChange={() =>
                                  handleCheckboxChange("Chapter 1")
                                }
                              />
                            }
                            label="Chapter 1"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 1"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 1")
                                    }
                                  />
                                }
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 2"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 2")
                                    }
                                  />
                                }
                                label="Unit 2"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 3"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 3")
                                    }
                                  />
                                }
                                label="Unit 3"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 2")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 2")
                              }
                            />
                            }
                            label="Chapter 2"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 21"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 21")
                                  }
                                />
                                }
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 22"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 22")
                                    }
                                  />
                                }
                                label="Unit 2"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 23"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 23")
                                    }
                                  />
                                }
                                label="Unit 23"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 3")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 3")
                              }
                            />
                            }
                            label="Chapter 3"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 31"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 31")
                                  }
                                />
                                }
                                label="Unit 1"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 4")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 4")
                              }
                            />
                            }
                            label="Chapter 4"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 5")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 5")
                              }
                            />
                            }
                            label="Chapter 5"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 6")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 6")
                              }
                            />
                            }
                            label="Chapter 6"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                  </Grid>
                </SubCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <SubCard >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 7")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 7")
                              }
                            />
                            }
                            label="Chapter 7"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 8")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 8")
                              }
                            />
                            }
                            label="Chapter 8"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox
                              color="secondary"
                              checked={selectedChapters.includes("Chapter 9")}
                              onChange={() =>
                                handleCheckboxChange("Chapter 9")
                              }
                            />
                            }
                            label="Chapter 9"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 91"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 91")
                                    }
                                  />
                              }
                                
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 92"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 92")
                                    }
                                  />
                                }
                            
                                label="Unit 2"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 93"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 93")
                                    }
                                  />
                                }
                                
                                label="Unit 3"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 10"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 11"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 12"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 121"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 121")
                                  }
                                />
                              }
                                
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 122"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 122")
                                  }
                                />
                              }
                                
                                label="Unit 2"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 123"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 123")
                                  }
                                />
                              }
                                
                                label="Unit 3"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </Grid>
                </SubCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <SubCard >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 13"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 14"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 15"
                          />
                        </AccordionSummary>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 16"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 161"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 161")
                                  }
                                />
                              }
                                
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 162"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 162")
                                  }
                                />
                              }
                                
                                label="Unit 2"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 163"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 163")
                                    }
                                  />
                                }
                                
                                label="Unit 3"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 17"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 171"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 171")
                                    }
                                  />
                                }
                              
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 172"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 172")
                                    }
                                  />
                                }
                                
                                label="Unit 2"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 173"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 173")
                                  }
                                />
                              }
                                
                                label="Unit 3"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <FormControlLabel
                            control={
                              <Checkbox color="secondary" checked={false} />
                            }
                            label="Chapter 18"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 181"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 181")
                                  }
                                />
                              }
                                
                                label="Unit 1"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                  color="secondary"
                                  checked={selectedChapters.includes(
                                    "Unit 2"
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange("Unit 182")
                                  }
                                />
                              }
                                
                                label="Unit 182"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    checked={selectedChapters.includes(
                                      "Unit 183"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("Unit 183")
                                    }
                                  />
                                }
                              
                                label="Unit 3"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </Grid>
                </SubCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
      </form>
    </>
  );
};

export default AddressForm;
