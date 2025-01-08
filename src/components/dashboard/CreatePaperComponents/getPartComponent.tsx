'use client'

import React, { useEffect, useState } from 'react';
import {
    MenuItem,
    TextField,
} from "utils/genericExports/theme-imports";
import { useDispatch } from "store";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { openSnackbarFunction } from "utils/utils";
import { postAxios } from "shared";
import { Paper } from "./getPaperComponent";
import { BASE_URL } from 'shared/constants/routerUrls';

export interface Part {
    _id: string;
    partName: string;
}

interface GetPartComponentProps {
    onPartChange: (part: Part | null) => void;
    selectedPart?: Part | null;
    selectedPaper: Paper | null;
    onItemChangeName?: (partName: string | undefined) => void;
}

const GetPartComponent: React.FC<GetPartComponentProps> = ({
    onPartChange,
    selectedPart = null,
    selectedPaper,
}) => {
    const [parts, setParts] = useState<Part[]>([]);
    const dispatch = useDispatch();

    const getParts = async () => {
        if (!selectedPaper) {
            setParts([]);
            return;
        }

        try {
            const partResponse = await postAxios({
                url: `${BASE_URL}/partsById`,
                values: { paperId: selectedPaper._id }
            });
            setParts(partResponse?.data || []);
        } catch (error) {
            dispatch(openSnackbarFunction("Failed to fetch parts", "error"));
        }
    };

    useEffect(() => {
        getParts();
    }, [selectedPaper]);

    const handlePartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPartId = event.target.value;
        const part = parts.find((part) => part._id === selectedPartId);
        onPartChange(part || null);
    };

    return (
        <div>
            <InputLabel>
                Select Part{" "}
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            </InputLabel>
            <TextField
                select
                fullWidth
                label="Select Part"
                placeholder="Select Part"
                margin="none"
                name="partName"
                value={selectedPart?._id ?? ""}
                onChange={handlePartChange}
                disabled={!selectedPaper}
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
                {parts.map((part) => (
                    <MenuItem key={part._id} value={part._id}>
                        {part.partName}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default GetPartComponent;