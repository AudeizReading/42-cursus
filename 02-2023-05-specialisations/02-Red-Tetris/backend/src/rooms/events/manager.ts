import Room from '../Room';
import { EventsManager } from '../../base/Observer';
import { RoomEmptyEventListener } from './emptyRoom';

export class RoomEventsManager extends EventsManager<RoomEmptyEventListener, Room> {}
