import { Typography, useTheme } from "@mui/material";

interface Props {
  errorMsg: string;
}

const InputErrorMessage: React.FC<Props> = ({ errorMsg }) => {
  const theme = useTheme();
  const helperTextHeight = `calc(${theme.typography.caption.lineHeight} * ${theme.typography.caption.fontSize})`;
  // Calculate the exact height of error message based on theme typography

  return (
    <Typography
      variant="caption"
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "block",
        minHeight: helperTextHeight, // Use the calculated height to prevent UI "jumps"
      }}
    >
      {errorMsg}
    </Typography>
  );
};

export default InputErrorMessage;
