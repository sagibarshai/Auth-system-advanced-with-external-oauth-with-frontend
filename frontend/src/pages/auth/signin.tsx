import React, { useEffect, useMemo, useState } from "react";
import { Typography, Box, Grid, FormControl } from "@mui/material";

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
import { ApiResponseJson, CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";
import AppButton from "../../components/buttons";

import Info from "../../components/alerts/info";
import Success from "../../components/alerts/success";
import { useAppRouter } from "../../hooks/router";
import { setUser } from "../../redux/features/user";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppIconGoogle } from "../../icons";
import GoogleButton from "../../components/buttons/google";

const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { appNavigate, getPageState } = useAppRouter();
  const [info, setInfo] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);
  const [unVerifyEmail, setUnVerifyEmail] = useState<string | null>(null);

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
  // set the UnVerifyEmail to the one that is unverified
  useEffect(() => {
    if (signInRequest.error?.errorResponse.response?.status === 403) {
      setUnVerifyEmail(emailState.value);
    }
  }, [signInRequest.error]);

  // set the UnVerifyEmail to null if email changes
  useEffect(() => {
    setUnVerifyEmail(null);
  }, [emailState.value]);

  const resendEmailVerificationRequest = useRequest<ApiResponseJson<{ message: string; remainAttempts: number }>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints.RESEND_EMAIL_VERIFICATION,
      method: "post",
      data: { email: unVerifyEmail },
    },
  });

  const { isFormValid } = useForm({ inputs: [emailState, passwordState] });

  const handleNavigateSignUp = () => {
    appNavigate("SIGNUP");
  };

  const pageState = useMemo(() => getPageState(), []);

  // set the errors from the request, override the pageState error
  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (signInRequest.error) updatedErrors = [...updatedErrors, ...signInRequest.error.customErrors];
    if (resendEmailVerificationRequest.error) updatedErrors = [...updatedErrors, ...resendEmailVerificationRequest.error.customErrors];
    setErrors(updatedErrors);
  }, [signInRequest.error, resendEmailVerificationRequest.error]);

  // set the first error from pageState only for once!
  useEffect(() => {
    if (pageState.errors) {
      setErrors((prev) => (prev ? [...pageState.errors!, ...prev] : [...pageState.errors!]));
    }
  }, []);

  // update the info from the email verification
  useEffect(() => {
    let updatedInfo: string[] = [];
    if (resendEmailVerificationRequest.data)
      updatedInfo = [
        `${resendEmailVerificationRequest.data.message}, You have ${resendEmailVerificationRequest.data.data?.remainAttempts} remain attempt`,
      ];
    setInfo(updatedInfo);
  }, [resendEmailVerificationRequest.data]);

  // update the success from the pageState
  useEffect(() => {
    let updatedSuccess: string[] = [];
    if (pageState.success) updatedSuccess = [...pageState.success];
    setSuccess(updatedSuccess);
  }, []);

  // update redux  (user slice)
  useEffect(() => {
    if (signInRequest.data?.data) {
      dispatch(setUser(signInRequest.data.data));
      appNavigate("HOME");
    }
  }, [signInRequest.data]);

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

  return (
    <FormControl>
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
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
        {success && success.length ? (
          <Grid item xs={12}>
            <Success success={success} onClose={onCloseSuccess} />
          </Grid>
        ) : null}
        {info && info.length ? (
          <Grid item xs={12}>
            <Info info={info} onClose={onCloseInfo} />
          </Grid>
        ) : null}
        {errors && errors.length ? (
          <Grid item xs={12}>
            <ErrorAlert onClose={onCloseError} errors={errors} />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {unVerifyEmail ? (
            <AppButton
              text={`Resend email verification`}
              onClick={resendEmailVerificationRequest.fetchData}
              loading={resendEmailVerificationRequest.loading}
              disabled={Boolean(resendEmailVerificationRequest.data?.data?.remainAttempts === 0)}
            />
          ) : null}

          <AppButton onClick={signInRequest.fetchData} disabled={!isFormValid} text={"Sign In"} loading={signInRequest.loading} />
        </Grid>
      </Grid>

      <GoogleButton />

      <AppButton variant="text" onClick={handleNavigateSignUp} text={`Don't have an account? Sign up here`} disabled={false} />
    </FormControl>
  );
};

export default SignInPage;
