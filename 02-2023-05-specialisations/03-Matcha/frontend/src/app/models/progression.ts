export class Progression {
	public value: number;
	public isProgressing: boolean;

	public constructor() {
		this.value = 0;
		this.isProgressing = false;
	}

	public update(value: Partial<Progression>): void {
		Object.assign(this, value);
	}
}
