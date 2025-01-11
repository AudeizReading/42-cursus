import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { UserService } from '$user/user.service';
import { IDatabaseToken, Reason } from './token.interface';
import { ADatabase } from '$app/database/ADatabase';

describe('TokenService', () => {
	let service: TokenService;
	let userService: UserService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [TokenService],
		}).compile();

		userService = new UserService();
		service = module.get<TokenService>(TokenService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(service).toBeDefined();
	});

	describe('generateUUID', () => {
		it('Generate new UUID', () => {
			expect(typeof TokenService.generateUUID() == 'string').toBe(true);
		});
	});

	describe('new', () => {
		let user: UserService;
		it('Create instance User', async () => {
			user = userService.new({
				firstName: 'firstname',
				lastName: 'lastname',
				email: 'newToken@example.fr',
				username: 'newToken',
				hashPassword: UserService.passwordToHash('Password42@'),
			});
			await user.update();
		});
		it('Reason undefined', async () => {
			await expect(service.new(undefined, user)).rejects.toThrow();
		});
		it('User undefined', async () => {
			await expect(
				service.new('validEmail', undefined),
			).rejects.toThrow();
		});
		it('User invalid', async () => {
			await expect(
				service.new('recoveryPassword', new UserService()),
			).rejects.toThrow();
		});
		it('Reason validEmail', async () => {
			expect(
				(await service.new('validEmail', user)) instanceof TokenService,
			).toBe(true);
		});
		it('Reason recoveryPassword', async () => {
			expect(
				(await service.new('recoveryPassword', user)) instanceof
					TokenService,
			).toBe(true);
		});
	});

	describe('getByPK', () => {
		let user: UserService;
		let token: TokenService;
		it('Create instance User', async () => {
			user = userService.new({
				firstName: 'firstname',
				lastName: 'lastname',
				email: 'getByPKForToken@example.fr',
				username: 'getByPKForToken',
				hashPassword: UserService.passwordToHash('Password42@'),
			});
			await user.update();
		});
		it('Create instance Token', async () => {
			token = await service.new('recoveryPassword', user);
		});
		it('Invalid PK undefined', async () => {
			await expect(service.getByPK(undefined)).rejects.toThrow();
		});
		it('Invalid PK type string', async () => {
			await expect(
				service.getByPK('NotPK' as unknown as number),
			).rejects.toThrow();
		});
		it('Invalid PK not id', async () => {
			await expect(service.getByPK(0)).rejects.toThrow();
		});
		it('Valid PK', async () => {
			expect(
				(await service.getByPK(token.getId())) instanceof TokenService,
			).toBe(true);
		});
	});

	describe('getByToken', () => {
		let user: UserService;
		let token: TokenService;
		it('Create instance User', async () => {
			user = userService.new({
				firstName: 'firstname',
				lastName: 'lastname',
				email: 'getByTokenForToken@example.fr',
				username: 'getByTokenForToken',
				hashPassword: UserService.passwordToHash('Password42@'),
			});
			await user.update();
		});
		it('Create instance Token', async () => {
			token = await service.new('recoveryPassword', user);
		});
		it('Undefined Token', async () => {
			await expect(service.getByToken(undefined)).rejects.toThrow();
		});
		it('Invalid Token', async () => {
			await expect(
				service.getByToken('Not Good Token'),
			).rejects.toThrow();
		});
		it('Valid Token', async () => {
			expect(
				(await service.getByToken(token.getToken())) instanceof
					TokenService,
			).toBe(true);
		});
	});

	describe('newInstance', () => {
		it('instranceOf', () => {
			expect(service.newInstance() instanceof TokenService).toBe(true);
		});
	});

	describe('Getter Setter ID', () => {
		let token: TokenService;
		it('Define new Instance', () => {
			token = service.newInstance();
		});
		it('ID == undefined', () => {
			expect(token.getId() == undefined).toBe(true);
		});
		it('setID 1', () => {
			token.setId(1);
		});
		it('undefined', () => {
			expect(() => {
				token.setId(undefined);
			}).toThrow();
		});
		it('Invalid ID 0', () => {
			expect(() => {
				token.setId(0);
			}).toThrow();
		});
		it('Invalid ID -1', () => {
			expect(() => {
				token.setId(-1);
			}).toThrow();
		});
		it('id == 1', () => {
			expect(token.getId() == 1).toBe(true);
		});
	});

	describe('Getter Setter is Reason', () => {
		it('Invalid Reason', () => {
			expect(() => {
				service.setReason('InvalidReason' as Reason);
			}).toThrow();
		});
		it('Undefined Reason', () => {
			expect(() => {
				service.setReason(undefined);
			}).toThrow();
		});
		it('Valid Reason', () => {
			expect(() => {
				service.setReason('validEmail');
			}).not.toThrow();
		});
		it('is Reason false', () => {
			service.setReason('validEmail');
			expect(service.isReason('recoveryPassword')).toBe(false);
		});
		it('is Reason true', () => {
			service.setReason('validEmail');
			expect(service.isReason('validEmail')).toBe(true);
		});
	});

	describe('Getter Setter Token', () => {
		let token: TokenService;
		it('Set instance Token', () => {
			token = service.newInstance();
		});
		it('Get token undefined', () => {
			expect(token.getToken() == undefined).toBe(true);
		});
		it('Set Token undefined', () => {
			expect(() => {
				token.setToken(undefined);
			}).toThrow();
		});
		it('Set Token String', () => {
			expect(() => {
				token.setToken('String');
			}).not.toThrow();
		});
		it('Get Token == String', () => {
			expect(token.getToken() == 'String').toBe(true);
		});
	});

	describe('Getter Setter Expired', () => {
		it('Undefined', () => {
			expect(() => {
				service.setExpired(undefined);
			}).toThrow();
		});
		it('true', () => {
			expect(() => {
				service.setExpired(true);
			}).not.toThrow();
		});
		it('false', () => {
			expect(() => {
				service.setExpired(false);
			}).not.toThrow();
		});
		it('string', () => {
			expect(() => {
				service.setExpired('string' as unknown as boolean);
			}).toThrow();
		});
		it('number', () => {
			expect(() => {
				service.setExpired(42 as unknown as boolean);
			}).toThrow();
		});
		it('Check return', () => {
			expect(service.isExpired() == false).toBe(true);
			expect(() => {
				service.setExpired(true);
			}).not.toThrow();
			expect(service.isExpired() == true).toBe(true);
			expect(() => {
				service.setExpired(false);
			}).not.toThrow();
			expect(service.isExpired() == false).toBe(true);
		});
	});

	describe('Getter Setter UserID', () => {
		let token: TokenService;
		it('define instance token', () => {
			token = service.newInstance();
		});
		it('Get value undefined', () => {
			expect(token.getUserId() == undefined).toBe(true);
		});
		it('Set undefined', () => {
			expect(() => {
				token.setUserId(undefined);
			}).toThrow();
		});
		it('Set invalid', () => {
			expect(() => {
				token.setUserId(0);
			}).toThrow();
		});
		it('Set Value', () => {
			expect(() => {
				token.setUserId(1);
			}).not.toThrow();
		});
		it('Get Value Valid', () => {
			expect(token.getUserId() == 1).toBe(true);
		});
	});

	describe('Getter Setter user', () => {
		let user: UserService;
		let token: TokenService;
		it('Create instance User', async () => {
			user = userService.new({
				firstName: 'firstname',
				lastName: 'lastname',
				email: 'getSetUserForToken@example.fr',
				username: 'getSetUserForToken',
				hashPassword: UserService.passwordToHash('Password42@'),
			});
			await user.update();
		});
		it('Define Token', async () => {
			token = await service.new('validEmail', user);
		});
		it('Get User undefined', async () => {
			await expect(service.newInstance().getUser()).rejects.toThrow();
		});
		it('Set undefined User', () => {
			expect(() => {
				token.setUser(undefined);
			}).toThrow();
		});
		it('Set invalid User', () => {
			expect(() => {
				token.setUser(userService.newInstance());
			}).toThrow();
		});
		it('Set Valid User', () => {
			expect(() => {
				token.setUser(user);
			}).not.toThrow();
		});
		it('Get User Defined', async () => {
			const result = await token.getUser();
			expect(result instanceof UserService).toBe(true);
			expect(result.getId() == user.getId()).toBe(true);
		});
	});

	describe('deserialize', () => {
		const db: IDatabaseToken = {
			id: 1,
			reason: 'validEmail',
			token: 'mySuperToken',
			expired: 0,
			userId: 1,
		};
		it('undefined', () => {
			expect(() => {
				service.deserialize(undefined);
			}).toThrow();
		});
		it('id undefined', () => {
			expect(() => {
				service.deserialize({ ...db, id: undefined });
			}).toThrow();
		});
		it('reason undefined', () => {
			expect(() => {
				service.deserialize({ ...db, reason: undefined });
			}).toThrow();
		});
		it('token undefined', () => {
			expect(() => {
				service.deserialize({ ...db, token: undefined });
			}).toThrow();
		});
		it('expired undefined', () => {
			expect(() => {
				service.deserialize({ ...db, expired: undefined });
			}).toThrow();
		});
		it('expired number not 1 or 0', () => {
			expect(() => {
				service.deserialize({ ...db, expired: 2 });
			}).toThrow();
		});
		it('expired string', () => {
			expect(() => {
				service.deserialize({
					...db,
					expired: 'string' as unknown as number,
				});
			}).toThrow();
		});
		it('userId undefined', () => {
			expect(() => {
				service.deserialize({ ...db, userId: undefined });
			}).toThrow();
		});
		it('valid', () => {
			expect(() => {
				service.deserialize(db);
			}).not.toThrow();
		});
	});
});
