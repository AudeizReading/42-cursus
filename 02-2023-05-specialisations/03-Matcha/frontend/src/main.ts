import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
	.then((ref) => {
		if (Object.hasOwn(window, 'ngRef')) {
			// Ensure Angular destroys the previous app before bootstrapping a new one
			const ngRef = Object.getOwnPropertyDescriptor(window, 'ngRef')?.value;
			ngRef.destroy();
		}
		Object.assign(window, { ngRef: ref });
	})
	.catch((err) => console.error(err));
