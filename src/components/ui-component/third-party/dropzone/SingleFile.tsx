// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import RejectionFiles from './RejectionFile';
import PlaceholderContent from './PlaceHolderContent';

// types
import { CustomFile, UploadProps } from 'types/dropzone';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

const SingleFileUpload = ({ error, file, setFieldValue, sx, ...other }: UploadProps) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'image/*': []
    },
    multiple: false,
    onDrop: (acceptedFiles: CustomFile[]) => {
      setFieldValue(
        'files',
        acceptedFiles.map((file: CustomFile) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const thumbs =
    file &&
    file.map((item: CustomFile) => (
      <>
        <Box sx={{ bgcolor: 'background.paper', top: 8, left: 8, borderRadius: 2, position: 'absolute', width: 1, height: 1 }}>
          <CardMedia
            key={item.name}
            alt={item.name}
            component="img"
            src={item.preview}
            sx={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
            onLoad={() => {
              URL.revokeObjectURL(item.preview!);
            }}
          />
        </Box>
      </>
    ));

  const onRemove = () => {
    setFieldValue('files', null);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && { color: 'error.main', borderColor: 'error.light', bgcolor: 'error.lighter' }),
          ...(file && { padding: '12% 0' })
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent />
        {thumbs}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={[...fileRejections]} />}

      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default SingleFileUpload;
