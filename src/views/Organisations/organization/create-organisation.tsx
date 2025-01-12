"use client";
import Contacts from "views/Organisations/organization/Contacts";
import UrlForm from "views/Organisations/organization/UrlForm";
import React, { useState } from "react";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import BankDetails from "views/Organisations/organization/BankDetails";
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "utils/genericExports/theme-imports";
import OrganizationForm from "./OrganizationForm";
import { BASE_URL } from "shared/constants/routerUrls";
import axios from "axios";
import { openSnackbarFunction } from "utils/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "store";

const steps = ["Info", "URLs", "Contacts", "Bank Details"];

export type UrlData = {
  adminUrl?: string;
  userUrl?: string;
  websiteUrl?: string;
  domainUrl?: string;
};

interface ContactPerson {
  firstName: string;
  lastName: string;
  contactNumber1: string;
  contactNumber2: string;
  emailId: string;
  designation: string;
}

export type ContactDataType = {
  contactPerson1: ContactPerson;
  contactPerson2: ContactPerson;
};

export type BankDataType = {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  accountHolderName?: string;
  bankAddress?: string;
};
const getStepContent = (
  step: number,
  handleNext: (values: any) => void,
  handleBack: () => void,
  setErrorIndex: (i: number | null) => void,
  organisationData: any,
  urlData: any,
  contactData: any,
  bankData: any
) => {
  switch (step) {
    case 0:
      return (
        <OrganizationForm
          handleNext={handleNext}
          setErrorIndex={setErrorIndex}
          organisationData={organisationData}
        />
      );
    case 1:
      return (
        <UrlForm
          handleNext={handleNext}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
          urlData={urlData}
        />
      );
    case 2:
      return (
        <Contacts
          handleNext={handleNext}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
          contactData={contactData}
        />
      );
    case 3:
      return (
        <BankDetails
          handleNext={handleNext}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
          bankData={bankData}
        />
      );
    default:
      throw new Error("Unknown step");
  }
};

const CreateOrg = () => {
  const [activeStep, setActiveStep] = useState(0),
    [errorIndex, setErrorIndex] = useState<number | null>(null),
    [organisationData, setOrganisationData] = useState<any>({}),
    [urlData, setUrlData] = useState<UrlData>({}),
    [contactData, setContactData] = useState<any>({}),
    [bankData, setBankData] = useState<BankDataType>({}),
    router = useRouter(),
    dispatch = useDispatch(),
    handleNext = async (values: any) => {
      if (values?.organizationData)
        setOrganisationData(values?.organizationData);
      if (values?.urlData) setUrlData(values?.urlData);
      if (values?.contactData) setContactData(values?.contactData);
      if (values?.bankData) setBankData(values?.bankData);

      if (activeStep !== steps.length - 1) {
        setActiveStep(activeStep + 1);
        setErrorIndex(null);
      } else {
        const contactDataValues = values?.contactData || contactData,
          bankDataValues = values?.bankData || bankData,
          combineData = {
            organizationName: organisationData.organisationName,
            brandName: organisationData.brandName,
            addressLine1: organisationData.addressLine1,
            addressLine2: organisationData.addressLine2,
            city: organisationData.city,
            state: organisationData.state,
            typeOfOrganization: organisationData.typeOfOrganization,
            pincode: organisationData.pincode,
            domainName: urlData.domainUrl,
            adminUrl: urlData.adminUrl,
            userUrl: urlData.userUrl,
            websiteUrl: urlData.websiteUrl,
            contactPerson1: {
              firstName: contactDataValues.contactPerson1.firstName,
              lastName: contactDataValues.contactPerson1.lastName,
              contactNumber1: contactDataValues.contactPerson1.contactNumber1,
              contactNumber2: contactDataValues.contactPerson1.contactNumber2,
              emailId: contactDataValues.contactPerson1.emailId,
              designation: contactDataValues.contactPerson1.designation,
            },
            contactPerson2: {
              firstName: contactDataValues.contactPerson2.firstName,
              lastName: contactDataValues.contactPerson2.lastName,
              contactNumber1: contactDataValues.contactPerson2.contactNumber1,
              contactNumber2: contactDataValues.contactPerson2.contactNumber2,
              emailId: contactDataValues.contactPerson2.emailId,
              designation: contactDataValues.contactPerson2.designation,
            },
            bankDetails: {
              accountName: bankDataValues.bankData.accountName,
              bankName: bankDataValues.bankData.bankName,
              accountNumber: bankDataValues.bankData.accountNumber,
              ifscCode: bankDataValues.bankData.ifscCode,
              branchName: bankDataValues.bankData.branchName,
              typeOfAccount: bankDataValues.bankData.typeOfAccount,
              GSTNumber: bankDataValues.bankData.GSTNumber,
            },
          };
        try {
          const response = await axios.post(`${BASE_URL}/org`, combineData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status === 201) {
            dispatch(
              openSnackbarFunction(
                response.data.message || "Organisation created successfully",
                "success"
              )
            );
            router.push("/organisation/add-branding");
          } else if (response.status === 400) {
            dispatch(
              openSnackbarFunction(
                response.data.message || "Organisation already exists",
                "error"
              )
            );
          }
        } catch (error: any) {
          if (error.response.status === 400) {
            dispatch(
              openSnackbarFunction(
                error.response.data.message ||
                  (error.response.data &&
                    Object.values(error.response.data)[0]) ||
                  "Organisation already exists",
                "error"
              )
            );
          }
          const errorMessage =
          (error.response.data &&
            Object.values(error.response.data)[0]) ||
            error.response?.data?.message ||
            error.message ||
            "Failed to create organisation";
          dispatch(openSnackbarFunction(errorMessage, "error"));
          if (error.response?.status === 400) {
            setErrorIndex(activeStep); // Mark current step as having an error
          }
        }
      }
    };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
      <Grid container spacing={gridSpacing} justifyContent="center">
        <Grid item xs={12} md={9} lg={7}>
          <MainCard>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label, index) => {
                const labelProps: {
                  error?: boolean;
                  optional?: React.ReactNode;
                } = {};

                if (index === errorIndex) {
                  labelProps.optional = (
                    <Typography variant="caption" color="error">
                      Error
                    </Typography>
                  );

                  labelProps.error = true;
                }

                return (
                  <Step key={label}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <>
              {getStepContent(
                activeStep,
                handleNext,
                handleBack,
                setErrorIndex,
                organisationData,
                urlData,
                contactData,
                bankData
              )}
            </>
          </MainCard>
        </Grid>
      </Grid>
  );
};

export default CreateOrg;
