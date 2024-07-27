/* eslint-disable @typescript-eslint/naming-convention */

type Signals =
	| 'SIGHUP'
	| 'SIGINT'
	| 'SIGQUIT'
	| 'SIGILL'
	| 'SIGTRAP'
	| 'SIGABRT'
	| 'SIGBUS'
	| 'SIGFPE'
	| 'SIGKILL'
	| 'SIGUSR1'
	| 'SIGSEGV'
	| 'SIGUSR2'
	| 'SIGPIPE'
	| 'SIGALRM'
	| 'SIGTERM'
	| 'SIGSTKFLT'
	| 'SIGCHLD'
	| 'SIGCONT'
	| 'SIGSTOP'
	| 'SIGTSTP'
	| 'SIGTTIN'
	| 'SIGTTOU'
	| 'SIGURG'
	| 'SIGXCPU'
	| 'SIGXFSZ'
	| 'SIGVTALRM'
	| 'SIGPROF'
	| 'SIGWINCH'
	| 'SIGIO'
	| 'SIGPWR'
	| 'SIGSYS'
	| 'SIGRTMIN'
	| 'exit'
	| 'uncaughtException';

type Signal = { [key in Signals]: number };

const signals: Signal = {
	SIGHUP: 1,
	SIGINT: 2,
	SIGQUIT: 3,
	SIGILL: 4,
	SIGTRAP: 5,
	SIGABRT: 6,
	SIGBUS: 7,
	SIGFPE: 8,
	SIGKILL: 9,
	SIGUSR1: 10,
	SIGSEGV: 11,
	SIGUSR2: 12,
	SIGPIPE: 13,
	SIGALRM: 14,
	SIGTERM: 15,
	SIGSTKFLT: 16,
	SIGCHLD: 17,
	SIGCONT: 18,
	SIGSTOP: 19,
	SIGTSTP: 20,
	SIGTTIN: 21,
	SIGTTOU: 22,
	SIGURG: 23,
	SIGXCPU: 24,
	SIGXFSZ: 25,
	SIGVTALRM: 26,
	SIGPROF: 27,
	SIGWINCH: 28,
	SIGIO: 29,
	SIGPWR: 30,
	SIGSYS: 31,
	SIGRTMIN: 35,
	exit: 0,
	uncaughtException: 1,
};
export { signals };
