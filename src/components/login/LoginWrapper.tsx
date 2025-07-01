import { lazy, Suspense } from 'react';

const RemoteLogin = lazy(() => import('login_microfrontend/LoginApp'));

export default function LoginWrapper() {
  return (
    <Suspense fallback={<div>Cargando login...</div>}>
      <RemoteLogin />
    </Suspense>
  );
}
