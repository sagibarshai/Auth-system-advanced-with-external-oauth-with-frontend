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
import ErrorAlert from "../../components/errors";
import { ApiResponseJson, CustomErrorMessage, SafeUser } from "../../api/backend/auth/types";
import AppButton from "../../components/buttons";
import { useNavigate } from "react-router-dom";
import Info from "../../components/info";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<string[] | null>(null);
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

  const singUpRequest = useRequest<ApiResponseJson<SafeUser>, CustomErrorMessage>({
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

  const resendEmailVerificationRequest = useRequest<{ message: string; remainAttempts: number }, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints.RESEND_EMAIL_VERIFICATION,
      method: "post",
      data: { email: singUpRequest.data?.data?.email },
    },
  });

  const { isFormValid } = useForm({ inputs: [firstNameState, lastNameState, emailState, passwordState, phoneNumberState] });

  const handleNavigateSignIn = () => {
    navigate("/auth/signin");
  };

  const handleGoogleNavigation = () => {
    navigate("/auth/google");
  };

  useEffect(() => {
    let updatedInfo: string[] = [];
    if (resendEmailVerificationRequest.data) {
      if (resendEmailVerificationRequest.data.remainAttempts > 0) {
        updatedInfo = [`${resendEmailVerificationRequest.data.message} (${resendEmailVerificationRequest.data.remainAttempts} Attempts Remain)`];
      } else {
        let updatedErrors: CustomErrorMessage = errors || [];
        setErrors([...updatedErrors, { field: "email", message: `${resendEmailVerificationRequest.data.message} No Attempts Remain)` }]);
      }
    }

    if (singUpRequest.data)
      updatedInfo = [...updatedInfo, `We just sent email verification to your email address ${singUpRequest.data.data?.email},`];

    setInfo(updatedInfo);
  }, [resendEmailVerificationRequest.data, singUpRequest.data]);

  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (resendEmailVerificationRequest.error) updatedErrors = [...updatedErrors, ...resendEmailVerificationRequest.error];
    if (singUpRequest.error) updatedErrors = [...updatedErrors, ...singUpRequest.error];
    setErrors(updatedErrors);
  }, [resendEmailVerificationRequest.error, singUpRequest.error]);

  const onCloseError = (index: number) => {
    if (!errors) return;
    setErrors(errors?.filter((_, i) => i !== index));
  };

  const onCloseInfo = (index: number) => {
    if (!info) return;
    setInfo(info?.filter((_, i) => i !== index));
  };

  return (
    <FormControl>
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
              {info ? <Info info={info} onClose={onCloseInfo} /> : null}
            </Grid>
            <Grid item xs={12}>
              <ErrorAlert errors={errors} onClose={onCloseError} />
            </Grid>
            <Grid item xs={12}>
              {singUpRequest.data?.data ? (
                <Box>
                  <AppButton
                    onClick={resendEmailVerificationRequest.fetchData}
                    text={`Resend Email Verification`}
                    loading={resendEmailVerificationRequest.loading}
                    disabled={Boolean(resendEmailVerificationRequest.data?.remainAttempts === 0)}
                  />
                </Box>
              ) : (
                <AppButton onClick={singUpRequest.fetchData} disabled={!isFormValid} text={"Sign Up"} loading={singUpRequest.loading} />
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
