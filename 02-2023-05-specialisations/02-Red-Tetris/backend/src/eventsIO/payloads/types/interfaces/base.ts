interface IPayload {}
interface ISrvToCltPayload extends IPayload {}

interface ICltToSrvPayload extends IPayload {}

type PlayerChange =
	| 'new player'
	| 'change username'
	| 'player disconnected'
	| 'ready'
	| 'left'
	| 'connecting player'
	| 'disconnected player';
type RoomChange = 'new leader' | 'player incoming' | 'player outgoing' | 'new winner';
type Change = PlayerChange | RoomChange;
type GameStartReason = 'time' | 'start';

export { IPayload, ISrvToCltPayload, ICltToSrvPayload, Change, GameStartReason };
