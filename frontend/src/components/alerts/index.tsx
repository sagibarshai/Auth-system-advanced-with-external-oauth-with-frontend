import { Alert, AlertProps, AlertTitle, Container } from "@mui/material";
import { CustomErrorMessage } from "../../api/backend/auth/types";

interface Props {
  messages: string[] | CustomErrorMessage | null;
  onClose: (index: number) => void;
  severity: AlertProps["severity"];
}

const AppAlert: React.FC<Props> = ({ messages, severity, onClose }) => {
  if (!messages) return null;

  return (
    <Container disableGutters sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {messages.map((e, i) => {
        if (typeof e === "string")
          return (
            <Alert onClose={() => onClose(i)} severity={severity}>
              <AlertTitle>{e}</AlertTitle>
            </Alert>
          );
        else
          return (
            <Alert onClose={() => onClose(i)} severity={severity}>
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

export default AppAlert;
