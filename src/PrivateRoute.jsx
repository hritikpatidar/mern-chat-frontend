import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLogin } from "./Utils/Auth";
import { useDispatch } from "react-redux";

export const PrivateRoute = () => {
  const adminLogin = isLogin();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathname = location?.pathname;

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "auto" });
  //   dispatch(setSearchValue(""));
  // }, [pathname]);

  return (
    <>
      {adminLogin ? (
        <>
            <Outlet />
        </>
      ) : (
        <Navigate to={"/login"} />
      )}
    </>
  );
};
