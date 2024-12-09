import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Grid, FormControl } from "@mui/material";

import PhoneInput, { Props as PhoneInputProps } from "../../components/inputs/phone";
import TextInput from "../../components/inputs/text";
import PasswordInput from "../../components/inputs/password";

import GoogleIcon from "@mui/icons-material/Google";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";

import { emailRegex, onlyNumbersRegex, phoneRegex, strongPasswordRegex } from "../../utils/regex";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import { Props as InputProps } from "../../components/inputs/text";
import { useForm } from "../../hooks/use-form";
import ErrorAlert from "../../components/alerts/errors";
import { ApiResponseJson, CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";
import AppButton from "../../components/buttons";
import Info from "../../components/alerts/info";
import Success from "../../components/alerts/success";
import { useAppRouter } from "../../hooks/router";

const SignupPage: React.FC = () => {
  const { appNavigate } = useAppRouter();
  const [info, setInfo] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);

  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);

  const [firstNameState, setFirstName, firstNameStatics] = useInput<InputProps>({
    stateProps: { isValid: true, showError: false, value: "" },
    staticsProps: {
      required: false,
      errorMsg: "First name should be with 2 - 40 characters ",
      label: "First name",
      onChange: (value) =>
        setFirstName((prev) => ({ ...prev, value, isValid: Boolean(!value || (value.length >= 2 && value.length <= 40)), showError: true })),
    },
  });

  const [lastNameState, setLastName, lastNameStatics] = useInput<InputProps>({
    stateProps: { isValid: true, showError: false, value: "" },
    staticsProps: {
      required: false,
      errorMsg: "Last name should be with 2 - 40 characters ",
      label: "Last name",
      onChange: (value) =>
        setLastName((prev) => ({ ...prev, value, isValid: Boolean(!value || (value.length >= 2 && value.length <= 40)), showError: true })),
    },
  });

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

  const [phoneNumberState, setPhoneNumber, phoneNumberStatics] = useInput<PhoneInputProps>({
    stateProps: { isValid: true, showError: false, value: "" },
    staticsProps: {
      required: false,
      errorMsg: "Phone number should be from IL and valid",
      label: "Phone number",
      countryCode: "+972",
      onChange: (value) => {
        const updatedValue = value.match(onlyNumbersRegex) && value.length <= 10 ? value : phoneNumberState.value;

        setPhoneNumber((prev) => ({
          ...prev,
          value: updatedValue,
          isValid: !updatedValue || Boolean(updatedValue.match(phoneRegex)),
          showError: true,
        }));
      },
    },
  });

  const signupRequest = useRequest<ApiResponseJson<SafeUser>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      method: "post",
      url: AuthEndPoints["SIGNUP"],
      data: {
        firstName: firstNameState.value || null,
        lastName: lastNameState.value || null,
        phoneNumber: phoneNumberState.value || null,
        email: emailState.value,
        password: passwordState.value,
      },
    },
  });

  const resendEmailVerificationRequest = useRequest<ApiResponseJson<{ message: string; remainAttempts: number }>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints.RESEND_EMAIL_VERIFICATION,
      method: "post",
      data: { email: signupRequest.data?.data?.email },
    },
  });

  const { isFormValid } = useForm({ inputs: [firstNameState, lastNameState, emailState, passwordState, phoneNumberState] });

  const handleNavigateSignIn = () => {
    appNavigate("SIGNIN");
  };

  const handleGoogleNavigation = () => {
    appNavigate("GOOGLE_AUTH");
  };

  // set the info from email verification
  useEffect(() => {
    let updatedInfo: string[] = [];
    if (resendEmailVerificationRequest.data?.data) {
      updatedInfo = [`${resendEmailVerificationRequest.data.message} (${resendEmailVerificationRequest?.data.data.remainAttempts} Attempts Remain)`];
    }

    setInfo(updatedInfo);
  }, [resendEmailVerificationRequest.data, signupRequest.data]);

  // set the errors from google and email verification max attempt
  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (resendEmailVerificationRequest.error) updatedErrors = [...updatedErrors, ...resendEmailVerificationRequest.error.customErrors];
    if (signupRequest.error) updatedErrors = [...updatedErrors, ...signupRequest.error.customErrors];
    setErrors(updatedErrors);
  }, [resendEmailVerificationRequest.error, signupRequest.error]);

  useEffect(() => {
    if (signupRequest.data) setSuccess([`You sign up successfully, Check you email for email verification link`]);
  }, [signupRequest.data]);

  const onCloseError = (index: number) => {
    if (!errors) return;
    setErrors(errors?.filter((_, i) => i !== index));
  };

  const onCloseInfo = (index: number) => {
    if (!info) return;
    setInfo(info?.filter((_, i) => i !== index));
  };

  const onCloseSuccess = (index: number) => {
    if (!success) return;
    setSuccess(success?.filter((_, i) => i !== index));
  };

  return (
    <FormControl
      sx={{
        display: "flex",
        boxShadow: 3,
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
        height: "auto",
        padding: "24px",
        borderRadius: "6px",
        margin: "auto",
      }}
    >
      <Container disableGutters>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "12px" }}>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          <AppButton variant="text" onClick={handleNavigateSignIn} text={`Already Have an Account? Sign In Here`} disabled={false} />
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextInput stateProps={firstNameState} staticsProps={firstNameStatics} />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextInput stateProps={lastNameState} staticsProps={lastNameStatics} />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <PhoneInput stateProps={phoneNumberState} staticsProps={phoneNumberStatics} />
            </Grid>

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
              {errors ? <ErrorAlert errors={errors} onClose={onCloseError} /> : null}
            </Grid>
            <Grid item xs={12}>
              {signupRequest.data?.data ? (
                <Box>
                  <AppButton
                    text={`Resend Email Verification`}
                    onClick={resendEmailVerificationRequest.fetchData}
                    loading={resendEmailVerificationRequest.loading}
                    disabled={
                      Boolean(resendEmailVerificationRequest.data?.data?.remainAttempts === 0) ||
                      resendEmailVerificationRequest.error?.errorResponse.response?.status === 400
                    }
                  />
                </Box>
              ) : (
                <AppButton onClick={signupRequest.fetchData} disabled={!isFormValid} text={"Sign Up"} loading={signupRequest.loading} />
              )}
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

export default SignupPage;
