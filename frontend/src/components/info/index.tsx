import { Alert, AlertTitle, Container } from "@mui/material";

interface Props {
  info: string[] | string;
}

const Info: React.FC<Props> = ({ info }) => {
  if (!info) return null;

  if (typeof info === "string")
    return (
      <Alert severity="info">
        <AlertTitle>{info}</AlertTitle>
      </Alert>
    );
  else
    return (
      <Container disableGutters sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {info.map((i) => {
          return (
            <Alert severity="info">
              <AlertTitle>{i}</AlertTitle>
            </Alert>
          );
        })}
      </Container>
    );
};

export default Info;
