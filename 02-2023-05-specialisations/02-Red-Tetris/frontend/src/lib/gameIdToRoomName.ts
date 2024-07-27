export const gameIdToRoomName = (gameId: string): string => {
	return gameId.split('_')[1];
};
