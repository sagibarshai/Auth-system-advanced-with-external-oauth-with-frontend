import { Alert, AlertTitle, Container } from "@mui/material";
import { CustomErrorMessage } from "../../api/backend/auth/types";

interface Props {
  errors: string[] | CustomErrorMessage | string | undefined | null;
}

const ErrorAlert: React.FC<Props> = ({ errors }) => {
  if (!errors) return null;

  if (typeof errors === "string")
    return (
      <Alert severity="error">
        <AlertTitle>{errors}</AlertTitle>;
      </Alert>
    );
  else
    return (
      <Container disableGutters sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {errors.map((e) => {
          if (typeof e === "string")
            return (
              <Alert severity="error">
                <AlertTitle>{e}</AlertTitle>
              </Alert>
            );
          else
            return (
              <Alert severity="error">
                <AlertTitle>
                  {e.field ? (
                    <>
                      Field: {e.field} <br />
                    </>
                  ) : null}
                  {e.message}
                </AlertTitle>
              </Alert>
            );
        })}
      </Container>
    );
};

export default ErrorAlert;
