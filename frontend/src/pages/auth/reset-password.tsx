import { FormControl, Grid2, Typography } from "@mui/material";
import PasswordInput from "../../components/inputs/password";
import AppButton from "../../components/buttons";
import { useInput } from "../../hooks/use-input";
import { Props as InputProps } from "../../components/inputs/types";
import { strongPasswordRegex } from "../../utils/regex";
import { useAppRouter } from "../../hooks/router";
import { useRequest } from "../../hooks/use-request";
import { ApiResponseJson, CustomErrorMessage, ResetPasswordResponse } from "../../api/backend/auth/types";
import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";
import { useEffect, useState } from "react";
import AppAlert from "../../components/alerts";

const ResetPasswordPage: React.FC = () => {
  const { getRouteParams, appNavigate } = useAppRouter();

  const userId = getRouteParams<string>("id");
  const token = getRouteParams<string>("token");

  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);

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

  const [confirmPasswordState, setConfirmPassword, confirmPasswordStatics] = useInput<InputProps>({
    stateProps: { isValid: false, showError: false, value: "" },
    staticsProps: {
      required: true,
      errorMsg: "Confirm password should match the password",
      label: "Confirm Password",
      onChange: (value) =>
        setConfirmPassword((prev) => ({
          ...prev,
          value,
          isValid: Boolean(value.match(strongPasswordRegex) && value.length >= 6 && value.length <= 30),
          showError: true,
        })),
    },
  });

  const { data, error, fetchData, loading } = useRequest<ApiResponseJson<ResetPasswordResponse>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints["RESET_PASSWORD"],
      method: "post",
      data: {
        id: userId,
        token,
        password: passwordState.value,
      },
    },
  });

  const isFormValid = passwordState.isValid && passwordState.value === confirmPasswordState.value;

  const onSubmitResetPassword = () => {
    fetchData();
  };

  useEffect(() => {
    if (error) setErrors(error.customErrors);
  }, [error]);

  const onCloseMessage = (type: "info" | "error" | "success", index: number) => {
    // if (type === "info") {
    //   if (!info) return;
    //   setInfo(info.filter((_, idx) => idx !== index));
    // } else if (type === "success") {
    //   if (!success) return;
    //   setSuccess(success.filter((_, idx) => idx !== index));
    // } else {
    if (!errors) return;
    setErrors(errors?.filter((_, i) => i !== index));
    // }
  };

  useEffect(() => {
    if (data && data.message) {
      appNavigate("SIGNIN", { state: { success: [data.message] } });
    }
  }, [data]);

  return (
    <FormControl sx={{ width: "500px", height: "auto", maxHeight: "90%", overflowY: "auto", display: "flex", alignItems: "center" }}>
      {/* title */}
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>

      <Grid2 container spacing={1} sx={{ width: "100%", height: "100%" }}>
        {/* Password */}
        <Grid2 size={12}>
          <PasswordInput stateProps={passwordState} staticsProps={passwordStatics} />
        </Grid2>

        {/* confirm password */}
        <Grid2 size={12}>
          <PasswordInput stateProps={confirmPasswordState} staticsProps={confirmPasswordStatics} />
        </Grid2>

        {/* Messages  */}

        {/* {success && success.length ? (
      <Grid2 size={12}>
        <AppAlert severity="success" messages={success} onClose={(index) => onCloseMessage("success", index)} />
      </Grid2>
    ) : null}
    {info && info.length ? (
      <Grid2 size={12}>
        <AppAlert severity="info" messages={info} onClose={(index) => onCloseMessage("info", index)} />
      </Grid2>
    ) : null} */}
        {errors && errors.length ? (
          <Grid2 size={12}>
            <AppAlert severity="error" messages={errors} onClose={(index) => onCloseMessage("error", index)} />
          </Grid2>
        ) : null}

        {/* Email verification button */}
        {/* <Grid2 size={12}>
      {unVerifyEmail ? (
        <AppButton
          text={`Resend email verification`}
          onClick={resendEmailVerificationRequest.fetchData}
          loading={resendEmailVerificationRequest.loading}
          disabled={Boolean(resendEmailVerificationRequest.data?.data?.remainAttempts === 0)}
        />
      ) : null} */}

        {/* SignIn Button */}
        <AppButton onClick={onSubmitResetPassword} disabled={!isFormValid} text={"Reset Password"} loading={loading} />
      </Grid2>

      {/* Google Auth */}

      {/* Navigate to signup */}
    </FormControl>
  );
};

export default ResetPasswordPage;
