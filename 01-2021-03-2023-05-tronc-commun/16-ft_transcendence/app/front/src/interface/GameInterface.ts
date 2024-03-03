// For frontend. Represents a game that has already ended.
export default interface GameInterface {
	id: number;
	winnerId: number;
	winnedAt: Date;
	scores: number[];
	players: {
		id: number;
		name: string;
		avatar: string;
	}[];
}
