const controller = (
	event:
		| (KeyboardEvent & { currentTarget: EventTarget & Window })
		| { key: string; preventDefault?: () => void },
	callback: {
		up: () => void;
		down: () => void;
		right: () => void;
		left: () => void;
		space: () => void;
	},
): void => {
	switch (event.key) {
		case 'ArrowUp':
			callback.up();
			if (event?.preventDefault) event.preventDefault();
			break;
		case 'ArrowDown':
			callback.down();
			if (event?.preventDefault) event.preventDefault();
			break;
		case 'ArrowLeft':
			callback.left();
			if (event?.preventDefault) event.preventDefault();
			break;
		case 'ArrowRight':
			callback.right();
			if (event?.preventDefault) event.preventDefault();
			break;
		case ' ':
			callback.space();
			if (event?.preventDefault) event.preventDefault();
			break;
	}
};

export default controller;
