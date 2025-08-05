import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';
interface AuthGuardProps {
  children: React.ReactNode;
}
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <LoginForm />;
  }
  return <>{children}</>;
};
export default AuthGuard;
