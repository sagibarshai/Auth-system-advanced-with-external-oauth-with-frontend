import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Grid, FormControl } from "@mui/material";

import TextInput from "../../components/inputs/text";
import PasswordInput from "../../components/inputs/password";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";

import { emailRegex, strongPasswordRegex } from "../../utils/regex";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import { Props as InputProps } from "../../components/inputs/text";
import { useForm } from "../../hooks/use-form";
import ErrorAlert from "../../components/errors/error-alert";
import { CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";
import Spinner from "../../components/spinners";
import GoogleOAuthButton from "./google";
import AppButton from "../../components/buttons";
import useQueryParams from "../../hooks/use-query-params";
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const [googleError, setGoogleError] = useState<CustomErrorMessage | null>(null);

  const navigate = useNavigate();

  const { getParam } = useQueryParams();

  const [emailState, setEmail, emailStatics] = useInput<InputProps>({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      type: "email",
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

  useEffect(() => {
    setGoogleError(null);
    const errors = getParam<CustomErrorMessage>("errors");
    if (errors) setGoogleError(errors);
  }, []);

  const handleNavigateSignUp = () => {
    navigate("/auth/signup");
  };

  return (
    <FormControl>
      <Container disableGutters>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "12px" }}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <AppButton variant="text" onClick={handleNavigateSignUp} text={`Don't Have Account yet? Sign Up Here`} disabled={false} />

          <Grid container spacing={2}>
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
              <ErrorAlert errors={googleError || error} />

              <AppButton onClick={fetchData} disabled={!isFormValid} text={loading ? <Spinner loading={loading} /> : "Sign In"} />
            </Grid>
          </Grid>
          <GoogleOAuthButton />
        </Box>
      </Container>
    </FormControl>
  );
};

export default SignInPage;
