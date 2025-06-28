import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import {
  HomeOutlined,
  CloudUploadOutlined,
  VideocamOutlined,
  PetsOutlined,
} from "@mui/icons-material";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  
  const navItems = [
    {
      text: "Dashboard",
      icon: <HomeOutlined />,
      path: "/dashboard",
    },
    {
      text: "FeedUpload",
      icon: <CloudUploadOutlined />,
      path: "/feed-upload",
    },
    {
      text: "CameraFeed",
      icon: <VideocamOutlined />,
      path: "/camera-feed",
    },
    {
      text: "Detections",
      icon: <PetsOutlined />,
      path: "/detections",
    },
  ];

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100vw" height="100%">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        navItems={navItems}
      />
      <Box flexGrow={1}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showProfile={false}
          showSearch={false}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
