#!/usr/bin/env node
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

// Error TOO_MANY_RETRIES -> https://stackoverflow.com/questions/58086327/google-chrome-neterr-too-many-retries
// https://issues.chromium.org/issues/40418163
// TLDR -> Chromium n'aime pas les self-signed certificates

export const rateLimiterUsingThirdParty = rateLimit({
	windowMs: 1000, // 60 s in milliseconds
	max: 10000,
	message: 'You have exceeded the 1000 requests in 1s limit!',
	standardHeaders: true,
	legacyHeaders: false,
});

// https://www.npmjs.com/package/http-proxy-middleware
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

export const simpleRequestLogger = (proxyServer: any, options: any) => {
	proxyServer.on('proxyReq', (proxyReq: any, req: any, res: any) => {
		const { protocol, originalUrl, baseUrl, headers, method, url } = req;
		console.log(`[HPM-${protocol}] [${method}] ${baseUrl} (${originalUrl}) -> ${url}`); // outputs: [HPM] GET /users
		if (baseUrl.includes('/socket.io')) {
			console.dir(headers);
		}
	});
};

export const proxyMiddleware = createProxyMiddleware<Request, Response>({
	target: `${process.env['BACKEND_PROXY_URL']}/api/`,
	changeOrigin: true,
	plugins: [simpleRequestLogger],
});

export const proxyWSMiddleware = createProxyMiddleware<Request, Response>({
	pathFilter: '/socket.io/',
	target: `${process.env['BACKEND_PROXY_URL']?.replace('http', 'ws')}/socket.io/`,
	changeOrigin: true,
	plugins: [simpleRequestLogger],
	ws: true,
});

const sslOpts = {
	key: fs.readFileSync(`/etc/ssl/certs/${process.env['MATCHA_HOSTNAME']}+3-key.pem`),
	cert: fs.readFileSync(`/etc/ssl/certs/${process.env['MATCHA_HOSTNAME']}+3.pem`),
};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): https.Server {
	const server = express();
	const serverDistFolder = dirname(fileURLToPath(import.meta.url));
	const browserDistFolder = resolve(serverDistFolder, '../browser');
	const indexHtml = join(serverDistFolder, 'index.server.html');

	const commonEngine = new CommonEngine();

	server.disable('x-powered-by');

	server.set('trust proxy', 1);
	server.set('view engine', 'html');
	server.set('views', browserDistFolder);

	server.use(rateLimiterUsingThirdParty);
	server.use(
		cors({
			origin: (orig, cb): void => {
				const whiteList = [`${process.env['FRONTEND_URL']}`];
				if (!orig || whiteList.includes(orig)) {
					cb(null, true);
				} else {
					cb(new Error(`${orig} not allowed by CORS`));
				}
			},
		}),
	);

	server.use('/socket.io/', proxyWSMiddleware as unknown as RequestHandler);
	server.use('/api/', proxyMiddleware as unknown as RequestHandler);

	// Example Express Rest API endpoints
	// server.get('/api/**', (req, res) => { });
	// Serve static files from /browser
	server.get(
		'*.*',
		express.static(browserDistFolder, {
			maxAge: '1y',
		}),
	);

	// All regular routes use the Angular engine
	server.get('*', (req, res, next) => {
		const { protocol, originalUrl, baseUrl, headers } = req;

		commonEngine
			.render({
				bootstrap,
				documentFilePath: indexHtml,
				url: `${protocol}://${headers.host}${originalUrl}`,
				publicPath: browserDistFolder,
				providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
			})
			.then((html) => res.send(html))
			.catch((err) => next(err));
	});

	return https.createServer(sslOpts, server);
}

function run(): void {
	const port = process.env['PUBLIC_PORT_FRONT'] || 4200;
	const host = process.env['FRONTEND_URL'] || 'localhost';

	// Start up the Node server
	const server = app();
	server.listen(port, () => {
		console.log(`Node Express server listening on ${host}`);
	});
	server.on('upgrade', proxyWSMiddleware.upgrade);
}

run();
