import { ClipLoader } from "react-spinners";

interface Props {
  loading: boolean;
}

const Spinner: React.FC<Props> = ({ loading }) => {
  if (!loading) return null;
  return (
    <ClipLoader
      color={"white"}
      loading={loading}
      //   size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};
export default Spinner;
