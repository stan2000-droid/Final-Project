import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
  LogoutOutlined,
  CloudUploadOutlined,
  PlayCircleOutlined
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../state";
import { useFeedUpload } from "../state/FeedUploadContext";
import profileImage from "assets/profile.png";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, showThemeButton = true, showProfile = true, showSearch = true, showLoginButton = true, showSidebar = true }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const currentMode = useSelector((state) => state?.global?.mode) ?? "dark";
    // Get upload state for global status indicator
  const { isUploading, isInferring } = useFeedUpload();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const navigate = useNavigate();

  const handleThemeChange = () => {
    dispatch(setMode());
  };

  // Function to get status info
  const getUploadStatus = () => {
    if (isUploading) {
      return {
        label: "Uploading...",
        icon: <CloudUploadOutlined />,
        color: "info"
      };
    }
    if (isInferring) {
      return {
        label: "Inference Running",
        icon: <PlayCircleOutlined />,
        color: "success"
      };
    }
    return null;
  };

  const uploadStatus = getUploadStatus();

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween >
          
          {showSidebar && (
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          )}
          
          {showSearch && (
          <FlexBetween
          
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          > 
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          
          </FlexBetween>
          )}
        </FlexBetween>        {/* RIGHT SIDE */}
        <FlexBetween gap="1rem"> 
          
          {/* Upload Status Indicator */}
          {uploadStatus && (
            <Chip
              icon={uploadStatus.icon}
              label={uploadStatus.label}
              color={uploadStatus.color}
              variant="outlined"
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: '28px',
                '& .MuiChip-icon': {
                  fontSize: '16px'
                }
              }}
            />
          )}
          
        {showThemeButton && (
          <Tooltip title={currentMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
            <IconButton 
              onClick={handleThemeChange}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.background.alt,
                },
              }}
            >
              {currentMode === "dark" ? (
                <DarkModeOutlined sx={{ fontSize: "25px" }} />
              ) : (
                <LightModeOutlined sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
          </Tooltip>
          )}
          {showLoginButton && (
          <Tooltip title="Go to Login page" arrow>
            <IconButton 
              onClick={() => navigate("/")}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.background.alt,
                },
              }}
            >
              <LogoutOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
          )}
          {showProfile &&(
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  admin
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                 administrator
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
            )}
        </FlexBetween>
            
      </Toolbar>
    
    </AppBar>
  );
};

export default Navbar;
