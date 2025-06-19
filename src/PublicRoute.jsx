import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLogin } from './Utils/Auth'

export const PublicRoute = () => {
  const adminLogin = isLogin()
  const location = useLocation();

  return (
    <>
      {(!adminLogin) ? ( 
        <>
          <Outlet />
        </>
      ) : (
        <Navigate replace to="/" />
      )}
    </>
  )
}
