import { useState } from 'react';
import Login from './views/login';
import Register from './views/register';
import VerifyCode from './views/verifycode';

type View = 'login' | 'register' | 'verify';

export default function LoginPage() {
  const [view, setView] = useState<View>('login');
  const [tempUser, setTempUser] = useState<{ email: string; name: string; password: string } | null>(null);

  return (
    <>
      {view === 'login' && <Login navigate={setView} />}
      {view === 'register' && (
        <Register
          navigate={setView}
          setTempUser={setTempUser}
        />
      )}
      {view === 'verify' && tempUser && (
        <VerifyCode
          tempUser={tempUser}
          navigate={setView}
        />
      )}
    </>
  );
}
