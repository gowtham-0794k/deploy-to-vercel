// 'use client';

import React from "react";

// material-ui
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";

import { visuallyHidden } from "@mui/utils";

// project imports
import MainCard from "ui-component/cards/MainCard";

// types
import { KeyedObject, ArrangementOrder, EnhancedTableHeadProps } from "types";

// assets
import DeleteIcon from "@mui/icons-material/Delete";

type TableEnhancedCreateDataType = {
  name: string;
  Paper1: React.ReactNode;
  Paper2: React.ReactNode;
  Paper3: React.ReactNode;
  Paper4: React.ReactNode;
};
// table data
function createData(
  name: string,
  Paper1: React.ReactNode,
  Paper2: React.ReactNode,
  Paper3: React.ReactNode,
  Paper4: React.ReactNode
): TableEnhancedCreateDataType {
  return { name, Paper1, Paper2, Paper3, Paper4 };
}

// table data
const rows: TableEnhancedCreateDataType[] = [
  createData(
    "Chapter Analysis",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "Get Question",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "Chapter Analysis",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "Revision Notes",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "Mock Exam",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "Ask Question",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "CaseStudy With MCQ",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData(
    "Podcasts(Hindi)",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData("PY QP", <Checkbox />, <Checkbox />, <Checkbox />, <Checkbox />),
  createData(
    "Interactive Learning",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
  createData("Q and A", <Checkbox />, <Checkbox />, <Checkbox />, <Checkbox />),
  createData(
    "Podcasts(English)",
    <Checkbox />,
    <Checkbox />,
    <Checkbox />,
    <Checkbox />
  ),
]; // table filter
function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order: ArrangementOrder, orderBy: string) {
  return order === "desc"
    ? (a: KeyedObject, b: KeyedObject) => descendingComparator(a, b, orderBy)
    : (a: KeyedObject, b: KeyedObject) => -descendingComparator(a, b, orderBy);
}

function stableSort(
  array: TableEnhancedCreateDataType[],
  comparator: (a: KeyedObject, b: KeyedObject) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(
      a[0] as TableEnhancedCreateDataType,
      b[0] as TableEnhancedCreateDataType
    );
    if (order !== 0) return order;
    return (a[1] as number) - (b[1] as number);
  });
  return stabilizedThis.map((el) => el[0]);
}

// table header
const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Features",
  },
  {
    id: "Paper1",
    numeric: true,
    disablePadding: false,
    label: "Paper 1",
  },
  {
    id: "Paper2",
    numeric: true,
    disablePadding: false,
    label: "Paper 2",
  },
  {
    id: "Paper3",
    numeric: true,
    disablePadding: false,
    label: "Paper 3",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Paper 4",
  },
];

// ==============================|| TABLE - HEADER ||============================== //

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableHeadProps) {
  const createSortHandler =
    (property: string) => (event: React.SyntheticEvent) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : undefined}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| TABLE - TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }: { numSelected: number }) => (
  <Toolbar
    sx={{
      p: 0,
      pl: 1,
      pr: 1,
      ...(numSelected > 0 && {
        color: (theme) => theme.palette.secondary.main,
      }),
    }}
  >
    <Box sx={{ flexGrow: 1 }} />
    {numSelected > 0 && (
      <Tooltip title="Delete">
        <IconButton size="large">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
);

// ==============================|| TABLE - ENHANCED ||============================== //

function EnhancedTable() {
  const [order, setOrder] = React.useState<ArrangementOrder>("asc");
  const [orderBy, setOrderBy] = React.useState("Paper1");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <MainCard content={false}>
      <EnhancedTableToolbar numSelected={selected.length} />

      {/* table */}
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
            numSelected={selected.length}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                if (typeof row === "number") return null;
                return (
                  <TableRow hover tabIndex={-1} key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{row.Paper1}</TableCell>
                    <TableCell align="right">{row.Paper2}</TableCell>
                    <TableCell align="right">{row.Paper3}</TableCell>
                    <TableCell sx={{ pr: 3 }} align="right">
                      {row.Paper4}
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow sx={{ height: (dense ? 33 : 53) * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
export default EnhancedTable;
