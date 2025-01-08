import React, { useEffect, useState } from "react";
import { MenuItem, TextField } from "utils/genericExports/theme-imports";
import { useDispatch } from "store";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { openSnackbarFunction } from "utils/utils";
import { Organization } from "../OrganizationComponents/getOrgComponent";
import axios from "axios";
import { BASE_URL } from "shared/constants/routerUrls";

interface Item {
  _id: string;
  name: string;
}

interface GetItemComponentProps {
  type: "department" | "discipline" | "division";
  onItemChange: (itemId: string | null) => void;
  selectedItemId: string | null;
  selectedDeptId?: string | null;
  selectedDiscId?: string | null;
  selectedOrg: Organization | null;
  onItemChangeName?: (name: string | undefined) => void;
}

const GetItemComponent: React.FC<GetItemComponentProps> = ({
  type,
  onItemChange,
  selectedItemId,
  selectedDeptId,
  selectedDiscId,
  selectedOrg,
  onItemChangeName,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const dispatch = useDispatch();

  const getItems = async () => {
    if (
      !selectedOrg?._id ||
      (type !== "department" && !selectedDeptId) ||
      (type === "division" && !selectedDiscId)
    ) {
      setItems([]);
      onItemChange(null);
      onItemChangeName?.(undefined);
      return;
    }

    try {
      let response;
      switch (type) {
        case "department":
          response = await axios.get(
            `${BASE_URL}/${selectedOrg._id}/departments`
          );
          break;
        case "discipline":
          response = await axios.post(`${BASE_URL}/disciplines`, {
            orgId: selectedOrg._id,
            departmentId: selectedDeptId,
          });
          break;
        case "division":
          response = await axios.post(`${BASE_URL}/divisions`, {
            orgId: selectedOrg._id,
            departmentId: selectedDeptId,
            disciplineId: selectedDiscId,
          });
          break;
      }

      if (Array.isArray(response?.data)) {
        setItems(
          response.data.map((item) => ({
            _id: item._id,
            name: type === "discipline" ? item.discName : item[`${type}Name`],
          }))
        );
      }
    } catch (error: any) {
      dispatch(
        openSnackbarFunction(
          error.response.data.error || `Failed to fetch ${type}s`,
          "error"
        )
      );
    }
  };
  useEffect(() => {
    setItems([]);
    onItemChange(null);
    onItemChangeName?.(undefined);
  }, [selectedDeptId, selectedDiscId, selectedOrg]);
  useEffect(() => {
    getItems();
  }, [selectedDeptId, selectedDiscId, selectedOrg, type]);

  const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = event.target.value;
    onItemChange(selectedId);

    const getName = items?.find(({ _id }) => _id == selectedId);
    onItemChangeName?.(getName?.name);
  };

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div>
      <InputLabel>
        Select {capitalizedType}{" "}
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
      </InputLabel>
      <TextField
        select
        fullWidth
        label={`Select ${capitalizedType}`}
        placeholder={`Select ${capitalizedType}`}
        name={`${type}Name`}
        value={selectedItemId ?? ""}
        onChange={handleItemChange}
        disabled={
          !selectedOrg ||
          (type !== "department" && !selectedDeptId) ||
          (type === "division" && !selectedDiscId)
        }
        sx={{ mb: 2 }}
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
        {items.map((item) => (
          <MenuItem key={item._id} value={item._id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default GetItemComponent;