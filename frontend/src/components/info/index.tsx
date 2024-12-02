import { Alert, AlertTitle, Container } from "@mui/material";

interface Props {
  info: string[];
  onClose?: (index: number | null) => void;
}

const Info: React.FC<Props> = ({ info, onClose = () => {} }) => {
  if (!info) return null;

  return (
    <Container disableGutters sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {info.map((i, index) => {
        return (
          <Alert key={i + index} onClose={() => onClose(index)} severity="info">
            <AlertTitle>{i}</AlertTitle>
          </Alert>
        );
      })}
    </Container>
  );
};

export default Info;
