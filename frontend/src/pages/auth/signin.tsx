import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, FormControl } from "@mui/material";

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
import GoogleIcon from "@mui/icons-material/Google";
import AppButton from "../../components/buttons";
import { useLocation, useNavigate } from "react-router-dom";
import Info from "../../components/info";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const accountVerificationInfo = location.state?.data;
    if (accountVerificationInfo) setInfo(accountVerificationInfo);
  }, []);

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

  const { data, error, fetchData, loading, setErrorManfully } = useRequest<SafeUser, CustomErrorMessage | null>({
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
    setErrorManfully(null);
    const errors = location.state?.errors;
    if (errors) setErrorManfully(errors);
  }, []);

  const handleNavigateSignUp = () => {
    navigate("/auth/signup");
  };

  const handleGoogleNavigation = () => {
    navigate("/auth/google");
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
              <Info info={info} />
              <ErrorAlert errors={error} />
              <AppButton onClick={fetchData} disabled={!isFormValid} text={loading ? <Spinner loading={loading} /> : "Sign In"} />
            </Grid>
          </Grid>
          <AppButton
            variant="text"
            onClick={handleGoogleNavigation}
            text={
              <Box sx={{ display: "flex", gap: "12px" }}>
                <GoogleIcon /> Continue With Google
              </Box>
            }
          />
        </Box>
      </Container>
    </FormControl>
  );
};

export default SignInPage;
