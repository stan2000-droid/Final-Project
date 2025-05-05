import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import FeedUpload from "scenes/feed upload";

import Transactions from "scenes/transactions";

import Login from "scenes/login";
import CameraFeed from "scenes/camerafeed";
import Subscribe from "scenes/subscribe";
import  Unsubscribe  from "scenes/unsubscribe";
import ViewCameraFeed from "scenes/viewcamerafeed";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
           <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            
          <Route path="/viewcamerafeed" element={<ViewCameraFeed />}>
              <Route path="cameraFeed" element={<CameraFeed />} />
              <Route path="dashboard" element={<Dashboard />} />
          </Route>

            <Route path="/layout" element={<Layout />}>
              <Route path="cameraFeed" element={<CameraFeed />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="feedupload" element={<FeedUpload />} />
              <Route path="transactions" element={<Transactions />} />
              
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
