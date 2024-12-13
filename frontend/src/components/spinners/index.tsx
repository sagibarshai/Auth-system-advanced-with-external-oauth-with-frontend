import { ClipLoader } from "react-spinners";

interface Props {
  loading: boolean;
}

const Spinner: React.FC<Props> = ({ loading }) => {
  if (!loading) return null;
  return <ClipLoader color={"white"} loading={loading} aria-label="Loading Spinner" data-testid="loader" size={25} />;
};
export default Spinner;
