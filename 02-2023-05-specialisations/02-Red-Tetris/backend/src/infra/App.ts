import { Server as ServerHttp } from 'http';
import { Server as ServerIO } from 'socket.io';

import {
	IInterSrvEvts,
	ICltToSrvEvts,
	ISocketData,
	ISrvToCltEvts,
	DefaultController,
	signals,
	logger,
	HttpServer,
} from '.';
import { TimeoutManager } from './io';

class App {
	private httpServer: HttpServer;
	private io: ServerIO;
	private serverController: DefaultController;

	/**
	 * Constructor for the class.
	 *
	 * Initializes the HttpServer, creates a base for the server,
	 * sets up CORS options, initializes the ServerIO and
	 * ServerSocket, and initializes the PlayerController.
	 */
	public constructor() {
		this.httpServer = new HttpServer();

		const base = this.httpServer.getHttpServer();
		const corsOpt = this.httpServer.getCorsOpts();
		this.io = new ServerIO<ICltToSrvEvts, ISrvToCltEvts, IInterSrvEvts, ISocketData>(base, {
			cors: {
				origin: corsOpt.origin,
			},
		});
		this.serverController = new DefaultController(this.io);
	}

	/**
	 * Starts the server on the specified port.
	 *
	 * @param {number} port - The port number to listen on.
	 * If not provided, a random available port will be used.
	 * @return {void} This function does not return anything.
	 */
	public start(port?: number): void {
		this.gracefulShutdown();
		this.httpServer.start(port);
	}

	/**
	 * Returns the `ServerIO` instance for this object.
	 *
	 * @return {ServerIO} The `ServerIO` instance.
	 */
	public getIoServer(): ServerIO {
		return this.io;
	}

	/**
	 * Returns the HTTP server instance.
	 *
	 * @return {ServerHttp} The HTTP server instance.
	 */
	public getHttpServer(): ServerHttp {
		return this.httpServer.getHttpServer();
	}

	/**
	 * Stops the function.
	 *
	 * @return {void} - No return value.
	 */
	public stop(): void {
		TimeoutManager.clearAll();
		this.io.close();
		this.httpServer.stop();
	}

	public gracefulShutdown(): void {
		Object.entries(signals).forEach(([signal, value]) => {
			if (!signal.match(/SIGKILL|SIGSTOP|exit|uncaughtException/)) {
				process.on(signal, () => {
					process.exitCode = value;
					if (!signal.match(/exit|uncaughtException/)) process.exitCode += 128;
					logger.logContext(
						`[SHUTDOWN] Server stopped with ${signal}  - ${value} signal ${process.exitCode}`,
						'shutdown',
						`[SHUTDOWN] Server stopped with ${signal}  - ${value} signal ${process.exitCode}`,
					);
					this.stop();
				});
			}
		});
	}
}

export default App;
