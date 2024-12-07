import { useAppSelector } from "../../hooks/redux";

const HomePage: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  return <div style={{ margin: "100px" }}>{JSON.stringify(user)}</div>;
};

export default HomePage;
