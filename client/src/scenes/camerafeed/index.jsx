import React from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { Splitter, SplitterPanel } from "primereact/splitter";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import HistoryIcon from "@mui/icons-material/History";
import Header from "components/Header";
import FlexBetween from "components/FlexBetween";

const CameraFeed = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="CAMERA FEED" subtitle="Live camera preview and recent events" />
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* Camera Feeds Section */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Splitter layout="horizontal" style={{ height: "100%" }}>
            <SplitterPanel>
              <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* Video content will go here */}
              </Box>
            </SplitterPanel>
            <SplitterPanel>
              <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* Video content will go here */}
              </Box>
            </SplitterPanel>
          </Splitter>
        </Box>

        {/* Recent Events Section */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          sx={{ 
            height: "auto", 
            overflowY: "auto",
            '@media screen and (max-width: 768px)': {
              height: "auto",
              minHeight: "500px"
            }
          }}
        >
          <FlexBetween>
            <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
              Recent Events
            </Typography>
            <IconButton>
              <HistoryIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
            </IconButton>
          </FlexBetween>

          <Grid 
            container 
            spacing={2} 
            sx={{ 
              mt: "1rem",
              '@media screen and (max-width: 600px)': {
                display: 'flex',
                flexDirection: 'column'
              }
            }}
          >
            {[...Array(12)].map((_, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={3} 
                key={index}
                sx={{
                  '@media screen and (max-width: 600px)': {
                    marginBottom: '1rem'
                  }
                }}
              >
                <Card 
                  sx={{ 
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: "0.55rem",
                    boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar sx={{ width: 56, height: 56, marginBottom: "0.5rem", backgroundColor: theme.palette.secondary[300] }}>A</Avatar>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[100] }}>12:30:58</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[100] }}>Entry to hall</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[100] }}>Mike Barrow</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CameraFeed;