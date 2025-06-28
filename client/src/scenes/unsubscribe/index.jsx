import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  useTheme,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
  FormHelperText,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import Header from "components/Header";
import Navbar from "components/Navbar";

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  phoneNumber: yup.string()
    .matches(/^\+?[0-9]{7,15}$/, 'Phone number must be 7-15 digits and can start with +')
    .required('Phone number is required'),
  smsAlerts: yup.boolean(),
  popNotifications: yup.boolean(),
  whatsappAlerts: yup.boolean(),
  deleteData: yup.boolean()
}).test(
  'at-least-one-checked-or-delete-data',
  'At least one notification type must be selected if you choose to keep your information',
  function(values) {
    // If deleteData is false (keeping information), then at least one checkbox must be selected
    if (values.deleteData === false) {
      return values.smsAlerts || values.popNotifications || values.whatsappAlerts;
    }
    // If deleteData is true (deleting information), no checkbox is required
    return true;
  }
);

const Unsubscribe = () => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    invalidFields: []
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/general/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle authentication failure
        if (data.invalidFields && data.invalidFields.length > 0) {
          const fieldMessage = data.invalidFields.length === 1 
            ? `Invalid ${data.invalidFields[0]}` 
            : `Invalid ${data.invalidFields.join(' and ')}`;
          
          setSnackbar({
            open: true,
            message: `Authentication failed. ${fieldMessage}.`,
            severity: 'error',
            invalidFields: data.invalidFields
          });
        } else {
          setSnackbar({
            open: true,
            message: data.message || 'An error occurred',
            severity: 'error',
            invalidFields: []
          });
        }
      } else {
        // Success case
        if (data.deleteData) {
          setSnackbar({
            open: true,
            message: 'Successfully unsubscribed and deleted your information from the database.',
            severity: 'success',
            invalidFields: []
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Successfully unsubscribed while keeping your information in the database.',
            severity: 'success',
            invalidFields: []
          });
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Network error. Please try again later.',
        severity: 'error',
        invalidFields: []
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
      {/* Snackbar component */}
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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minheight="100vh"       
        bgcolor={theme.palette.background.default}
        sx={{ p: 2 }}
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
            mt="1rem"
            fontWeight="bold"
          >
            Unsubscribe from Notifications
          </Typography>

          <Box sx={{ p: "1rem" }}>
            <Formik
              initialValues={{
                username: '',
                phoneNumber: '',
                smsAlerts: false,
                popNotifications: false,
                whatsappAlerts: false,
                alertFrequency: '2min',
                deleteData: false
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
                        Select Services to Unsubscribe From
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
                        label="SMS Alerts"
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
                        label="Pop Notifications"
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
                        label="WhatsApp Alerts"
                      />
                      {(!values.smsAlerts && !values.popNotifications && !values.whatsappAlerts && !values.deleteData) && touched.username && (
                        <FormHelperText error>
                          At least one notification type must be selected if you choose to keep your information
                        </FormHelperText>
                      )}
                    </FormGroup>

                    <Typography variant="h6" color={theme.palette.secondary[300]} gutterBottom>
                      Data Deletion Preference
                    </Typography>
                    <RadioGroup
                      name="deleteData"
                      value={values.deleteData.toString()}
                      onChange={(e) => {
                        const isDelete = e.target.value === 'true';
                        handleChange({
                          target: {
                            name: 'deleteData',
                            value: isDelete,
                          },
                        });
                      }}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio sx={{ color: theme.palette.secondary[300] }} />}
                        label={
                          <Typography color={theme.palette.secondary[300]}>
                            Delete my information from the database
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio sx={{ color: theme.palette.secondary[300] }} />}
                        label={
                          <Typography color={theme.palette.secondary[300]}>
                            Keep my information in the database
                          </Typography>
                        }
                      />
                    </RadioGroup>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || 
                        (!values.deleteData && !values.smsAlerts && !values.popNotifications && !values.whatsappAlerts)}
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
                      {values.deleteData ? "Unsubscribe and Delete" : "Unsubscribe"}
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Unsubscribe;