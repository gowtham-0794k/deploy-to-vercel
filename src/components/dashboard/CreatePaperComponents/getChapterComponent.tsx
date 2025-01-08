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
import { Part } from './getPartComponent';

export interface Chapter {
    _id: string;
    chapterName: string;
}

interface GetChapterComponentProps {
    onChapterChange: (chapter: Chapter | null) => void;
    selectedChapter: Chapter | null;
    selectedPaper: Paper | null;
    selectedPart: Part | null;
    onItemChangeName?: (chapterName: string | undefined) => void;
}

const GetChapterComponent: React.FC<GetChapterComponentProps> = ({
    onChapterChange,
    selectedChapter,
    selectedPaper,
    selectedPart,
}) => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const dispatch = useDispatch();

    const getChapters = async () => {
        if (!selectedPaper || !selectedPart) {
            setChapters([]);
            return;
        }

        try {
            const chapterResponse = await postAxios({
                url: `${BASE_URL}/chaptersByPaperAndPart`,
                values: { paperId: selectedPaper._id, partId: selectedPart?._id }
            });
            setChapters(chapterResponse?.data || []);
        } catch (error) {
            dispatch(openSnackbarFunction("Failed to fetch chapters", "error"));
        }
    };

    useEffect(() => {
        getChapters();
    }, [selectedPaper, selectedPart]);

    const handleChapterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedChapterId = event.target.value;
        const chapter = chapters.find((chapter) => chapter._id === selectedChapterId);
        onChapterChange(chapter || null);
    };

    return (
        <div>
            <InputLabel>
                Select Chapter{" "}
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            </InputLabel>
            <TextField
                select
                fullWidth
                label="Select Chapter"
                placeholder="Select Chapter"
                margin="none"
                name="chapterName"
                value={selectedChapter?._id ?? ""}
                onChange={handleChapterChange}
                disabled={!selectedPaper || !selectedPart}
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
                {chapters.map((chapter) => (
                    <MenuItem key={chapter._id} value={chapter._id}>
                        {chapter.chapterName}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default GetChapterComponent;