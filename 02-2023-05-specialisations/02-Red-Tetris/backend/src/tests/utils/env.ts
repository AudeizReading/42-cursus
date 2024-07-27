const destroyTimer = parseInt(process.env.DESTROY_TIMER ?? '1', 10) * 1000;
const disconnectTimer = parseInt(process.env.DISCO_TIMER ?? '1', 10) * 1000;

export { destroyTimer, disconnectTimer };
