import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  useTheme,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import Header from "components/Header";
import Navbar from "components/Navbar";

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  name: yup.string().required('Name is required'),
});

const Unsubscribe = () => {
  const theme = useTheme();

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
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
                name: '',
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
                    </FormGroup>

                    
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
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
                      Unsubscribe
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