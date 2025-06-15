
import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  
  PetsOutlined,
  TrackChangesOutlined,
  EmojiEventsOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetDataQuery } from "state/api";
import StatBox from "components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDataQuery();
  const columns = [
    {
      field: "detection_id",
      headerName: "Detection ID",
      flex: 1,
    },
    {
      field: "formatted_time",
      headerName: "Time Detected",
      flex: 1,
    },
    {
      field: "class_name",
      headerName: "Animal Species",
      flex: 1,
    },
    {
      field: "confidence",
      headerName: "Confidence",
      flex: 0.8,
      renderCell: (params) => `${(params.value * 100).toFixed(2)}%`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

       
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
      >        {/* ROW 1 */}     
           <StatBox
          title="Total Detections"
          value
          icon={
            <PetsOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />        <StatBox
          title="Accuracy"
          value
      
          
          icon={
            <TrackChangesOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
         <OverviewChart view="sales" isDashboard={true} />
        </Box>
       
        <StatBox
          title="Most Detected"
          value
  
          icon={
            <EmojiEventsOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Today's Detections"
          value
          increase="+43%"
          description="Since last month"
          icon={
            <TodayOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
       
        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row.detection_id}
            rows={(data && data.data) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Animal Detections by Species
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of animal species detected showing distribution of wildlife sightings and total detection counts.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
