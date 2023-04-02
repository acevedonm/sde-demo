import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Login from "./login";
import firebaseApp from "../firebase/client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const auth = getAuth(firebaseApp);
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [user, setUser] = React.useState(undefined);

  React.useEffect(() => {
    onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUser(usuario);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {user === null && <Login></Login>}
        {user === undefined && <></>}
        {user && (
          <>
            <ResponsiveAppBar></ResponsiveAppBar>
            <Component {...pageProps} />
          </>
        )}
      </ThemeProvider>
    </CacheProvider>
  );
}
