import { openSnackbar } from "store/slices/snackbar";

type SnackbarType = "error" | "warning" | "success";

export const openSnackbarFunction = (
  errorMessage: string,
  type: SnackbarType = "error"
) =>
  openSnackbar({
    open: true,
    message: errorMessage,
    variant: "alert",
    alert: {
      color: type,
    },
    autoHideDuration: 3000,
    close: true,
  });
