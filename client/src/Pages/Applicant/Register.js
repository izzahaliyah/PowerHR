import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Logo from "../../Assets/Logo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";

// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import { PasswordSharp } from '@mui/icons-material';

//validation of password and email
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function ApplicantRegister() {
  const theme = createTheme();

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  //validate inputs
  const validate = () => {
    let temp = {};
    temp.name = user.name ? "" : "This field is required.";
    temp.username = user.username ? "" : "This field is required.";
    temp.password = PWD_REGEX.test(user.password)
      ? ""
      : "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.";
    temp.email = EMAIL_REGEX.test(user.email)
      ? ""
      : "Email is not valid.";
    temp.confirmPassword =
      user.confirmPassword === user.password ? "" : "Passwords do not match";
    temp.contact =
      user.contact.length === 10
        ? ""
        : "Contact number must be 10 digits";

    setError({
      ...temp,
    });

    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/applicants/register`, user)
      .then((res) => {
        setSuccess(true);
        window.alert("You have successfully registered!");
        // go to login page
        window.location.href = "/";
      })
      .catch((err) => {
        // console.log(err);
        // setError({ ...error, fetchError: true, fetchErrorMsg: err.response.data.message });
        validate();
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid black",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "10vh",
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "grey.900" }}
            alt="Your logo."
            src={Logo}
          />
          <Typography sx={{ mb: 2 }} variant="body">
            Power HR System
          </Typography>
          <Typography component="h1" variant="h5">
            Let's get started!
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => handleSubmit(e)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="applicantName"
                  required
                  fullWidth
                  id="applicantName"
                  label="Full Name"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                  autoFocus
                  {...(error.name && {
                    error: true,
                    helperText: error.name,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="Username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  autoFocus
                  {...(error.username && {
                    error: true,
                    helperText: error.username,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  {...(error.email && {
                    error: true,
                    helperText: error.email,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  {...(error.password && {
                    error: true,
                    helperText: error.password,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                  value={user.confirmPassword}
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                  {...(error.confirmPassword && {
                    error: true,
                    helperText: error.confirmPassword,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contact"
                  label="Contact Number"
                  name="contact"
                  autoComplete="contact"
                  value={user.contact}
                  onChange={(e) =>
                    setUser({ ...user, contact: e.target.value })
                  }
                  {...(error.contact && {
                    error: true,
                    helperText: error.contact,
                  })}
                />
              </Grid>
              {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="agreeTermCondition" color="primary" />}
                label="By creating account, you agree to our Terms of Service and Privacy Policy."
              />
            </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => handleSubmit(e)}
            >
              Register
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}

export default ApplicantRegister;
