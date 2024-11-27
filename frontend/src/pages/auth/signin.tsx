import React from "react";
import { Container, Button, Typography, Box, Grid, FormControl } from "@mui/material";

import PhoneInput, { Props as PhoneInputProps } from "../../components/inputs/phone";
import TextInput from "../../components/inputs/text";
import PasswordInput from "../../components/inputs/password";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";

import { emailRegex, onlyNumbersRegex, phoneRegex, strongPasswordRegex } from "../../utils/regex";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import { Props as InputProps } from "../../components/inputs/text";
import { useForm } from "../../hooks/use-form";
import ErrorAlert from "../../components/errors/error-alert";
import { CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";

const SignInPage: React.FC = () => {
  const [emailState, setEmail, emailStatics] = useInput<InputProps>({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      required: true,
      errorMsg: "Email should be in a valid structure",
      label: "Email",
      onChange: (value) => setEmail((prev) => ({ ...prev, value, isValid: Boolean(value.match(emailRegex)), showError: true })),
    },
  });

  const [passwordState, setPassword, passwordStatics] = useInput<InputProps>({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      required: true,
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

  const { data, error, fetchData, loading } = useRequest<SafeUser, CustomErrorMessage>({
    config: {
      method: "post",
      url: AuthEndPoints["SIGNIN"],
      data: {
        email: emailState.value,
        password: passwordState.value,
      },
    },
    axiosInstance: backendAxiosInstance,
  });

  const { isFormValid } = useForm({ inputs: [emailState, passwordState] });

  return (
    <FormControl>
      <Container disableGutters>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "48px" }}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <Grid container spacing={2}>
            {/* First Name */}

            {/* Email */}
            <Grid item xs={12}>
              <TextInput stateProps={emailState} staticsProps={emailStatics} />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <PasswordInput stateProps={passwordState} staticsProps={passwordStatics} />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <ErrorAlert errors={error} />

              <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }} onClick={fetchData} disabled={!isFormValid}>
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FormControl>
  );
};

export default SignInPage;
