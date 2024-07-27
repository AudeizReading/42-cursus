export function repeatString(str: string, nb: number): string {
	return str.repeat(nb);
}

export function repeatTab(nb: number): string {
	return repeatString('\t', nb);
}

export function repeatDot(nb: number): string {
	return repeatString('.', nb);
}

export function repeatDash(nb: number): string {
	return repeatString('-', nb);
}

const tabLvl = 2;
const dotLvl = 30;
const dashLvl = 50;

const dotSeparator = repeatTab(tabLvl) + repeatDot(dotLvl) + '\n';
const dashSeparator = repeatTab(tabLvl) + repeatDash(dashLvl) + '\n';
export { dotSeparator, dashSeparator };
