    // import { lazy, Suspense } from 'react';
import LoginPage from '../country-login/login-page';
// const RemoteLogin = lazy(() => import('login_microfrontend/LoginApp'));

export default function LoginWrapper() {
  return (
    // <Suspense fallback={<div>Cargando login...</div>}>
    //   <RemoteLogin />
    // </Suspense>
    <LoginPage />
  );
}
