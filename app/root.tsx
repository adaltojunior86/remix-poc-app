import React, { ReactNode, Suspense, useContext, useEffect } from 'react';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { withEmotionCache } from '@emotion/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from './components';
import { ClientStyleContext, ServerStyleContext } from './api/context/chakra';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

interface DocumentProps {
  children: ReactNode;
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);
  const emotionCacheReference = emotionCache;

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCacheReference.sheet.container = document.head;
    // re-inject tags
    const { tags } = emotionCacheReference.sheet;
    emotionCacheReference.sheet.flush();
    tags?.forEach((tag) => {
      // eslint-disable-next-line no-underscore-dangle
      (emotionCacheReference.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData?.reset();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
});

function App() {
  return (
    <Document>
      <ChakraProvider>
        <Layout>
          <Outlet />
        </Layout>
      </ChakraProvider>
    </Document>
  );
}

export default App;
