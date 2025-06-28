import React, { useRef } from 'react';
import { Box, Button, Typography, useTheme, CircularProgress, Alert, Slider } from '@mui/material';
import { UploadOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Toast } from 'primereact/toast';
import Header from '../../components/Header';

import { useFeedUpload } from '../../state/FeedUploadContext';

const Input = styled('input')({
  display: 'none',
 });

const FeedUpload = () => {
  const theme = useTheme();
  const toast = useRef(null);
  
  // Get all state from global context - persists across navigation
  const {
    selectedFile,
    setSelectedFile,
    fileName,
    setFileName,
    sampleRate,
    setSampleRate,
    confidence,
    setConfidence,
    uploadLocked,
    setUploadLocked,
    isInferring,
    setIsInferring,
    isUploading,
    setIsUploading,
    clearFile,
    resetProcessState,
  } = useFeedUpload();const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleClearFile = () => {
    clearFile();
    // Reset file input
    const fileInput = document.getElementById('contained-button-file');
    if (fileInput) {
      fileInput.value = '';
    }
  };  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a video file first.');
      return;
    }
    
    // Create FormData to send file to the backend directly
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('confidence', confidence);
    formData.append('sample_rate', sampleRate);
    
    // Set loading state using global state
    setIsUploading(true);
    setUploadLocked(true); // Lock upload after starting
    
    // Show toast that upload has started
    toast.current.show({
      severity: 'info',
      summary: 'Upload Started',
      detail: 'Uploading video file to the server...',
      life: 3000
    });
    
    // Upload file to Flask API directly without streaming
    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Upload successful:', data);
      
      // Show success toast
      toast.current.show({
        severity: 'success',
        summary: 'Upload Successful',
        detail: 'Video uploaded successfully! Wildlife detection has started.',
        life: 5000,
        sticky: true
      });
      
      // Set inference state but keep upload state for UI feedback using global state
      setIsInferring(true); // Enable Stop Inference button
      setIsUploading(false); // Reset uploading state after successful upload
      
      // Note: uploadLocked remains true to prevent multiple uploads during inference
      // Removed navigation to camera feed after video upload
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      
      // Reset all states on error using global state
      setIsUploading(false);
      setUploadLocked(false); // Unlock upload on error
      
      // Show error toast
      toast.current.show({
        severity: 'error',
        summary: 'Upload Failed',
        detail: `Failed to upload video: ${error.message}`,
        life: 5000
      });
    });
  };const handleStopInference = () => {
    fetch('http://localhost:5000/api/stop_inference', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        toast.current.show({
          severity: 'warn',
          summary: 'Inference Stopped',
          detail: data.message || 'Inference has been stopped.',
          life: 4000,
        });
        
        // Reset all process states back to original state using global function
        resetProcessState();
        
        // Note: We keep selectedFile, fileName, sampleRate, and confidence
        // so the user can easily re-upload the same file with same settings
      })
      .catch(error => {
        console.error('Error stopping inference:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to stop inference.',
          life: 4000,
        });
      });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Toast ref={toast} position="top-right" />
      <Header title="VIDEO UPLOAD" subtitle="Upload a video for wildlife detection." />      <Box mt="20px">
        <Box display="flex" alignItems="center" gap={2}>
          <label htmlFor="contained-button-file">
            <Input 
              accept="video/*" 
              id="contained-button-file" 
              type="file" 
              onChange={handleFileChange} 
              disabled={isUploading || uploadLocked || isInferring}
            />
            <Button 
              variant="contained" 
              component="span" 
              startIcon={<UploadOutlined />} 
              sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.neutral.light }}
              disabled={isUploading || uploadLocked || isInferring}
            >
              Select Video
            </Button>
          </label>
          {fileName && (
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleClearFile}
              disabled={isUploading || isInferring}
              sx={{ ml: 1 }}
            >
              Clear
            </Button>
          )}
        </Box>
        {fileName && (
          <Typography variant="subtitle1" sx={{ mt: 1, display: 'block' }}>
            Selected: {fileName}
          </Typography>
        )}
        {isInferring && (
          <Alert severity="info" sx={{ mt: 1 }}>
            Wildlife detection is currently running. You can stop it anytime using the button below.
          </Alert>
        )}
      </Box>      <Box mt="20px">
        <Typography gutterBottom>Sample Rate (frames per processing pass)</Typography>
        <Slider
          value={sampleRate}
          onChange={(e, newValue) => setSampleRate(newValue)}
          aria-labelledby="sample-rate-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
          disabled={isUploading || isInferring}
        />
      </Box>
      <Box mt="20px">
        <Typography gutterBottom>Confidence Threshold</Typography>
        <Slider
          value={confidence}
          onChange={(e, newValue) => setConfidence(newValue)}
          aria-labelledby="confidence-slider"
          valueLabelDisplay="auto"
          step={0.05}
          marks
          min={0.1}
          max={0.95}
          disabled={isUploading || isInferring}
        />
      </Box><Box mt="20px">
        <Box display="flex" alignItems="center" gap={2}>
          <Button 
            variant="contained" 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading || uploadLocked || isInferring}
            sx={{ 
              backgroundColor: theme.palette.primary.main, 
              color: theme.palette.neutral.light,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : isInferring ? 'Inference Running' : 'Upload Video'}
          </Button>
          
          {isInferring && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleStopInference}
              sx={{ 
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.background.default,
                }
              }}
            >
              Stop Inference
            </Button>
          )}
        </Box>
        
        {(isUploading || isInferring) && (
          <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
            {isUploading ? 'Uploading video file...' : 'Processing video for wildlife detection...'}
          </Typography>
        )}
      </Box>
       
     
    </Box>
  );
};

export default FeedUpload;