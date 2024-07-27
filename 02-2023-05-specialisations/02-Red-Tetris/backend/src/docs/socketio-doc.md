# Events

## emit (Client -> Server)

### connect

C'est la premiere action à mener côté client afin d'obtenir une réponse du serveur **socketio**`

```js
// Code coté client
import io, { Socket } from 'socket.io-client';
const socketClient: Socket<ISrvToCltEvts, ICltToSrvEvts> = io('ws://localhost:8080/', {
    autoConnect: false,
    auth: {
        username: string // A faire saisir par user et recuperer
        sessionID?: string // null a la 1ere connexion, puis retourné par le serveur
    }
});
socketClient.connect() // -> Le serveur attend une connexion et repond en émettant un event **join**
socketClient.on('join', (data) => {...})
```

### createRoom

```js
socketClient.emit('createRoom', roomName);

/*
    -> Si room OK: (reponse attendue du serveur)
        * roomOpened                                    BROADCAST ALL
        * roomChange (reason: room created)             PLAYER
        * leaderChange                                  PLAYER
    -> Si room KO:
        * error                                         PLAYER
*/
```

### joinRoom

```js
socketClient.emit('joinRoom', roomName);

/*
    -> Si room OK:
        * roomChange (reason: player incoming)          BROADCAST ALL IN ROOM EXCEPT SELF
    -> Si room KO:
        * error                                         PLAYER
*/
```

### leaveRoom

```js
socketClient.emit('leaveRoom', roomName);

/*
    -> Si room OK: (reponse attendue du serveur)
        + Si dernier joueur de la room:
            * winner                                    WINNER 
            * roomChange (reason: room closed)          PLAYER
            * roomClosed                                BROADCAST ALL
        + Si la room contient encore des joueurs:
            * roomChange (reason: player outgoing)      BROADCAST ALL IN ROOM
            + Si le leader a changé
                * leaderChange                          NOUVEAU LEADER
    -> Si room KO:
        * error                                         PLAYER
*/
```

### getRoom

```js
socketClient.emit('getRoom', roomName);

/*
    -> reponse attendue du serveur:
        * roomInfo                                      PLAYER
*/
```

### getRooms

Toutes les rooms existantes sur le serveur:

```js
socketClient.emit('getRooms');

/*
    -> reponse attendue du serveur:
        * getRooms                                      PLAYER
*/
```

### getRoomsPlayer

Toutes les rooms dans lesquelles le joueur se trouve:

```js
socketClient.emit('getRoomsPlayer');
```

### changeUsername

```js
socketClient.emit('changeUsername', username);

/*
    -> reponse attendue du serveur:
        * playerChange                                      PLAYER
*/
```

### message

Un joueur envoie un message:

```js
socketClient.emit('message', {
	message: string // message
	receiver: string // nom de la room ou session id d'un player
});

/*
	-> reponse attendue du serveur:
		* message                                          ROOM | PLAYER
*/
```

### ready

```js
socketClient.emit('ready', roomName);

/*
    -> reponse attendue du serveur:
        * playerChange, reason: ready                      ROOM
*/
```

### gameStart

Le leader d'une room peut envoyer cet event afin de demarrer le compte à rebours pour démarrer la partie. Si le leader renvoie cet event, le compte à rebours est arrêté. (fonctionnement en _toggle_)

Le serveur repond avec un event **gameStart** (payload détaillé plus bas), lorsque le compte à rebours est lancé (meme conditions que si tous les joueurs d'une room sont readys, la game start au bout du décompte):

```js
socketClient.emit('gameStart', roomName);
```

### gameChange

Évènement émis par le client lorsqu'un joueur fait une action de jeu

```js
socketClient.emit('gameChange', { action: TypeAction, room: string }); // action -> mouvement du player, room -> nom de la room
```

Le serveur ne repond pas à cet event

## on (Server -> Client)

### join

```js
// Reponse à une demande de connexion client
    player: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueurr lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: object[] // Non defini encore
    },
