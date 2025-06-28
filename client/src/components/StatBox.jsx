import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useGetStatBoxQuery } from "../state/api";

const StatBox = ({ title, value, increase, icon, description }) => {
  const theme = useTheme();
  const { data: statBoxData, isLoading } = useGetStatBoxQuery();
  // Create variables from the API data
  const totalDetections = statBoxData?.data?.totalDetections?.count || 0;
  const averageConfidence = statBoxData?.data?.averageConfidence?.averageConfidence || 0;
  const mostDetected = statBoxData?.data?.mostDetectedAnimal?.mostDetectedAnimal || "None";
  const todayDetections = statBoxData?.data?.todayDetections?.totalDetectionsToday || 0;

  // Determine which value to display based on title
  let displayValue = value;  if (title === "Total Detections") {
    displayValue = totalDetections;
  } else if (title === "Accuracy") {
    displayValue = `${(averageConfidence * 100).toFixed(1)}%`;
  } else if (title === "Most Detected") {
    displayValue = mostDetected;
  } else if (title === "Today's Detections") {
    displayValue = todayDetections;
  }

  // Show loading state if data is loading
  if (isLoading) {
    displayValue = "Loading...";
  }
  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>
        {icon}
      </FlexBetween>      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ 
          color: theme.palette.secondary[200],
          textAlign: "center",
          mb: "2rem"
        }}
      >
        {displayValue}
      </Typography>
     
    </Box>
  );
};

export default StatBox;
