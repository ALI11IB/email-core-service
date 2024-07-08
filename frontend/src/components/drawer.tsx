import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useContext } from "react";
import { EmailsContext } from "../context";
import { getDayAndMonth } from "../helpers";
import { EmailMessage, MailBox } from "../types";
import { StyledBox } from "./customBox";
import NavBar from "./navbar";

const drawerWidth = 240;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function CustomDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedMail, setSelectedMail] = React.useState<
    EmailMessage | undefined
  >(undefined);
  const {
    mailBoxDetails: { mailboxes },
    setSelectedMailBox,
    selectedMailBox,
    messages,
  } = useContext<any>(EmailsContext);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavBar open={open} setOpen={setOpen} />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {mailboxes &&
            mailboxes?.length &&
            mailboxes.map((box: MailBox, index: number) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setSelectedMailBox(box.id)}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={box?.displayName} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />

        {selectedMail ? (
          <>
            <IconButton onClick={() => setSelectedMail(undefined)}>
              <ChevronLeftIcon />
            </IconButton>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "8px",
              }}
              dangerouslySetInnerHTML={{ __html: selectedMail.body?.content }}
            />
          </>
        ) : (
          messages.length &&
          messages.map((message: EmailMessage, index: number) => {
            if (message.parentFolderId == selectedMailBox) {
              return (
                <StyledBox key={index} onClick={() => setSelectedMail(message)}>
                  <Typography width={"30%"}>
                    {message.from.emailAddress.name}
                  </Typography>
                  <Typography width={"60%"}>{message.subject}</Typography>
                  <Typography width={"10%"}>
                    {getDayAndMonth(message.receivedDateTime)}
                  </Typography>
                </StyledBox>
              );
            }
          })
        )}
      </Main>
    </Box>
  );
}
