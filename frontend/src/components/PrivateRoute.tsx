import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../store/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// 路由守卫：未登录时重定向到登录页
export default function PrivateRoute({ children }: PrivateRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
