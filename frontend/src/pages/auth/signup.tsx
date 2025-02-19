import React, { useEffect, useState } from "react";
import { Typography, Grid2, FormControl } from "@mui/material";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";
import { useAppRouter } from "../../hooks/router";
import { useForm } from "../../hooks/use-form";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import TextInput from "../../components/inputs/text";
import PasswordInput from "../../components/inputs/password";
import AppButton from "../../components/buttons";
import GoogleButton from "../../components/buttons/google";

import { emailRegex, onlyNumbersRegex, phoneRegex, strongPasswordRegex } from "../../utils/regex";

import { Props as InputProps } from "../../components/inputs/text";
import { ApiResponseJson, CustomErrorMessage, ResendEmailVerification, SafeUser } from "../../api/backend/auth/types";
import AppAlert from "../../components/alerts";

const SignupPage: React.FC = () => {
  const { appNavigate } = useAppRouter();

  const [info, setInfo] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);

  // define first name
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

  // define last name
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

  // define email
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

  // define password
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

  // define phone number
  const [phoneNumberState, setPhoneNumber, phoneNumberStatics] = useInput<InputProps>({
    stateProps: { isValid: true, showError: false, value: "" },
    staticsProps: {
      required: false,
      errorMsg: "Phone number should be from IL and valid",
      label: "Phone number",
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

  const { isFormValid } = useForm({ inputs: [firstNameState, lastNameState, emailState, passwordState, phoneNumberState] });

  // signup request handler
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

  // resend email verification request handler
  const resendEmailVerificationRequest = useRequest<ApiResponseJson<ResendEmailVerification>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints.RESEND_EMAIL_VERIFICATION,
      method: "post",
      data: { email: signupRequest.data?.data?.email },
    },
  });

  // set the info messages from resend email verification request
  useEffect(() => {
    let updatedInfo: string[] = [];
    if (resendEmailVerificationRequest.data?.data) {
      updatedInfo = [
        `${resendEmailVerificationRequest.data.message}, (${
          resendEmailVerificationRequest.data.data?.remainAttempts === 0 ? "No" : resendEmailVerificationRequest.data.data?.remainAttempts
        } retries left)`,
      ];
    }
    setInfo(updatedInfo);
  }, [resendEmailVerificationRequest.data]);

  // set the errors from google OAuth and email verification max attempt
  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (resendEmailVerificationRequest.error) updatedErrors = [...resendEmailVerificationRequest.error.customErrors];
    if (signupRequest.error) updatedErrors = [...updatedErrors, ...signupRequest.error.customErrors];
    setErrors(updatedErrors);
  }, [resendEmailVerificationRequest.error, signupRequest.error]);

  // set the success message after successfully signup
  useEffect(() => {
    if (signupRequest.data)
      setSuccess([
        `${signupRequest.data.data?.email} You've signed up successfully! Please check your inbox for a verification link to activate your account.`,
      ]);
  }, [signupRequest.data]);

  // handlers
  const onCloseMessage = (type: "info" | "error" | "success", index: number) => {
    if (type === "info") {
      if (!info) return;
      setInfo(info.filter((_, idx) => idx !== index));
    } else if (type === "success") {
      if (!success) return;
      setSuccess(success.filter((_, idx) => idx !== index));
    } else {
      if (!errors) return;
      setErrors(errors?.filter((_, i) => i !== index));
    }
  };
  const handleNavigateSignIn = () => {
    appNavigate("SIGNIN");
  };

  return (
    <FormControl sx={{ width: "500px", height: "auto", maxHeight: "90%", overflowY: "auto", display: "flex", alignItems: "center" }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>

      {/* First Name */}
      <Grid2 container spacing={1} sx={{ width: "100%", height: "100%" }}>
        <Grid2 size={6}>
          <TextInput stateProps={firstNameState} staticsProps={firstNameStatics} />
        </Grid2>

        {/* Last Name */}
        <Grid2 size={6}>
          <TextInput stateProps={lastNameState} staticsProps={lastNameStatics} />
        </Grid2>

        {/* Email */}
        <Grid2 size={6}>
          <TextInput stateProps={emailState} staticsProps={emailStatics} />
        </Grid2>

        {/* Phone Number */}
        <Grid2 size={6}>
          <TextInput stateProps={phoneNumberState} staticsProps={phoneNumberStatics} />
        </Grid2>

        {/* Password */}
        <Grid2 size={12}>
          <PasswordInput stateProps={passwordState} staticsProps={passwordStatics} />
        </Grid2>

        {/* Messages */}
        {success && success.length ? (
          <Grid2 size={12}>
            <AppAlert severity="success" messages={success} onClose={(index) => onCloseMessage("success", index)} />
          </Grid2>
        ) : null}
        {info && info.length ? (
          <Grid2 size={12}>
            <AppAlert severity="info" messages={info} onClose={(index) => onCloseMessage("info", index)} />
          </Grid2>
        ) : null}
        {errors && errors.length ? (
          <Grid2 size={12}>
            <AppAlert severity="error" messages={errors} onClose={(index) => onCloseMessage("error", index)} />
          </Grid2>
        ) : null}
        <Grid2 size={12}>
          {/* Email verification button */}
          {signupRequest.data?.data ? (
            <AppButton
              text={`Resend email verification`}
              onClick={resendEmailVerificationRequest.fetchData}
              loading={resendEmailVerificationRequest.loading}
              disabled={
                Boolean(resendEmailVerificationRequest.data?.data?.remainAttempts === 0) ||
                resendEmailVerificationRequest.error?.errorResponse.response?.status === 400
              }
            />
          ) : (
            // Signup button
            <AppButton onClick={signupRequest.fetchData} disabled={!isFormValid} text={"Sign Up"} loading={signupRequest.loading} />
          )}
        </Grid2>
      </Grid2>

      {/* Google OAuth */}
      <GoogleButton />

      {/* Navigate to signin */}
      <AppButton variant="text" onClick={handleNavigateSignIn} text={`Already have an account? Sign in here`} disabled={false} />
    </FormControl>
  );
};

export default SignupPage;
