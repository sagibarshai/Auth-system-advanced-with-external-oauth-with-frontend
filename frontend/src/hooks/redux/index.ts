import { useSelector, useDispatch } from "react-redux";
import { appDispatch, RootState } from "../../redux/store";

export const useAppDispatch = useDispatch.withTypes<appDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
