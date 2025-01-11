import { Database } from 'sqlite3';
import * as fs from 'fs';
import { NotificationEventService } from '$app/notification/notification-event.service';
import { Logger } from '@nestjs/common';
import { FameRatingService } from '$app/user/fame-rating.service';

class Migration {
	static db: Database;
	static init = false;

	constructor() {
		ADatabase.initialize();
	}

	static async initialize(): Promise<void> {
		if (this.init) return;
		this.init = true;
		const loggerService = Logger;
		this.db = new Database(
			process.env.NODE_ENV == 'test'
				? 'data/matcha.test.sqlite'
				: 'data/matcha.sqlite',
		);
		loggerService.log('Database is initialized', 'ADatabase');
		await this.migrations();
	}

	private static async getVersion(): Promise<number> {
		const loggerService = Logger;
		const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS version (version INTEGER);`;
		const INSERT_NOT_EXIST = `INSERT INTO version (version)
			SELECT 0
			WHERE NOT EXISTS (SELECT 1 FROM version);`;
		const GET_VERSION = `SELECT version FROM version;`;

		await new Promise<void>((resolve) => {
			this.db.exec(CREATE_TABLE, (err) => {
				if (err) {
					loggerService.error(err, 'ADatabase');
					process.exit(1);
				}
				resolve();
			});
		});
		await new Promise<void>((resolve) => {
			this.db.exec(INSERT_NOT_EXIST, (err) => {
				if (err) {
					loggerService.error(err, 'ADatabase');
					process.exit(1);
				}
				resolve();
			});
		});
		return new Promise<number>((resolve) => {
			this.db.all(GET_VERSION, (err, rows: [{ version: number }]) => {
				if (err) loggerService.error(err, 'ADatabase');
				if (err || rows.length !== 1) process.exit(1);
				const version = rows[0].version;
				loggerService.log(
					`Current version database ${version}`,
					'ADatabase',
				);
				resolve(version);
			});
		});
	}

	private static async setVersion(version: number): Promise<void> {
		const loggerService = Logger;
		const UPDATE_VERSION = `UPDATE version SET version = ${version} WHERE version is not NULL;`;
		await new Promise<void>((resolve) => {
			this.db.exec(UPDATE_VERSION, (err) => {
				if (err) {
					loggerService.error(err, 'ADatabase');
					process.exit(1);
				}
				resolve();
			});
		});
		loggerService.log(`New version database ${version}`, 'ADatabase');
	}

	private static async migrations(): Promise<void> {
		const loggerService = Logger;
		const beginVersion = await this.getVersion();
		let version = beginVersion;
		switch (version) {
			case 0:
				await this.migrate('0-init');
				loggerService.log(
					`Success migration v${version++} to v${version}`,
					'ADatabase',
				);
			case 1:
				await this.migrate('1-dislike');
				loggerService.log(
					`Success migration v${version++} to v${version}`,
					'ADatabase',
				);
			case 2:
				await this.migrate('2-fameRating');
				loggerService.log(
					`Success migration v${version++} to v${version}`,
					'ADatabase',
				);
		}
		if (beginVersion != version) await this.setVersion(version);
	}

	private static async migrate(file: string): Promise<void> {
		const loggerService = Logger;
		const migrationsFolder = `${process.cwd()}/src/migrations`;
		return await new Promise<void>((resolve) => {
			this.db.exec(
				fs.readFileSync(`${migrationsFolder}/${file}.sql`).toString(),
				(err) => {
					if (err) {
						loggerService.error(
							`${file} migrate fail`,
							'ADatabase',
						);
						process.exit(1);
					} else {
						loggerService.log(
							`${file} migrate executed`,
							'ADatabase',
						);
						resolve();
					}
				},
			);
		});
	}
}

export abstract class ADatabase<
	DB_INTERFACE,
	SERVICE,
	SERVICE_INTERFACE,
> extends Migration {
	private tableName: string;
	private forbiddenTag = ['forbiddenTag', 'tableName', 'id', 'instance'];

	protected id: number | undefined = undefined;

	abstract deserialize(db: DB_INTERFACE): void;
	abstract normalize(): SERVICE_INTERFACE;

	constructor(
		private readonly instance: new () => SERVICE,
		tableName: string,
		forbiddenTag: string[] = [],
	) {
		super();
		this.tableName = tableName;
		forbiddenTag.map((forbidden) => this.forbiddenTag.push(forbidden));
	}

	public newInstance(): SERVICE {
		return new this.instance();
	}

	public setId(id: number): void {
		if (!(id && id > 0)) throw new Error('ID is invalid');
		this.id = id;
	}

	public getId(): number | undefined {
		return this.id;
	}

	public getTableName(): string {
		return this.tableName;
	}

	private serialize(value: unknown): string {
		if (value == undefined) {
			Logger.warn(
				`Value empty in serialize ${this.instance}`,
				'ADatabase',
			);
			return '';
		}
		if (value instanceof Date) {
			return value.getTime().toString();
		}
		switch (typeof value) {
			case 'string':
				return `'${value.replaceAll("'", "''")}'`;
			case 'boolean':
				return value ? '1' : '0';
			default:
				return value.toString();
		}
	}

	private getKeys(): string[] {
		return Object.keys(this).filter(
			(e) => !this.forbiddenTag.includes(e) && this[e] != undefined,
		);
	}

	private getValues(): string[] {
		return this.getKeys().map((e) => this.serialize(this[e]));
	}

	private insertString(): string {
		return `INSERT INTO ${this.getTableName()}`;
	}

	private keysString(): string {
		return `(${this.getKeys().toString()})`;
	}

	private valuesString(): string {
		return `VALUES (${this.getValues().toString()})`;
	}

	private updateString(): string {
		return `UPDATE ${this.getTableName()}`;
	}

	private setString(): string {
		const values = this.getValues();
		return `SET ${this.getKeys().map((key, i) => `${key}=${values[i]}`)}`;
	}

	private whereString(column = 'id', value: unknown = this.getId()): string {
		return `WHERE ${column} = ${this.serialize(value)}`;
	}

	private deleteString(): string {
		return `DELETE FROM ${this.getTableName()}`;
	}

	private selectString(): string {
		return `SELECT * FROM ${this.getTableName()}`;
	}

	private getSqlForInsert(): string {
		return `${this.insertString()} ${this.keysString()} ${this.valuesString()};`;
	}

	private getSqlForUpdate(): string {
		return `${this.updateString()} ${this.setString()} ${this.whereString()};`;
	}

	private getSqlForDelete(): string {
		return `${this.deleteString()} ${this.whereString()}`;
	}

	private getSqlForSelect(
		value: unknown = this.getId(),
		column = 'id',
	): string {
		return `${this.selectString()} ${this.whereString(column, value)};`;
	}

	private async create(): Promise<void> {
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.run(this.getSqlForInsert(), function (err) {
				return err ? rejects(err) : resolve(this.lastID);
			});
		});
		await result
			.then((lastID: number) => this.setId(lastID))
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	private async updateData(): Promise<void> {
		await new Promise((resolve, rejects) => {
			ADatabase.db.run(this.getSqlForUpdate(), function (err) {
				return err ? rejects(err) : resolve(this);
			});
		}).catch((err) => {
			throw new Error(err.message);
		});
	}

	protected async get(
		value: unknown = this.getId(),
		column = 'id',
	): Promise<SERVICE[]> {
		const sql = this.getSqlForSelect(value, column);
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((data: DB_INTERFACE[]) =>
				data.map((db: DB_INTERFACE) => {
					const instance = this.newInstance() as ADatabase<
						DB_INTERFACE,
						SERVICE,
						SERVICE_INTERFACE
					>;
					instance.deserialize(db);
					return instance as SERVICE;
				}),
			)
			.catch((err: Error) => {
				throw new Error(err.message);
			});
	}

	public async getByPK(id: number): Promise<SERVICE> {
		const instances = await this.get(id);
		if (instances.length != 1) {
			throw new Error(`${instances.length} instances`);
		}
		return instances[0] as SERVICE;
	}

	public async update(): Promise<void> {
		if (this.getId() == undefined) {
			await this.create();
		} else {
			await this.updateData();
		}
		await new NotificationEventService().eventUpdate(this);
		await new FameRatingService().eventUpdate(this);
	}

	public async delete(): Promise<unknown> {
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.run(this.getSqlForDelete(), function (err) {
				return err ? rejects(err) : resolve(this);
			});
		});
		return await result
			.then((v) => v)
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	protected async searchInSql(
		limit: number,
		page: number,
		search: string,
		columnSearch: string,
	): Promise<{ results: SERVICE[]; totalPage: number }> {
		const sql = `SELECT * FROM ${
			this.tableName
		} WHERE ${columnSearch} LIKE '%${search}%' LIMIT ${limit} OFFSET ${
			limit * page
		};`;
		const sqlCount = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE \
			${columnSearch} LIKE '%${search}%';`;
		const countResult = new Promise((resolve, reject) => {
			ADatabase.db.get(sqlCount, (err, row) => {
				if (err) return reject(err);
				else return resolve(row);
			});
		});
		const r = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const totalPage = await countResult
			.then((v: { total: number }) => {
				return Math.floor(v.total / limit);
			})
			.catch((err: Error) => {
				throw new Error(err.message);
			});
		const results = await r
			.then((data: DB_INTERFACE[]) =>
				data.map((db: DB_INTERFACE) => {
					const instance = this.newInstance() as ADatabase<
						DB_INTERFACE,
						SERVICE,
						SERVICE_INTERFACE
					>;
					instance.deserialize(db);
					return instance as SERVICE;
				}),
			)
			.catch((err: Error) => {
				throw new Error(err.message);
			});
		return { results, totalPage };
	}
}
