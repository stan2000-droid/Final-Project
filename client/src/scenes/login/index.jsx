import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import Navbar from "components/Navbar";
import { Formik } from 'formik';
import * as yup from 'yup';
import Header from "components/Header";

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const initialValues = {
    username: "",
    password: "",
  };

  const validateCredentials = (values) => {
    const validCredentials = {
      username: "admin",
      password: "administrator"
    };

    if (values.username !== validCredentials.username || values.password !== validCredentials.password) {
      setSnackbar({
        open: true,
        message: "Login failed. Please check your credentials.",
        severity: "error"
      });
      return false;
    }
    return true;
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    if (validateCredentials(values)) {
      setSnackbar({
        open: true,
        message: "Login successful",
        severity: "success"
      });
      console.log("Login successful");
      navigate("/layout"); // Redirect to Layout route
    }
    setSubmitting(false);
  };

  return (
    <Box height="100%" bgcolor={theme.palette.background.default}>
      <Box
        sx={{
          position: "absolute",
          right: "1rem",
          zIndex: 1000,
          '@media (max-width: 600px)': {
            top: "0.5rem",
            right: "0.5rem",
          },
        }}
      >
        <Navbar showThemeButton={true} showProfile={false} showSearch={false} showSettings={false} showSidebar={false} showLoginButton={false} />
      </Box>
      
      {/* Snackbar component */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        padding="2rem"
      >
        <Box
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.75rem"
          boxShadow={`0px 5px 14px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`}
          p={isNonMobile ? "2.5rem" : "1.5rem"}
          width={isNonMobile ? "450px" : "90%"}
          m="2rem auto"
        >
          <Header title="Login" subtitle="Enter your credentials to access the dashboard" />

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="24px"
                  mt="2rem"
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.username) && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    sx={{
                      "& .MuiFilledInput-root": {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary[600] : theme.palette.grey[100],
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.password) && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    sx={{
                      "& .MuiFilledInput-root": {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary[600] : theme.palette.grey[100],
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: "bold",
                      padding: "0.75rem 0",
                      mt: 1,
                      "&:hover": { backgroundColor: theme.palette.primary.light }
                    }}
                  >
                    LOGIN
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        
        <Box 
          mt="0.10rem" 
          display="flex" 
          flexDirection={isNonMobile ? "row" : "column"} 
          justifyContent="center" 
          gap="1.5rem"
        >
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: theme.palette.secondary[300],
              "&:hover": {
                color: theme.palette.secondary[100],
              },
              textAlign: "center"
            }}
            onClick={() => navigate("/viewcamerafeed")}
          >
            View Camera Feed
          </Typography>
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: theme.palette.secondary[300],
              "&:hover": {
                color: theme.palette.secondary[100],
              },
              textAlign: "center"
            }}
            onClick={() => navigate("/subscribe")}
          >
            Subscribe for Notifications
          </Typography>
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: theme.palette.secondary[300],
              "&:hover": {
                color: theme.palette.secondary[100],
              },
              textAlign: "center"
            }}
            onClick={() => navigate("/unsubscribe")}
          >
            Unsubscribe from Notifications
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;