import { Socket } from 'socket.io-client';

import { sessionId } from '../outgoingPayload/handlers';
import { createClient } from '../utils/creation';
import { createRoomState } from '../../room/roomState/utils/creation';
import { createPlayer } from '../../player/utils/creation';
import { createIncomingAction } from '../incomingPayload/creation';
import { createOutgoingAction } from '../outgoingPayload/creation';

import { IPlayerJSON, IRoomJSON } from '../../../eventsIO/payloads/types/IPayload';
import { IRoomState } from '../../../rooms/roomState/IRoomState';

import { joinServerEvent } from './scenarioOnePlayer2Rooms/joinServer';
import { createdRoomToBeOpened } from './scenarioOnePlayer2Rooms/createRoom';
import { createdRoomToBeClosedNobodyIn } from './scenarioOnePlayer2Rooms/createRoom';
import { createdRoomToBeChanged } from './scenarioOnePlayer2Rooms/createRoom';
import {
	joinRoomToBePlayerIncoming,
	joinTheSecondRoomWithLeadingTwoRooms,
} from './scenarioOnePlayer2Rooms/joinRoomToBeChanged';
import { joinRoomWithLeadingTwoRoomsUnjoined } from './scenarioOnePlayer2Rooms/joinRoomToBeChanged';
import { changeUsername } from './scenarioOnePlayer2Rooms/changeUsername';
import {
	getRoomInfo,
	getRoomsAfterLeavingFirstJoined,
	getRoomsPlayerWithTwoRoomsCreated,
	getRoomsWithTwoRoomsCreated,
} from './scenarioOnePlayer2Rooms/getRooms';
import { sendMessageToOneRoom, sendMessageToSelf } from './scenarioOnePlayer2Rooms/message';
import { setAsReadyIntoOneRoomThenCheckRoomInfo } from './scenarioOnePlayer2Rooms/ready';
import { leaveFirstRoomJoined, leaveSecondRoomJoined } from './scenarioOnePlayer2Rooms/leaveRooms';
import { disconnectOneClient } from './scenarioOnePlayer2Rooms/disconnect';
import { testOutgoingEventWithIncomingAct } from '../outgoingPayload/testers';

export {
	testOutgoingEventWithIncomingAct,
	createIncomingAction,
	createOutgoingAction,
	sessionId,
	IPlayerJSON,
	IRoomJSON,
	IRoomState,
	Socket,
	createClient,
	createRoomState,
	createPlayer,
	joinServerEvent,
	createdRoomToBeOpened,
	createdRoomToBeChanged,
	joinRoomToBePlayerIncoming,
	joinRoomWithLeadingTwoRoomsUnjoined,
	changeUsername,
	getRoomsWithTwoRoomsCreated,
	getRoomsPlayerWithTwoRoomsCreated,
	getRoomInfo,
	sendMessageToOneRoom,
	sendMessageToSelf,
	setAsReadyIntoOneRoomThenCheckRoomInfo,
	joinTheSecondRoomWithLeadingTwoRooms,
	leaveFirstRoomJoined,
	getRoomsAfterLeavingFirstJoined,
	leaveSecondRoomJoined,
	createdRoomToBeClosedNobodyIn,
	disconnectOneClient,
};
