import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Grid,
  Stack,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "utils/genericExports/theme-imports";

export const EnhancedTableHeadBundle = (props: any) => {
  const { papers, onChange, type } = props,
    permissions = ["Chapter Analysis", "Get Question", "Ask Question", "Quiz"],
    [papersCloned, setPapersCloned] = useState<any>([]),
    onChangeCheck = (event: boolean, paperIndex: number, item: string) => {
      if (event) {
        papersCloned[paperIndex].features.push(item);
      } else {
        const removeElement = papersCloned[paperIndex].features.filter(
          (el: string) => el != item
        );
        papersCloned[paperIndex].features = removeElement;
      }
      setPapersCloned([...papersCloned]);
    };

  useEffect(() => {
    if (!type) {
      const clonePapers = [...papers].map((el) => {
        return { ...el, ...{ features: [] } };
      });
      setPapersCloned(clonePapers);
    } else {
      setPapersCloned(papers);
    }
  }, [papers]);

  return (
    <div>
      {papers?.length !== 0 && (
        <div>
          <TableContainer sx={{ flexGrow: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell />
                {papers?.map((item: any, index: number) => (
                  <TableCell key={index} align="center">
                    {item?.displayName}
                  </TableCell>
                ))}
              </TableRow>
              {permissions.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: "16rem", fontSize: "1.1rem" }}>
                    {item}
                  </TableCell>
                  {papersCloned.map((itemPaper: any, permIndex: number) => {
                    return (
                      <TableCell key={permIndex} align="center">
                        <Checkbox
                          color="primary"
                          checked={itemPaper?.features.find(
                            (el: string) => el == item
                          )}
                          onChange={(event) => {
                            onChangeCheck(
                              event.target.checked,
                              permIndex,
                              item
                            );
                          }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
          </TableContainer>
          <Grid item xs={12} style={{ marginTop: "8px" }}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  onChange?.(papersCloned);
                }}
              >
                Save
              </Button>
            </Stack>
          </Grid>
        </div>
      )}
    </div>
  );
};
