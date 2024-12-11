import { Typography, useTheme } from "@mui/material";

// Calculate the exact height of error message based on theme typography

interface Props {
  errorMsg: string;
}

const InputErrorMessage: React.FC<Props> = ({ errorMsg }) => {
  const theme = useTheme();
  const helperTextHeight = `calc(${theme.typography.caption.lineHeight} * ${theme.typography.caption.fontSize})`;

  return (
    <Typography
      variant="caption"
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "block",
        minHeight: helperTextHeight, // Use the calculated height
      }}
    >
      {errorMsg}
    </Typography>
  );
};

export default InputErrorMessage;
