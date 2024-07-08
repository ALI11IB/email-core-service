import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  paddingTop: "10px",
  paddingBottom: "10px",
  padding: "10px",
  borderTop: "1px solid #f2f6fc",
  borderBottom: "1px solid #f2f6fc",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    border: "1px solid #f2f6fc",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
}));
