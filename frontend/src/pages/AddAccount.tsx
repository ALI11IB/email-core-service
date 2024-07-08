import React, { useEffect, useState } from "react";
import { getAuthUrl } from "../services/api";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const AddAccount: React.FC = () => {
  const [provider, setProvider] = useState<string>("outlook");
  const [authUrl, setAuthUrl] = useState<string>("");

  const handleAddAccount = async () => {
    const url = await getAuthUrl(provider);
    setAuthUrl(url);
    window.location.href = url;
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography variant={"h3"}>Add Account</Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Provider</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={provider}
          label="Age"
          onChange={(e) => setProvider(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"outlook"}>Outlook</MenuItem>
          <MenuItem value={"gmail"}>Gmail</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleAddAccount}>Link Email Account</Button>
    </Box>
  );
};

export default AddAccount;
