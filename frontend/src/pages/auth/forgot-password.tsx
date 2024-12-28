import React, { useEffect, useState } from "react";
import { Typography, Grid2, FormControl } from "@mui/material";

import { useInput } from "../../hooks/use-input";
import { useRequest } from "../../hooks/use-request";
import { useForm } from "../../hooks/use-form";

import AppButton from "../../components/buttons";
import TextInput from "../../components/inputs/text";

import { emailRegex } from "../../utils/regex";

import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";

import { Props as InputProps } from "../../components/inputs/text";
import { ApiResponseJson, CustomErrorMessage, SendResetPasswordEmailResponse } from "../../api/backend/auth/types";
import AppAlert from "../../components/alerts";

const ForgotPasswordPage: React.FC = () => {
  const [info, setInfo] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<CustomErrorMessage | null>(null);

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

  // send reset password email request handler
  const sendResetPasswordEmail = useRequest<ApiResponseJson<SendResetPasswordEmailResponse>, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints.SEND_RESET_PASSWORD_EMAIL,
      method: "post",
      data: { email: emailState.value },
    },
  });
  const { isFormValid } = useForm({ inputs: [emailState] });

  // set the errors from send reset password email request
  useEffect(() => {
    let updatedErrors: CustomErrorMessage = [];
    if (sendResetPasswordEmail.error) updatedErrors = [...updatedErrors, ...sendResetPasswordEmail.error.customErrors];
    setErrors(updatedErrors);
  }, [sendResetPasswordEmail.error, sendResetPasswordEmail.error]);

  // update the info from the send reset password email request
  useEffect(() => {
    let updatedInfo: string[] = [];
    if (sendResetPasswordEmail.data)
      updatedInfo = [
        `${sendResetPasswordEmail.data.message}, (${
          sendResetPasswordEmail.data.data?.remainAttempts === 0 ? "No" : sendResetPasswordEmail.data.data?.remainAttempts
        } retries left)`,
      ];
    setInfo(updatedInfo);
  }, [sendResetPasswordEmail.data]);

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

  return (
    <FormControl sx={{ width: "500px", height: "auto", maxHeight: "90%", overflowY: "auto", display: "flex", alignItems: "center" }}>
      {/* title */}
      <Typography variant="h4" gutterBottom>
        Enter your email
      </Typography>

      <Grid2 container spacing={1} sx={{ width: "100%", height: "100%" }}>
        {/* Email */}
        <Grid2 size={12}>
          <TextInput stateProps={emailState} staticsProps={emailStatics} />
        </Grid2>

        {/* Messages  */}
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

        {/* Submit Button */}
        <AppButton onClick={sendResetPasswordEmail.fetchData} disabled={!isFormValid} text={"Submit"} loading={sendResetPasswordEmail.loading} />
      </Grid2>
    </FormControl>
  );
};

export default ForgotPasswordPage;
