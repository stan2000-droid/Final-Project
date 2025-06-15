import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  FormGroup, 
  useTheme,
  Snackbar,
  Alert,
  FormHelperText,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from "components/Header";
import Navbar from "components/Navbar";

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  name: yup.string().required('Name is required'),
  surname: yup.string().required('Surname is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phoneNumber: yup.string()
    .matches(/^\+?[0-9]{7,15}$/, 'Phone number must be 7-15 digits and can start with +')
    .required('Phone number is required'),
  alertFrequency: yup.string().required('Alert frequency is required'),
  // At least one notification method must be selected
  smsAlerts: yup.boolean(),
  popNotifications: yup.boolean(),
  whatsappAlerts: yup.boolean(),
}).test(
  'at-least-one-notification',
  'At least one notification method must be selected',
  (values) => values.smsAlerts || values.popNotifications || values.whatsappAlerts
);

const Subscribe = () => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Check if at least one checkbox is selected before proceeding
    if (!values.smsAlerts && !values.popNotifications && !values.whatsappAlerts) {
      setSnackbar({
        open: true,
        message: 'At least one notification type must be selected',
        severity: 'error'
      });
      setSubmitting(false);
      return; // Stop the submission
    }
      try {
      // Prepare data with isSubscribed set to true
      const dataToSubmit = {
        ...values,
        isSubscribed: true // Set subscription status to true
      };
      
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/general/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setSnackbar({
        open: true,
        message: 'Successfully subscribed!',
        severity: 'success'
      });
      resetForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box height="100%">
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
        <Navbar showThemeButton={true} showProfile={false} showSearch={false} showSettings={false} showSidebar={false} showLoginButton={true} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minheight="100vh"       
        
        bgcolor={theme.palette.background.default}
        sx={{
          p:2,

          }
        }
      >
        <Box
          
          
          mt="5rem"
          borderRadius="8px"
          bgcolor={theme.palette.background.alt}
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          sx={{
            width: {
              xs: '90%',    // extra-small devices
              sm: '60%',    // small devices >=600px
              md: '40%',    // medium devices >=900px
              lg: '50%'     // large devices >=1200px
            },
          }}
        >
          <Typography
            variant="h4"
            color={theme.palette.secondary[100]}
            textAlign="center"
            mb="1.5rem"
            mt = "1rem"
            fontWeight={"bold"}
          >
            Subscribe to Get Notifications
          </Typography>

          <Box sx={{ p : "1rem"}}>
            <Formik
              initialValues={{
                username: '',
                name: '',
                surname: '',
                email: '',
                phoneNumber: '',
                smsAlerts: false,
                popNotifications: false,
                whatsappAlerts: false,
                alertFrequency: '2min'
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    gap="20px"
                    sx={{
                      "& .MuiFormControl-root": { mb: 2 },
                    }}
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
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Surname"
                      name="surname"
                      value={values.surname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.surname && Boolean(errors.surname)}
                      helperText={touched.surname && errors.surname}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="email"
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="tel"
                      label="Phone Number"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />

                    <FormGroup>
                      <Typography variant="h6" color={theme.palette.secondary[300]} gutterBottom>
                        Notification Preferences
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="smsAlerts"
                            checked={values.smsAlerts}
                            onChange={handleChange}
                            sx={{ color: theme.palette.secondary[300] }}
                          />
                        }
                        label="Get SMS Alerts"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="popNotifications"
                            checked={values.popNotifications}
                            onChange={handleChange}
                            sx={{ color: theme.palette.secondary[300] }}
                          />
                        }
                        label="Get Pop Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="whatsappAlerts"
                            checked={values.whatsappAlerts}
                            onChange={handleChange}
                            sx={{ color: theme.palette.secondary[300] }}
                          />
                        }
                        label="Get WhatsApp Alerts"
                      />
                      {(!values.smsAlerts && !values.popNotifications && !values.whatsappAlerts && 
                        (touched.smsAlerts || touched.popNotifications || touched.whatsappAlerts || 
                         Object.keys(touched).length > 0)) && (
                        <FormHelperText error>
                          At least one notification type must be selected
                        </FormHelperText>
                      )}
                    </FormGroup>

                    <Accordion sx={{ 
                      backgroundColor: theme.palette.background.alt,
                      color: theme.palette.secondary[300]
                    }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Select Frequency of Alerts</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.alertFrequency === '2min'}
                                onChange={() => handleChange({ target: { name: 'alertFrequency', value: '2min' } })}
                              />
                            }
                            label="2 Minutes"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.alertFrequency === '5min'}
                                onChange={() => handleChange({ target: { name: 'alertFrequency', value: '5min' } })}
                              />
                            }
                            label="5 Minutes"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.alertFrequency === '10min'}
                                onChange={() => handleChange({ target: { name: 'alertFrequency', value: '10min' } })}
                              />
                            }
                            label="10 Minutes"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.alertFrequency === '30min'}
                                onChange={() => handleChange({ target: { name: 'alertFrequency', value: '30min' } })}
                              />
                            }
                            label="30 Minutes"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.alertFrequency === '1hr'}
                                onChange={() => handleChange({ target: { name: 'alertFrequency', value: '1hr' } })}
                              />
                            }
                            label="1 Hour"
                          />
                        </FormGroup>
                      </AccordionDetails>
                    </Accordion>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        isSubmitting || 
                        Object.keys(errors).length > 0 || 
                        !values.username || 
                        !values.name || 
                        !values.surname || 
                        !values.email || 
                        !values.phoneNumber || 
                        !values.alertFrequency || 
                        (!values.smsAlerts && !values.popNotifications && !values.whatsappAlerts)
                      }
                      sx={{
                        mt: 2,
                        backgroundColor: theme.palette.secondary[300],
                        color: theme.palette.background.alt,
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        "&:hover": {
                          backgroundColor: theme.palette.secondary[100],
                        },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Subscribe;