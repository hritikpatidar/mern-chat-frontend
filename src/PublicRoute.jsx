import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLogin } from './Utils/Auth'
import { useEffect } from 'react';

export const PublicRoute = () => {
  const adminLogin = isLogin()
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {(!adminLogin) ? (
        <>
          <div className="flex items-center bg-gray-100 py-2 px-4">
            <a
              href="/"
              className="flex items-center space-x-1 font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <span className="text-teal-600 text-xl sm:text-2xl md:text-3xl">RI</span>
              <span className="text-gray-800 text-lg sm:text-xl md:text-2xl">Tech</span>
            </a>
          </div>
          <Outlet />
        </>
      ) : (
        <Navigate replace to="/" />
      )}
    </>
  )
}
