import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, FormControl } from "@mui/material";

import TextInput from "../../components/inputs/text";
import PasswordInput from "../../components/inputs/password";

import GoogleIcon from "@mui/icons-material/Google";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";

import { emailRegex, strongPasswordRegex } from "../../utils/regex";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import { Props as InputProps } from "../../components/inputs/text";
import { useForm } from "../../hooks/use-form";
import ErrorAlert from "../../components/errors";
import { CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";
import AppButton from "../../components/buttons";
import { useLocation, useNavigate } from "react-router-dom";
import Info from "../../components/info";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);
  const location: { state: { errors: CustomErrorMessage; info: string[] } } = useLocation();

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

  const singInRequest = useRequest<SafeUser, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      method: "post",
      url: AuthEndPoints["SIGNIN"],
      data: {
        email: emailState.value,
        password: passwordState.value,
      },
    },
  });

  const { isFormValid } = useForm({ inputs: [emailState, passwordState] });

  const handleNavigateSignUp = () => {
    navigate("/auth/signUp");
  };

  const handleGoogleNavigation = () => {
    navigate("/auth/google");
  };

  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (location?.state?.errors) updatedErrors = [...location.state.errors];
    if (singInRequest.error) updatedErrors = [...updatedErrors, ...singInRequest.error];
    setErrors(updatedErrors);
  }, [singInRequest.error]);

  useEffect(() => {
    let updatedInfo: string[] = [];
    if (location?.state?.info) updatedInfo = [...location.state.info];
    setInfo(updatedInfo);
  }, []);

  const onCloseError = (index: number) => {
    if (!errors) return;
    setErrors(errors?.filter((_, i) => i !== index));
  };

  const onCloseInfo = (index: number) => {
    if (!info) return;
    setInfo(info.filter((_, idx) => idx !== index));
  };

  return (
    <FormControl>
      <Container disableGutters>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "12px" }}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <AppButton variant="text" onClick={handleNavigateSignUp} text={`Don't Have an Account? Sign Up Here`} disabled={false} />
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
              {info ? <Info info={info} onClose={onCloseInfo} /> : null}
            </Grid>
            <Grid item xs={12}>
              {errors && <ErrorAlert onClose={onCloseError} errors={errors} />}
            </Grid>
            <Grid item xs={12}>
              <AppButton onClick={singInRequest.fetchData} disabled={!isFormValid} text={"Sign In"} loading={singInRequest.loading} />
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
