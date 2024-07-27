import { destroyTimer } from '../utils/env';
import { App } from '../../infra';

let app: App;
function startApp(): void {
	beforeAll((): void => {
		app = new App();
		app.start();
	});
}
function stopApp(delay: number): void {
	afterAll((done) => {
		app.stop();
		setTimeout(() => {
			console.log(`SERVER DISCONNECTED`);
			done();
		}, delay);
	}, delay + 1000);
}

function handleAppLifeCycle(): void {
	startApp(), stopApp(destroyTimer);
}

export { startApp, stopApp, handleAppLifeCycle };
