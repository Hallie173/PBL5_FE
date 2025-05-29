import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function getIcon(type) {
  switch (type) {
    case "success":
      return <CheckCircleIcon fontSize="inherit" />;
    case "error":
      return <ErrorIcon fontSize="inherit" />;
    case "warning":
      return <WarningIcon fontSize="inherit" />;
    case "info":
      return <InfoIcon fontSize="inherit" />;
    default:
      return null;
  }
}

export default function NotificationMui({
  message,
  type = "success", // success | error | warning | info
  open,
  handleClose,
  position = { vertical: "bottom", horizontal: "right" },
}) {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionComponent={Fade}
      anchorOrigin={position}
      sx={{
        mb: { xs: 10, sm: 2 },
        zIndex: 9999,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        icon={getIcon(type)}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          boxShadow: 3,
          fontWeight: 500,
          fontSize: "0.95rem",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.palette[type].main,
          color: theme.palette[type].contrastText,
          "& .MuiAlert-message": {
            display: "flex",
            alignItems: "center",
            flex: 1,
          },
          "& .MuiAlert-icon": {
            marginRight: 1,
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
