import { CSSProperties } from 'react';

// material-ui
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// third party
import { FixedSizeList } from 'react-window';

// list render
function renderRow({ index, style }: { index: number; style: CSSProperties }) {
  return (
    <ListItemButton sx={style} key={index}>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItemButton>
  );
}

// ================================|| UI LIST - SCROLLABLE ||================================ //

export default function VirtualizedList() {
  return (
    <FixedSizeList height={280} width="auto" itemSize={46} itemCount={200}>
      {renderRow}
    </FixedSizeList>
  );
}
