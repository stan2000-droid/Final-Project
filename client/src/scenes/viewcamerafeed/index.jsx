import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";

import {

    HomeOutlined,
   
    Groups2Outlined,
  
  } from "@mui/icons-material";
  
const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = useSelector((state) => state.global.userId);

  const Items =[
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        text: "CameraFeed",
        icon: <Groups2Outlined />,
      },
      
      
    ];

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
    
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        navItems = {Items}
        showLoginDetails={false}
      />
      <Box flexGrow={1}>
        <Navbar
        
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showSearch={false}
          showProfile ={false}
          
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
