import { Alert, AlertTitle, Container } from "@mui/material";

interface Props {
  success: string[];
  onClose: (index: number) => void;
}

const success: React.FC<Props> = ({ success, onClose }) => {
  if (!success) return null;

  return (
    <Container disableGutters sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {success.map((i, index) => {
        return (
          <Alert key={i + index} onClose={() => onClose(index)} severity="success">
            <AlertTitle>{i}</AlertTitle>
          </Alert>
        );
      })}
    </Container>
  );
};

export default success;