```

### getRooms

```js
// Reponse à l'event getRooms
[
	{
    	name: string,
    	dateCreated: string,
    	leader: {
    	    username: string, // username
    	    sessionId: string, // uuid
    	    dateCreated: string,
    	    connected: boolean, // connecté ou non
    	    leads: string[] // nom des rooms que le joueur lead, le nom de cette room open doit apparaitre ici
    	    wins: string[] // nom des rooms gagnées
    	    games: object[] // Non defini encore
			roomState: object[]
    	}, // le player qui cree une room en devient le leader
    	gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la room, et si il est dans la room
    	winner: {
    	    username: string, // username
    	    sessionId: string, // uuid
    	    dateCreated: string,
    	    connected: boolean, // connecté ou non
    	    leads: string[] // nom des rooms que le joueurr lead
    	    wins: string[] // nom des rooms gagnées
    	    games: object[] // Non defini encore
			roomState: object[]
    	}, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room
    	players: [
    	    {
    	        username: string, // username
    	        sessionId: string, // uuid
    	        dateCreated: string,
    	        connected: boolean, // connecté ou non
    	        leads: string[] // nom des rooms que le joueurr lead
    	        wins: string[] // nom des rooms gagnées
    	        games: object[] // Non defini encore
				roomState: object[]
    	    },
    	], // Devrait etre vide a l'ouverture d'une room, socketio distingue ouverture de room et rejoindre cette meme room. En gros, on ouvre la room, puis on la rejoint, ou non
    	totalPlayer: number // Nombre de player de la room, doit etre 0 a l'ouverture
	}, // room 1
	{
    	name: string,
    	dateCreated: string,
    	leader: {
        	username: string, // username
        	sessionId: string, // uuid
        	dateCreated: string,
        	connected: boolean, // connecté ou non
        	leads: string[] // nom des rooms que le joueur lead, le nom de cette room open doit apparaitre ici
        	wins: string[] // nom des rooms gagnées
        	games: object[] // Non defini encore
			roomState: object[]
    	}, // le player qui cree une room en devient le leader
    	gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la room, et si il est dans la room
    	winner: {
        	username: string, // username
        	sessionId: string, // uuid
        	dateCreated: string,
        	connected: boolean, // connecté ou non
        	leads: string[] // nom des rooms que le joueurr lead
        	wins: string[] // nom des rooms gagnées
        	games: object[] // Non defini encore
			roomState: object[]
    	}, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room
    	players: [
        	{
            	username: string, // username
            	sessionId: string, // uuid
            	dateCreated: string,
            	connected: boolean, // connecté ou non
            	leads: string[] // nom des rooms que le joueurr lead
            	wins: string[] // nom des rooms gagnées
            	games: object[] // Non defini encore
				roomState: object[]
        	},
    	], // Devrait etre vide a l'ouverture d'une room, socketio distingue ouverture de room et rejoindre cette meme room. En gros, on ouvre la room, puis on la rejoint, ou non
    	totalPlayers: number // Nombre de player de la room, doit etre 0 a l'ouverture
		readys: [
        	{
            	username: string, // username
            	sessionId: string, // uuid
            	dateCreated: string,
            	connected: boolean, // connecté ou non
            	leads: string[] // nom des rooms que le joueurr lead
            	wins: string[] // nom des rooms gagnées
            	games: object[] // Non defini encore
				roomState: object[]
        	},
    	],
    	totalReady: number
	},
	//etc... peut aussi etre vide
];
```

### getRoomsPlayer

```js

