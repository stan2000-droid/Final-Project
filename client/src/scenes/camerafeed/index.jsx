import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, useTheme, Grid, Avatar, IconButton, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import 'primereact/resources/themes/saga-blue/theme.css'; // Basic theme
import 'primereact/resources/primereact.min.css';         // Core CSS
import 'primeicons/primeicons.css';                       // Icons

import Header from '../../components/Header';
import FlexBetween from '../../components/FlexBetween';
import { useGetDetectionDataQuery } from '../../state/api';
import { Card, CardMedia, CardContent } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const CameraFeed = () => {  const theme = useTheme();
  const { data, isLoading, refetch } = useGetDetectionDataQuery(8); // Fetch maximum 8 detections and get refetch function
  const [detections, setDetections] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
    console.log("Detection data from API:", data);
  
  // Update detections when data changes
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Only update detections when we have new data
      setDetections(data.slice(0, 8)); // Ensure we only display up to 8 detections
      setLastUpdated(new Date());
    }
    // If data is empty or undefined, keep the existing detections
  }, [data]);

  // Set up auto-refresh every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing detection data...');
      refetch();
      setLastUpdated(new Date());
    }, 60000); // Update every 60 seconds (1 minute)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  // Render the video feed inside a paper component
  return (
    <Box sx={{ m: '1.5rem 2.5rem' }}>
      <Header title="WILDLIFE DETECTION FEED" subtitle="Viewing processed video with detection results" />      
      <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">Camera Feed</Typography>
    
      
        <Box display="flex" justifyContent="center" mt={2} sx={{ width: '100%' }}>          <img
            src="http://localhost:5000/video_feed"
            alt="No feed Uploaded. Contact the administrator"
            style={{ 
              width: '100%', 
              maxHeight: '40vh',
              objectFit: 'contain',
             
            }}
          />
        </Box>
      </Paper>      

      {/* Recent Events Section */}
      <Box
        gridColumn="span 12"
        gridRow="span 3"
        backgroundColor={theme.palette.background.alt}
        p="1.5rem"
        borderRadius="0.55rem"
        mt="20px"
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
          </Typography>          <Box display="flex" alignItems="center">
            <Typography variant="caption" sx={{ color: theme.palette.secondary[300], mr: 1 }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
              {data && Array.isArray(data) && data.length === 0 && detections.length > 0 && " (preserved previous detections)"}
            </Typography>
            <IconButton onClick={() => refetch()} title="Refresh detection data">
              <HistoryIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
            </IconButton>
          </Box>
        </FlexBetween>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              mt: "1rem",
              '@media screen and (max-width: 600px)': {
                display: 'flex',
                flexDirection: 'column'
              }
            }}          >            {/* First display actual detections if available */}
            {detections && detections.length > 0 && detections.map((detection) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={3} 
                key={detection.id}
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
                >                  <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {detection.image ? (
                      <CardMedia
                        component="img"
                        image={detection.image}
                        alt={detection.class_name}
                        sx={{ 
                          height: 120, 
                          width: 120, 
                          borderRadius: '8px', 
                          marginBottom: "0.75rem", 
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <Avatar sx={{ 
                        width: 120, 
                        height: 120, 
                        marginBottom: "0.75rem", 
                        backgroundColor: theme.palette.secondary[300] 
                      }}>
                        {detection.class_name ? detection.class_name[0] : '?'}
                      </Avatar>
                    )}
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[100] }}>{detection.formatted_time}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[100] }}>
                      {detection.class_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[100] }}>
                      Confidence: {Math.round(detection.confidence * 100)}%
                    </Typography>                  </CardContent>
                </Card>
              </Grid>            
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default CameraFeed;