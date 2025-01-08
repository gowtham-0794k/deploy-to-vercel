"use client";

import { MenuItem, TextField } from "utils/genericExports/theme-imports";
import { useEffect, useState } from "react";
import { getAxios } from "shared";
import { useDispatch } from "store";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { openSnackbarFunction } from "utils/utils";
import { GET_ORGS } from "shared/constants/routerUrls";

export interface Organization {
  _id: string;
  organizationName: string;
}

export interface GetOrgComponentProps {
  onOrganizationChange: (org: Organization | null) => void;
  selectedOrg?: Organization | null;
}

const GetOrgComponent: React.FC<GetOrgComponentProps> = ({
  onOrganizationChange,
  selectedOrg = null,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const dispatch = useDispatch();

  const getOrganizations = async () => {
    try {
      const organizationResponse = await getAxios({ url: GET_ORGS });
      setOrganizations(organizationResponse?.data?.entities || []);
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch organizations", "error"));
    }
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  const handleOrgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOrgName = event.target.value;
    const org = organizations.find(
      (org) => org.organizationName === selectedOrgName
    );
    onOrganizationChange(org || null);
  };

  return (
    <div>
      <InputLabel>
        Select Organisation{" "}
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
      </InputLabel>
      <TextField
        select
        fullWidth
        label="Select Organisation"
        placeholder="Select Organisation"
        margin='none'
        name="organizationName"
        value={selectedOrg?.organizationName || ""}
        onChange={handleOrgChange}
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
        {organizations.map((org) => (
          <MenuItem key={org._id} value={org.organizationName}>
            {org.organizationName}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default GetOrgComponent;