// Reponse à l'event getRoomsPlayer: retourne les rooms dans lesquelles le player est
[
	{
    	name: string,
    	dateCreated: string,
    	leader: {
    	    username: string, // username
    	    sessionId: string, // uuid
    	    dateCreated: string,
    	    connected: boolean, // connecté ou non
    	    leads: string[] // nom des rooms que le joueur lead, le nom de cette room open doit apparaitre ici
    	    wins: string[] // nom des rooms gagnées
    	    games: object[] // Non defini encore
			roomState: object[]
    	}, // le player qui cree une room en devient le leader
    	gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la room, et si il est dans la room
    	winner: {
    	    username: string, // username
    	    sessionId: string, // uuid
    	    dateCreated: string,
    	    connected: boolean, // connecté ou non
    	    leads: string[] // nom des rooms que le joueurr lead
    	    wins: string[] // nom des rooms gagnées
    	    games: object[] // Non defini encore
			roomState: object[]
    	}, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room
    	players: [
    	    {
    	        username: string, // username
    	        sessionId: string, // uuid
    	        dateCreated: string,
    	        connected: boolean, // connecté ou non
    	        leads: string[] // nom des rooms que le joueurr lead
    	        wins: string[] // nom des rooms gagnées
    	        games: object[] // Non defini encore
				roomState: object[]
    	    },
    	], // Devrait etre vide a l'ouverture d'une room, socketio distingue ouverture de room et rejoindre cette meme room. En gros, on ouvre la room, puis on la rejoint, ou non
    	totalPlayer: number // Nombre de player de la room, doit etre 0 a l'ouverture
	}, // room 1
	{
    	name: string,
    	dateCreated: string,
    	leader: {
        	username: string, // username
        	sessionId: string, // uuid
        	dateCreated: string,
        	connected: boolean, // connecté ou non
        	leads: string[] // nom des rooms que le joueur lead, le nom de cette room open doit apparaitre ici
        	wins: string[] // nom des rooms gagnées
        	games: object[] // Non defini encore
			roomState: object[]
    	}, // le player qui cree une room en devient le leader
    	gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la room, et si il est dans la room
    	winner: {
        	username: string, // username
        	sessionId: string, // uuid
        	dateCreated: string,
        	connected: boolean, // connecté ou non
        	leads: string[] // nom des rooms que le joueurr lead
        	wins: string[] // nom des rooms gagnées
        	games: object[] // Non defini encore
			roomState: object[]
    	}, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room
    	players: [
        	{
            	username: string, // username
            	sessionId: string, // uuid
            	dateCreated: string,
            	connected: boolean, // connecté ou non
            	leads: string[] // nom des rooms que le joueurr lead
            	wins: string[] // nom des rooms gagnées
            	games: object[] // Non defini encore
				roomState: object[]
        	},
    	], // Devrait etre vide a l'ouverture d'une room, socketio distingue ouverture de room et rejoindre cette meme room. En gros, on ouvre la room, puis on la rejoint, ou non
    	totalPlayers: number // Nombre de player de la room, doit etre 0 a l'ouverture
		readys: [
        	{
            	username: string, // username
            	sessionId: string, // uuid
            	dateCreated: string,
            	connected: boolean, // connecté ou non
            	leads: string[] // nom des rooms que le joueurr lead
            	wins: string[] // nom des rooms gagnées
            	games: object[] // Non defini encore
				roomState: object[]
        	},
    	],
    	totalReady: number
	},
	//etc... peut aussi etre vide
];
```

### error

```js
'Message décrivant l\'erreur';
```

### roomOpened

```js
{
    room: {
        name: string,
        dateCreated: string,
        leader: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[], // nom des rooms que le joueur lead
            wins: string[], // nom des rooms gagnées
            games: object[], // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // le leader de la room. Si le leader quitte la room, le joueur arrivé juste apres le leader devient leader
        gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la roon
        winner: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueur lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room. Le joueur est designé lorsqu'il reste 1 joueur ou moins dans la room
        players: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 	{
						name: string;
						status: State;
						leads: boolean;
						wins?: boolean | undefined;
						readys: number;
						started: boolean;
					}
				],
            },
        ], // liste des joueurs etant dans la room
        totalPlayer: number // Nombre de player de la room
		readys: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 	{
						name: string;
						status: State;
						leads: boolean;
						wins?: boolean | undefined;
						readys: number;
						started: boolean;
					}
				],
            },
        ], // liste des joueurs etant dans la room
        totalReady: number // Nombre de player de la room
    },
    player: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueur lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
    }, // joueur concerné par le changement
}
```

### roomInfo

Réponse émise par le serveur au retour de l'event client `getRoom, roomName`
La Room retournée est celle indiquée dans le payload d'origine, ou bien une erreur est générée si la room n'existe pas.

```js
{
    name: string,
    dateCreated: string,
    leader: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueur lead, le nom de cette room open doit apparaitre ici
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
    }, // le player qui cree une room en devient le leader
    gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la room, et si il est dans la room
    winner: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueurr lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
    }, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room
    players: [
        {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueurr lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        },
    ],
    totalPlayer: number
	readys: [
        {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueurr lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        },
    ],
    totalReady: number
}
```

### roomChange

Des qu'un changement intervient dans la room

-   Changement de leader: `new leader`
-   Arrivée d'un joueur dans une room: `player incoming`
-   Départ d'un joueur d'une room: `player outgoing`
-   Designation d'un vainqueur: `new winner`

```js
{
    reason: string,
    room: {
        name: string,
        dateCreated: string,
        leader: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[], // nom des rooms que le joueur lead
            wins: string[], // nom des rooms gagnées
            games: object[], // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // le leader de la room. Si le leader quitte la room, le joueur arrivé juste apres le leader devient leader
        gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la roon
        winner: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueur lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room. Le joueur est designé lorsqu'il reste 1 joueur ou moins dans la room
        players: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 	{
						name: string;
						status: State;
						leads: boolean;
						wins?: boolean | undefined;
						readys: number;
						started: boolean;
					}
				],
            },
        ], // liste des joueurs etant dans la room
        totalPlayer: number // Nombre de player de la room
		readys: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 	{
						name: string;
						status: State;
						leads: boolean;
						wins?: boolean | undefined;
						readys: number;
						started: boolean;
					}
				],
            },
        ], // liste des joueurs etant dans la room
        totalReady: number // Nombre de player de la room
    },
    player: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueur lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
    }, // joueur concerné par le changement
}
```

### roomClosed

```js
{
    room: {
        name: string,
        dateCreated: string,
        leader: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[], // nom des rooms que le joueur lead
            wins: string[], // nom des rooms gagnées
            games: object[], // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // le leader de la room. Si le leader quitte la room, le joueur arrivé juste apres le leader devient leader
        gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la roon
        winner: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueur lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room. Le joueur est designé lorsqu'il reste 1 joueur ou moins dans la room
        players: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 	{
						name: string;
						status: State;
						leads: boolean;
						wins?: boolean | undefined;
						readys: number;
						started: boolean;
					}
				],
            },
        ], // liste des joueurs etant dans la room
        totalPlayer: number // Nombre de player de la room
		readys: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 	{
						name: string;
						status: State;
						leads: boolean;
						wins?: boolean | undefined;
						readys: number;
						started: boolean;
					}
				],
            },
        ], // liste des joueurs etant dans la room
        totalReady: number // Nombre de player de la room
    },
    player: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueur lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
    }, // joueur concerné par le changement
}
```

### playerChange

Les différents motifs possibles implémentés sont:

-   Arrivée d'un joueur sur le serveur `new player`
-   Changement de nom d'utilisateur `change username`
-   Deconnection d'un joueur `player disconnected`
-   Le jeu se set/unset du status **ready** avec `ready`

```js
// Reponse à une demande de changement sur le player (event changeUsername)
// le player updated est retourné par le serveur
{
	reason: string, // 'new player', 'change username', 'player disconnected', 'ready'
    player: {
        username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueurr lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				{
				name: string;
				status: State;
				leads: boolean;
				wins?: boolean | undefined;
				readys: number;
				started: boolean;
			}
		],
    },
}
```

### message

-   date: Date // message (serialisee en string par socketio)
-   message: string
-   emitter: le player emetteur du message
-   receiver: le player ou la room receveur du message

```js

