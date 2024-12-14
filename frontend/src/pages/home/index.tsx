import { Typography } from "@mui/material";
import { useAppSelector } from "../../hooks/redux";

const HomePage: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  return <Typography style={{ margin: "100px" }}>{JSON.stringify(user)}</Typography>;
};

export default HomePage;
