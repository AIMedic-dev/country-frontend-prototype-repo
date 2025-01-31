import type { Metadata } from 'next';

import './globals.css';
import { roboto } from '@/resources/fonts';
import 'material-icons/iconfont/material-icons.css';

export const metadata: Metadata = {
  title: 'Pacientes',
  description: 'this is a AIMEDIC product',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const font = roboto.className;
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico?" type="image/x-icon" />
      </head>
      <body
        className={`${font} text-white-1 bg-gradient-to-br w-screen max-h-screen  h-screen overflow-hidden from-blue-1  from-40%  to-blue-2 to-100% `}
        //className={`${font} text-white-1 w-screen max-h-screen  h-screen overflow-hidden  sm:bg-red-200 md:bg-yellow-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-purple-200`}
      >
        {children}
      </body>
    </html>
  );
}
