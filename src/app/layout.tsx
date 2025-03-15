import type { Metadata } from 'next';
import ApolloProviderWrapper from '@/app/components/apollo-provider-wrapper';
import './globals.css';
import { roboto } from '@/resources/fonts';
import 'material-icons/iconfont/material-icons.css';
import { AuthProvider } from '@/app/components/auth-context';
import NavBar from '@/app/components/nav-bar';
import { ChatProvider } from '@/app/components/chat-provider';

export const metadata: Metadata = {
  title: 'Country Aimedic',
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        //className={`${font} text-base sm:text-sm 2xl:text-base min-h-full text-white-1 bg-gradient-to-br w-screen max-h-screen  h-[100dvh] overflow-hidden  bg-yellow-200 sm:bg-blue-200 md:bg-green-200 lg:bg-red-200 xl:bg-pink-200 2xl:bg-purple-200`}
        className={`${font} text-base flex flex-col sm:text-sm 2xl:text-base  text-white-1 bg-gradient-to-br w-screen  h-[100dvh] overflow-hidden from-blue-1  from-40%  to-blue-2 to-100% `}
      >
        <ApolloProviderWrapper>
          <AuthProvider>
            <ChatProvider>
              <NavBar />
              {children}
            </ChatProvider>
          </AuthProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
