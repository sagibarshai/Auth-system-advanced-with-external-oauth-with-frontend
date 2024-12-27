import React, { useEffect, useMemo, useState } from "react";
import { Typography, Grid2, FormControl } from "@mui/material";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";
import { useForm } from "../../hooks/use-form";
import { useAppRouter } from "../../hooks/router";
import { setUser } from "../../redux/features/user";
import { useAppDispatch } from "../../hooks/redux";

import AppButton from "../../components/buttons";
import TextInput from "../../components/inputs/text";
import PasswordInput from "../../components/inputs/password";

import GoogleButton from "../../components/buttons/google";

import { emailRegex, strongPasswordRegex } from "../../utils/regex";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import { Props as InputProps } from "../../components/inputs/text";
import { ApiResponseJson, CustomErrorMessage, EmailVerificationResponse, ResendEmailVerification, SafeUser } from "../../api/backend/auth/types";
import AppAlert from "../../components/alerts";

const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { appNavigate, getPageState } = useAppRouter();

  const [info, setInfo] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);

  const [unVerifyEmail, setUnVerifyEmail] = useState<string | null>(null);

  // define email
  const [emailState, setEmail, emailStatics] = useInput<InputProps>({
    stateProps: { isValid: false, showError: false, value: "" }, // here please
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
  const { isFormValid } = useForm({ inputs: [emailState, passwordState] });

  // sign in request handler
  const signInRequest = useRequest<ApiResponseJson<SafeUser>, CustomErrorMessage>({
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

  // email verification request handler
  const resendEmailVerificationRequest = useRequest<ApiResponseJson<ResendEmailVerification>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints.RESEND_EMAIL_VERIFICATION,
      method: "post",
      data: { email: unVerifyEmail },
    },
  });

  const pageState = useMemo(() => getPageState<EmailVerificationResponse>(), []);

  // set the UnVerifyEmail if signin request fails and return status code 403 (indicates that not verified)
  useEffect(() => {
    if (signInRequest.error?.errorResponse.response?.status === 403) {
      setUnVerifyEmail(emailState.value);
    }
  }, [signInRequest.error]);

  // set the UnVerifyEmail to null again if email changes
  useEffect(() => {
    setUnVerifyEmail(null);
  }, [emailState.value]);

  // set the errors from email verification and signin requests, override the pageState error
  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (signInRequest.error) updatedErrors = [...updatedErrors, ...signInRequest.error.customErrors];
    if (resendEmailVerificationRequest.error) updatedErrors = [...updatedErrors, ...resendEmailVerificationRequest.error.customErrors];
    setErrors(updatedErrors);
  }, [signInRequest.error, resendEmailVerificationRequest.error]);

  useEffect(() => {
    // set the first error from pageState only for once!
    if (pageState.errors) {
      setErrors((prev) => (prev ? [...pageState.errors!, ...prev] : [...pageState.errors!]));
    }
    // set the email from page state only for once
    const email = pageState.data?.email;
    if (email) setEmail((prev) => ({ ...prev, value: email }));
  }, [pageState]);

  // update the info from the email verification
  useEffect(() => {
    let updatedInfo: string[] = [];
    if (resendEmailVerificationRequest.data)
      updatedInfo = [
        `${resendEmailVerificationRequest.data.message}, (${
          resendEmailVerificationRequest.data.data?.remainAttempts === 0 ? "No" : resendEmailVerificationRequest.data.data?.remainAttempts
        } retries left)`,
      ];
    setInfo(updatedInfo);
  }, [resendEmailVerificationRequest.data]);

  // update the success from the pageState only for once (use for email verification success after click on the link from mail)
  useEffect(() => {
    let updatedSuccess: string[] = [];
    if (pageState.success) updatedSuccess = [...pageState.success];
    setSuccess(updatedSuccess);
  }, []);

  // update user with redux after signin is complete successfully
  useEffect(() => {
    if (signInRequest.data?.data) {
      dispatch(setUser(signInRequest.data.data));
      appNavigate("HOME");
    }
  }, [signInRequest.data]);

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

  const handleNavigateSignUp = () => {
    appNavigate("SIGNUP");
  };

  return (
    <FormControl sx={{ width: "500px", height: "auto", maxHeight: "90%", overflowY: "auto", display: "flex", alignItems: "center" }}>
      {/* title */}
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>

      <Grid2 container spacing={1} sx={{ width: "100%", height: "100%" }}>
        {/* Email */}
        <Grid2 size={12}>
          <TextInput stateProps={emailState} staticsProps={emailStatics} />
        </Grid2>

        {/* Password */}
        <Grid2 size={12}>
          <PasswordInput stateProps={passwordState} staticsProps={passwordStatics} />
        </Grid2>

        {/* Messages  */}
        {success && success.length ? (
          <Grid2 size={12}>
            <AppAlert severity="success" messages={success} onClose={(index) => onCloseMessage("error", index)} />
          </Grid2>
        ) : null}
        {info && info.length ? (
          <Grid2 size={12}>
            <AppAlert severity="info" messages={info} onClose={(index) => onCloseMessage("error", index)} />
          </Grid2>
        ) : null}
        {errors && errors.length ? (
          <Grid2 size={12}>
            <AppAlert severity="error" messages={errors} onClose={(index) => onCloseMessage("error", index)} />
          </Grid2>
        ) : null}

        {/* Email verification button */}
        <Grid2 size={12}>
          {unVerifyEmail ? (
            <AppButton
              text={`Resend email verification`}
              onClick={resendEmailVerificationRequest.fetchData}
              loading={resendEmailVerificationRequest.loading}
              disabled={Boolean(resendEmailVerificationRequest.data?.data?.remainAttempts === 0)}
            />
          ) : null}

          {/* SignIn Button */}
          <AppButton onClick={signInRequest.fetchData} disabled={!isFormValid} text={"Sign In"} loading={signInRequest.loading} />
        </Grid2>
      </Grid2>

      {/* Google Auth */}
      <GoogleButton />

      {/* Navigate to signup */}
      <AppButton variant="text" onClick={handleNavigateSignUp} text={`Don't have an account? Sign up here`} disabled={false} />
    </FormControl>
  );
};

export default SignInPage;
