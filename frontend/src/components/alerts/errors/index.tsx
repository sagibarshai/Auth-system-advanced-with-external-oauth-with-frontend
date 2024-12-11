import { Alert, AlertTitle, Container } from "@mui/material";
import { CustomErrorMessage } from "../../../api/backend/auth/types";

interface Props {
  errors: string[] | CustomErrorMessage | null;
  onClose: (index: number) => void;
}

const ErrorAlert: React.FC<Props> = ({ errors, onClose = () => {} }) => {
  if (!errors) return null;

  return (
    <Container disableGutters sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {errors.map((e, i) => {
        if (typeof e === "string")
          return (
            <Alert onClose={() => onClose(i)} severity="error">
              <AlertTitle>{e}</AlertTitle>
            </Alert>
          );
        else
          return (
            <Alert onClose={() => onClose(i)} severity="error">
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
