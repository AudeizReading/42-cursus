import http, { Server as ServerHttp } from 'http';
import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';

import 'dotenv/config';

import { logger } from '.';
import { LeaderBoardController } from './leaderboard/';

class HttpServer {
	private app: Express;
	private server: ServerHttp;
	private whiteList: string[] = [];
	private port: number = parseInt(process.env.PORT || '8080', 10);
	private corsOpt: CorsOptions = {};
	private defaultPorts: number[] = [
		80,
		443,
		4173,
		5173,
		Number.parseInt(process.env.PORT_FRONTEND || '80'),
		this.port,
	];

	/**
	 * Initializes the constructor.
	 *
	 * set up the http server and cors options.
	 * set up the routes for the http server.
	 */
	public constructor() {
		this.defaultPorts = this.defaultPorts.filter((value, index) => this.defaultPorts.indexOf(value) == index);
		this.app = express();
		this.server = http.createServer(this.app);

		this.setupHttpConfig();
		this.setupHttpRoutes();
	}

	/**
	 * Starts the server on the specified port.
	 *
	 * @param {number} port - The port number to start the server on. If not
	 * provided, the default port will be used.
	 * @return {void} This function does not return anything.
	 */
	public start(port?: number): void {
		this.port = port || this.port;
		const callback = (): void => {
			const log = `Server is running at http://localhost:${this.port}`;
			logger.logContext(log, `HTTP Server Start`, log);
		};
		this.server.listen(this.port, callback);
	}

	/**
	 * Stops the server and closes all connections.
	 *
	 * @param {void} None
	 * @return {void} None
	 */
	public stop(): void {
		this.server.closeAllConnections();
		this.server.closeIdleConnections();
		this.server.close((err) => {
			if (err) {
				logger.logContext(err.message, 'error stop', err.message);
			}
			this.server.unref();
			if (!process.env.UNITSTESTS) {
				// otherwise jest kill process before the first job is done
				process.exit();
			}
		});
	}

	/**
	 * Sets up the HTTP configuration for the application.
	 *
	 * This function sets up the Cross-Origin Resource Sharing (CORS) policy,
	 * and configures the application to parse URL-encoded and JSON request bodies.
	 *
	 * @param {type} paramName - description of parameter
	 * @return {type} description of return value
	 */
	private setupHttpConfig(): void {
		this.setupCors();
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
	}

	/**
	 * Sets up Cross-Origin Resource Sharing (CORS) for the application.
	 *
	 * This function sets the CORS options and applies them to the application.
	 *
	 * @return {void} This function does not return anything.
	 */
	private setupCors(): void {
		this.setCorsOpts();
		this.app.use(cors(this.getCorsOpts()));
	}

	private generate42Post(cluster: number, ranger: number, nbOfPosts: number): string[] {
		const posts: string[] = [];
		for (let p = 1; p <= nbOfPosts; p++) {
			posts.push(`c${cluster}r${ranger}p${p}`);
		}
		return posts;
	}

	private generate42Cluster1(): string[] {
		const posts: string[] = [];
		for (let i = 1; i <= 4; i++) {
			posts.push(...this.generate42Post(1, i, 9));
		}
		for (let i = 5; i <= 8; i++) {
			posts.push(...this.generate42Post(1, i, 5));
		}
		return posts;
	}

	private generate42Cluster2(): string[] {
		const posts: string[] = [];
		for (let i = 1; i <= 3; i++) {
			posts.push(...this.generate42Post(2, i, 6));
		}
		for (let i = 4; i <= 7; i++) {
			posts.push(...this.generate42Post(2, i, 9));
		}
		posts.push(...this.generate42Post(2, 8, 6));
		for (let i = 9; i <= 12; i++) {
			posts.push(...this.generate42Post(2, i, 5));
		}
		return posts;
	}

	private generate42Cluster3And4(): string[] {
		const posts: string[] = [];
		for (let cluster = 3; cluster <= 4; cluster++) {
			for (let ranger = 1; ranger <= 2; ranger++) {
				posts.push(...this.generate42Post(cluster, ranger, 6));
			}
		}
		return posts;
	}

	// 42 clusters' workstations
	private get42PostName(): string[] {
		return [...this.generate42Cluster1(), ...this.generate42Cluster2(), ...this.generate42Cluster3And4()];
	}

	private generateCorsUrls(urlName: string): string[] {
		return this.defaultPorts.map((port) => {
			switch (port) {
				case 80:
					return `http://${urlName}`;
				case 443:
					return `https://${urlName}`;
				default:
					return `http://${urlName}:${port}`;
			}
		});
	}

	private getStudentWifiIp(): string[] {
		const base = '10.18';
		const ips: string[] = [];
		for (let i = 0; i <= 255; i++) {
			for (let j = 0; j <= 255; j++) {
				ips.push(`${base}.${i}.${j}`);
			}
		}
		return ips;
	}

	/**
	 * Set the CORS options for the server.
	 *
	 * This function sets up the whitelist of allowed origins
	 * and the CORS options object for the server. The whitelist
	 * contains a list of URLs that are allowed to make requests
	 * to the server. The CORS options object specifies how the
	 * server should handle CORS requests.q
	 *
	 * @return {void} This function does not return anything.
	 */
	private setCorsOpts(): void {
		const whiteList = [
			'127.0.0.1',
			'localhost',
			'freebox.bryanledda.fr',
			'aude.bryanledda.fr',
			'red-tetris-frontend.onrender.com',
			...this.getStudentWifiIp(),
			...this.get42PostName(),
		];
		whiteList.forEach((value) => this.whiteList.push(...this.generateCorsUrls(value)));
		this.corsOpt = {
			/**
			 * A function that checks the origin of a request
			 *  and determines if it is allowed by CORS.
			 *
			 * @param {any} orig - The origin value to be checked.
			 * @param {Function} cb - The callback function to be called after checking the origin.
			 * @returns {void}
			 */
			origin: (orig, cb): void => {
				if (this.whiteList.includes(orig || '') || !orig) {
					cb(null, true);
				} else {
					const log = `${orig} not allowed by CORS`;
					logger.logContext(log, `CORS ERROR`, log);
					cb(new Error(`${orig} not allowed by CORS`));
				}
			},
		};
	}

	/**
	 * Retrieves the CORS options for the current instance.
	 *
	 * @return {CorsOptions} The CORS options.
	 */
	public getCorsOpts(): CorsOptions {
		return this.corsOpt;
	}

	/**
	 * Sets up the HTTP routes for the application.
	 *
	 * @param {void} - This function does not take any parameters.
	 * @return {void} - This function does not return any value.
	 */
	private setupHttpRoutes(): void {
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
			const html = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Error</title>
	</head>
	<body>
		<h1>Oops!</h1>
		<p>It seems that something went wrong!</p>
		<p>Contact your administrator if it is not expected.</p>
	</body>
</html>`;
			logger.logContext(err.message, 'error', err.message);
			res.status(403).send(html);
			next();
		});

		this.app.get('/', (req: Request, res: Response) => {
			res.json({ message: 'Hello World!' });
		});

		this.app.get('/leaderboard', LeaderBoardController.getLeaderBoard);
	}

	/**
	 * Retrieves the HTTP server.
	 *
	 * @return {ServerHttp} The HTTP server.
	 */
	public getHttpServer(): ServerHttp {
		return this.server;
	}

	/**
	 * Retrieves the Express app instance.
	 *
	 * @return {Express} The Express app instance.
	 */
	public getExpressApp(): Express {
		return this.app;
	}
}

export default HttpServer;
