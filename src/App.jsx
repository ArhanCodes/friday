import { FridayProvider } from './context/FridayContext';
import AppShell from './components/layout/AppShell';
import AuthPage from './components/auth/AuthPage';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, isAuthenticated, loading, error, login, signup, logout, clearError } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={login}
        onSignup={signup}
        loading={loading}
        error={error}
        clearError={clearError}
      />
    );
  }

  return (
    <FridayProvider user={user} onLogout={logout}>
      <AppShell />
    </FridayProvider>
  );
}

export default function App() {
  return <AppContent />;
}
