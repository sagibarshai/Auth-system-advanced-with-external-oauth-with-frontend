import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Grid, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextInput from "../../components/inputs/text";
import { Props as InputProps } from "../../components/inputs/types";
import { useInput } from "../../hooks/use-input";
import { emailRegex, onlyNumbersRegex, phoneRegex, strongPasswordRegex } from "../../utils/regex";
import PhoneInput from "../../components/inputs/phone";

const SignupForm: React.FC = () => {
  const [firstNameState, setFirstName, firstNameStatics] = useInput({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      errorMsg: "First name should be with 2 - 40 characters ",
      label: "First name",
      onChange: (value) =>
        setFirstName((prev) => ({ ...prev, value, isValid: Boolean(!value || (value.length >= 2 && value.length <= 40)), showError: true })),
    },
  });

  const [lastNameState, setLastName, lastNameStatics] = useInput({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      errorMsg: "Last name should be with 2 - 40 characters ",
      label: "Last name",
      onChange: (value) =>
        setLastName((prev) => ({ ...prev, value, isValid: Boolean(!value || (value.length >= 2 && value.length <= 40)), showError: true })),
    },
  });

  const [emailState, setEmail, emailStatics] = useInput({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      errorMsg: "Email should be in a valid structure",
      label: "Email",
      onChange: (value) => setEmail((prev) => ({ ...prev, value, isValid: Boolean(value.match(emailRegex)), showError: true })),
    },
  });

  const [passwordState, setPassword, passwordStatics] = useInput({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      errorMsg: "Password should contain at least 1 symbol, 1 uppercase, 1 lowercase, 1 number and contain 6 - 30 characters",
      label: "Password",
      onChange: (value) =>
        setPassword((prev) => ({
          ...prev,
          value,
          isValid: Boolean(value.match(strongPasswordRegex) && value.length >= 6 && value.length <= 30),
          showError: true,
        })),
    },
  });
  const [phoneNumberState, setPhoneNumber, phoneNumberStatics] = useInput({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      errorMsg: "Phone number should be from IL and valid",
      label: "Phone number",
      onChange: (value) => {
        const updatedValue = value.match(onlyNumbersRegex) && value.length <= 10 ? value : phoneNumberState.value;

        setPhoneNumber((prev) => ({
          ...prev,
          value: updatedValue,
          isValid: Boolean(updatedValue.match(phoneRegex)),
          showError: true,
        }));
      },
    },
  });

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextInput stateProps={firstNameState} staticsProps={firstNameStatics} />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextInput stateProps={lastNameState} staticsProps={lastNameStatics} />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextInput stateProps={emailState} staticsProps={emailStatics} />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12}>
            <PhoneInput stateProps={phoneNumberState} staticsProps={phoneNumberStatics} />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextInput stateProps={passwordState} staticsProps={passwordStatics} />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignupForm;