// reponse event client `message`
{
	date: Date, // message (serialisee en string par socketio)
	message: string,
	emitter: {
		username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueurr lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
	}
	receiver: {
		username: string, // username
        sessionId: string, // uuid
        dateCreated: string,
        connected: boolean, // connecté ou non
        leads: string[] // nom des rooms que le joueurr lead
        wins: string[] // nom des rooms gagnées
        games: object[] // Non defini encore
		rooms: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
	} | {
		name: string,
        dateCreated: string,
        leader: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueur lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // le leader de la room. Si le leader quitte la room, le joueur arrivé juste apres le leader devient leader
        gameState: false, // Le jeu ne peut etre demarré/arrété par le leader de la roon
        winner: {
            username: string, // username
            sessionId: string, // uuid
            dateCreated: string,
            connected: boolean, // connecté ou non
            leads: string[] // nom des rooms que le joueur lead
            wins: string[] // nom des rooms gagnées
            games: object[] // Non defini encore
			roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
        }, // Aucun winner ne peut exister tant qu'au moins un joueur n'a pas cherché à joindre et quitter la room. Le joueur est designé lorsqu'il reste 1 joueur ou moins dans la room
        players: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
            },
        ],
        totalPlayer: number
		readys: [
            {
                username: string, // username
                sessionId: string, // uuid
                dateCreated: string,
                connected: boolean, // connecté ou non
                leads: string[] // nom des rooms que le joueur lead
                wins: string[] // nom des rooms gagnées
                games: object[] // Non defini encore
				roomsState: [
				 {
					name: string;
					status: State;
					leads: boolean;
					wins?: boolean | undefined;
					readys: number;
					started: boolean;
				}
			],
            },
        ],
        totalReady: number
	}
}
```

### gameStart

Quand tous les joueurs sont readys, un compte à rebours est démarré, au bout duquel le jeu commence.

Ce compte à rebours est transmis au travers de cet event:

-   **reason**:
    -   **time**: le compte à rebours est en cours,
    -   **start**: la partie commence
-   **message**: Contient un descriptif du compte a rebours
-   **roomName**: nom de la room

```js
{
	roomName: string, // nom de la room concernée
	reason: Reason, // time ou start
	message?: string // Contient un descriptif du compte a rebours
}
```

### gameChange

Évènement émis par le serveur lorsqu'une partie est démarrée: diffuse les éléments de jeu à chaque player individuellement tous les (env.process.TICKS_INTERVAL_MS / env.process.TICKS) intervalles de temps. Ces paramètres d'intervalles sont configurables au démarrage du serveur.

```js
socketClient.emit('gameChange', {
	gameId: string,
	payload: {
		level: number;
		score: number;
		map: TetriminosArrayType;
		nextPiece: TetriminosArrayType;
		soundEffect?: SoundEffectType;
	} as IStatePlayer // IStatePlayer
})

```

### gameInfo

Évènement émis par le serveur dès qu'une partie commence toutes les secondes.

L'event est envoyé à toute la waiting room
Le payload retourné est un tableau de PlayerGame

```js
socketClient.emit('gameInfo', {
	gameId: string,
	payload: [playerGame1, playerGame1, ...]
})
```

### gameEnd

Évènement émis par le serveur dès qu'une partie se finit pour un joueur.

L'event est envoyé à toute la waiting room
Le payload retourné est un tableau de PlayerGame

```js
socketClient.emit('gameEnd', {
	gameId: string,
	payload: playerGame,
});
```
