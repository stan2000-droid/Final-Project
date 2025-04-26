import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import Navbar from "components/Navbar";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Username validation
    if (!form.username) {
      tempErrors.username = "Username is required";
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const validateCredentials = () => {
    const validCredentials = {
      username: "admin",
      password: "administrator"
    };

    if (form.username !== validCredentials.username) {
      setErrors(prev => ({ ...prev, username: "Invalid username" }));
      return false;
    }

    if (form.password !== validCredentials.password) {
      setErrors(prev => ({ ...prev, password: "Invalid password" }));
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && validateCredentials()) {
      console.log("Login successful");
      navigate("/dashboard"); // Redirect to dashboard after login
    }
  };

  return (
    <Box height="100vh">
      <Navbar showThemeButton={true} showProfile={false} showSearch={false} showSettings={false} showSidebar={false}/>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
      >
        <Box
          width="500px"
          p="3rem"
          borderRadius="8px"
          bgcolor={theme.palette.background.alt}
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography
            variant="h4"
            color={theme.palette.secondary[200]}
            textAlign="center"
            mb="1.5rem"
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={Boolean(errors.username)}
              helperText={errors.username}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: "1.5rem" }}
            >
              Login
            </Button>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                textAlign: "center",
                cursor: "pointer",
                color: theme.palette.secondary[300],
                "&:hover": {
                  color: theme.palette.secondary[100],
                }
              }}
              onClick={() => navigate("/cameraFeed")}
            >
              View Camera Feed
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;