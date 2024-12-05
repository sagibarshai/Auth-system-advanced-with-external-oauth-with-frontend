import React, { useEffect, useMemo, useState } from "react";
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
import ErrorAlert from "../../components/alerts/errors";
import { CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";
import AppButton from "../../components/buttons";

import Info from "../../components/alerts/info";
import Success from "../../components/alerts/success";
import { useAppRouter } from "../../hooks/router";

const SignInPage: React.FC = () => {
  const { appNavigate, getPageState } = useAppRouter();
  const [info, setInfo] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);

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

  const signInRequest = useRequest<SafeUser, CustomErrorMessage>({
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
    appNavigate("SIGNUP");
  };

  const handleGoogleNavigation = () => {
    appNavigate("GOOGLE_AUTH");
  };

  const pageState = useMemo(() => getPageState(), []);

  // set the errors from the request, override the pageState error
  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (signInRequest.error) updatedErrors = [...updatedErrors, ...signInRequest.error.customErrors];
    setErrors(updatedErrors);
  }, [signInRequest.error]);

  // set the first error from pageState only for once!
  useEffect(() => {
    if (pageState.errors) {
      setErrors((prev) => (prev ? [...pageState.errors!, ...prev] : [...pageState.errors!]));
    }
  }, []);

  // update the info from the email verification
  useEffect(() => {
    // let updatedInfo: string[] = [];
    // if (pageState.info) updatedInfo = [...pageState.info];
    // setInfo(updatedInfo);
  }, []);

  // update the success from the pageState

  console.log(pageState);
  useEffect(() => {
    let updatedSuccess: string[] = [];
    if (pageState.success) updatedSuccess = [...pageState.success];
    setSuccess(updatedSuccess);
  }, []);

  const onCloseError = (index: number) => {
    if (!errors) return;
    setErrors(errors?.filter((_, i) => i !== index));
  };

  const onCloseInfo = (index: number) => {
    if (!info) return;
    setInfo(info.filter((_, idx) => idx !== index));
  };

  const onCloseSuccess = (index: number) => {
    if (!success) return;
    setSuccess(success.filter((_, idx) => idx !== index));
  };

  console.log("signInRequest.error?.errorResponse ", signInRequest.error?.errorResponse);

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
              {success ? <Success success={success} onClose={onCloseSuccess} /> : null}
            </Grid>
            <Grid item xs={12}>
              {info ? <Info info={info} onClose={onCloseInfo} /> : null}
            </Grid>
            <Grid item xs={12}>
              {errors && <ErrorAlert onClose={onCloseError} errors={errors} />}
            </Grid>
            <Grid item xs={12}>
              {signInRequest?.error?.errorResponse?.response?.status === 403 ? (
                <AppButton
                  onClick={signInRequest.fetchData}
                  disabled={!isFormValid}
                  text={"Resend Email Verification"}
                  loading={signInRequest.loading}
                />
              ) : null}

              <AppButton onClick={signInRequest.fetchData} disabled={!isFormValid} text={"Sign In"} loading={signInRequest.loading} />
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
