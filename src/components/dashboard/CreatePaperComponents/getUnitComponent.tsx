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
import { BASE_URL } from 'shared/constants/routerUrls';
import { Paper } from "./getPaperComponent";
import { Part } from './getPartComponent';
import { Chapter } from './getChapterComponent';

export interface Unit {
    _id: string;
    unitName: string;
}

interface GetUnitComponentProps {
    onUnitChange: (unit: Unit | null) => void;
    selectedUnit: Unit | null;
    selectedPaper: Paper | null;
    selectedPart: Part | null;
    selectedChapter: Chapter | null;
}

const GetUnitComponent: React.FC<GetUnitComponentProps> = ({
    onUnitChange,
    selectedUnit,
    selectedPaper,
    selectedPart,
    selectedChapter,
}) => {
    const [units, setUnits] = useState<Unit[]>([]);
    const dispatch = useDispatch();

    const getUnits = async () => {
        if (!selectedPaper || !selectedPart || !selectedChapter) {
            setUnits([]);
            return;
        }

        try {
            const unitResponse = await postAxios({
                url: `${BASE_URL}/unitsByPaperPartChapter`,
                values: {
                    paperId: selectedPaper._id,
                    partId: selectedPart?._id,
                    chapterId: selectedChapter?._id,
                },
            });
            setUnits(unitResponse?.data || []);
        } catch (error) {
            dispatch(openSnackbarFunction("Failed to fetch units", "error"));
        }
    };

    useEffect(() => {
        getUnits();
    }, [selectedPaper, selectedPart, selectedChapter]);

    const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedUnitId = event.target.value;
        const unit = units.find((unit) => unit._id === selectedUnitId);
        onUnitChange(unit || null);
    };

    return (
        <div>
            <InputLabel>
                Select Unit{" "}
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            </InputLabel>
            <TextField
                select
                fullWidth
                label="Select Unit"
                placeholder="Select Unit"
                margin="none"
                name="unitName"
                value={selectedUnit?._id ?? ""}
                onChange={handleUnitChange}
                disabled={
                    !selectedPaper || !selectedPart || !selectedChapter
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
                {units.map((unit) => (
                    <MenuItem key={unit._id} value={unit._id}>
                        {unit.unitName}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default GetUnitComponent;
