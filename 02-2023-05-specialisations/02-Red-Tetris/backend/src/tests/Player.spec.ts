import Player from '../players/Player';

let player: Player;

describe('Player instantiation', () => {
	test('Correct instantiation', (done) => {
		player = new Player('Blibli', '6P4I-snhy8uGZxkgAAAH');
		expect(player.sessionID).toBe('6P4I-snhy8uGZxkgAAAH');
		expect(player.username).toBe('Blibli');
		expect(player.leads).toHaveLength(0);
		expect(player.wins).toHaveLength(0);
		expect(player.dateCreated).toBeDefined();
		expect(player.connected).toBeTruthy();
		done();
	});
});
