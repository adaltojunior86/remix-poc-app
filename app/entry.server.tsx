// For guidance on diagnosing memory issues, refer to DEBUGGING.md in the project root.
/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from 'node:stream';

import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from './createEmotionCache';
import { ServerStyleContext } from './api/context/chakra';
import { CacheProvider } from '@emotion/react';

const ABORT_DELAY = 5_000;

// New unified rendering function
function renderAppAndStream(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  isBot: boolean
) {
  return new Promise((resolve, reject) => {
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    let didError = false;

    // App structure for the first render pass (to extract styles)
    // ServerStyleContext.Provider value is an array that can receive style objects if needed,
    // but for this pass, its main role is to enable style collection by Emotion.
    const AppForStyleExtraction = (
      <ServerStyleContext.Provider value={[]}> 
        <CacheProvider value={cache}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </CacheProvider>
      </ServerStyleContext.Provider>
    );

    // 1. Render to string to extract critical CSS
    const html = renderToString(AppForStyleExtraction);
    const chunks = extractCriticalToChunks(html);
    const criticalStylesHtml = constructStyleTagsFromChunks(chunks);

    // App structure for the second render pass (for streaming)
    // Pass the extracted `chunks.styles` to ServerStyleContext.Provider.
    // This makes the styles available via context if any component tree logic depends on it during streaming.
    // However, the primary injection of critical styles is done by writing `criticalStylesHtml` to the stream head.
    const AppToStream = (
      <ServerStyleContext.Provider value={chunks.styles}> 
        <CacheProvider value={cache}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </CacheProvider>
      </ServerStyleContext.Provider>
    );

    // 2. Render to pipeable stream for the actual response
    const { pipe, abort } = renderToPipeableStream(
      AppToStream,
      {
        [isBot ? 'onAllReady' : 'onShellReady']() {
          if (didError) return;

          const body = new PassThrough();
          responseHeaders.set('Content-Type', 'text/html');
          
          // Prepend <!DOCTYPE html> and critical styles to the stream.
          // This ensures styles are available before the browser starts rendering the streamed body.
          body.write(`<!DOCTYPE html>${criticalStylesHtml}`); 

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          didError = true;
          console.error("onShellError:", error);
          reject(error); // Critical error, reject the promise.
        },
        onError(error: unknown) {
          // This error can occur during streaming or before.
          if (!didError) { // If it's the first error
            didError = true;
            responseStatusCode = 500; // Update status code for any response formed by caller
            console.error("onError (before shell/all ready or during streaming):", error);
          } else { // Subsequent errors during streaming
            console.error("onError (during streaming, after first error):", error);
          }
          // For errors during streaming after the shell is sent, the client will handle it.
          // If before shell, onShellError or the didError flag in onShellReady/onAllReady should prevent response.
        },
      }
    );

    // Abort the stream if it takes too long, especially for bots.
    setTimeout(abort, ABORT_DELAY);
  });
}

// Default export: main request handler
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const isBotUserAgent = isbot(request.headers.get('user-agent'));
  return renderAppAndStream(request, responseStatusCode, responseHeaders, remixContext, isBotUserAgent);
}

// Old functions (chackraConfig, handleBotRequest, handleBrowserRequest) are now removed implicitly
// as this file overwrites the previous content.
[end of app/entry.server.tsx]
