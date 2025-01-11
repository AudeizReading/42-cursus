import { ADatabase } from '$app/database/ADatabase';
import { UserPublic } from '$app/user/user.interface';
import { UserService } from '$app/user/user.service';
import { Injectable } from '@nestjs/common';
import {
	orderByBrowsingType,
	SearchBrowsingDto,
	sortType,
} from './browsing.schema';

@Injectable()
export class BrowsingService {
	async getUsers(
		user: UserService,
		currentUser: number,
		howManyUser: number,
		orderBy: orderByBrowsingType,
		sortBy: sortType,
		ageMin?: number,
		ageMax?: number,
		commonTagMin?: number,
		commonTagMax?: number,
		fameRatingMin?: number,
		fameRatingMax?: number,
		locationMin?: number,
		locationMax?: number,
	): Promise<UserPublic[]> {
		return await this.browsingSql(
			user,
			currentUser,
			howManyUser,
			orderBy,
			sortBy,
			ageMin,
			ageMax,
			commonTagMin,
			commonTagMax,
			fameRatingMin,
			fameRatingMax,
			locationMin,
			locationMax,
		);
	}

	async search(
		user: UserService,
		currentUser: number,
		howManyUser: number,
		orderBy: orderByBrowsingType,
		sortBy: sortType,
		search: SearchBrowsingDto,
	): Promise<UserPublic[]> {
		return await this.browsingSql(
			user,
			currentUser,
			howManyUser,
			orderBy,
			sortBy,
			search?.ageRange?.min,
			search?.ageRange?.max,
			undefined,
			undefined,
			search?.fameRatingRange?.min,
			search?.fameRatingRange?.max,
			search?.distanceRange?.min,
			search?.distanceRange?.max,
			search?.tagIds,
		);
	}

	private async browsingSql(
		user: UserService,
		offset: number,
		limit: number,
		orderBy: orderByBrowsingType,
		sortBy: sortType,
		ageMin?: number,
		ageMax?: number,
		commonTagMin?: number,
		commonTagMax?: number,
		fameRatingMin?: number,
		fameRatingMax?: number,
		locationMin?: number,
		locationMax?: number,
		tagIds?: number[],
	): Promise<UserPublic[]> {
		const userId = user.getId();
		const gender = await user.getGender();
		const preference = await user.getSexualPreference();
		let genderSearch: string;
		let preferenceSearch: string;
		switch (preference.preference) {
			case 'Bisexual':
				genderSearch = "gender = 'Man' OR gender = 'Woman'";
				switch (gender.gender) {
					case 'Man':
						preferenceSearch = `sexualPreference = 'Bisexual'
							OR sexualPreference = 'Gay'
							OR sexualPreference = 'Hetero'`;
						break;
					case 'Woman':
						preferenceSearch = `sexualPreference = 'Bisexual'
							OR sexualPreference = 'Hetero'
							OR sexualPreference = 'Lesbian'`;
						break;
				}
				break;
			case 'Gay':
				genderSearch = "gender = 'Man'";
				preferenceSearch =
					"sexualPreference = 'Bisexual' OR sexualPreference = 'Gay'";
				break;
			case 'Hetero':
				genderSearch = `gender = '${gender.gender == 'Man' ? 'Woman' : 'Man'}'`;
				preferenceSearch =
					"sexualPreference = 'Bisexual' OR sexualPreference = 'Hetero'";
				break;
			case 'Lesbian':
				genderSearch = "gender = 'Woman'";
				preferenceSearch =
					"sexualPreference = 'Bisexual' OR sexualPreference = 'Lesbian'";
				break;
		}
		let sql = `WITH UserLocation AS (
			SELECT
				u.id AS userId,
				COALESCE(ip.latitude, nav.latitude, fake.latitude) AS latitude,
				COALESCE(ip.longitude, nav.longitude, fake.longitude) AS longitude
			FROM user AS u
			LEFT JOIN locationIP AS ip ON u.id = ip.userId AND u.locationType = 'IP'
			LEFT JOIN locationNavigator AS nav ON u.id = nav.userId AND u.locationType = 'NAVIGATOR'
			LEFT JOIN locationFake AS fake ON u.id = fake.userId AND u.locationType = 'FAKE'
		),
		UserDistance AS (
			SELECT
				ul.userId,
				(
					6371 * ACOS(
						COS(RADIANS(userLoc.latitude)) * COS(RADIANS(ul.latitude))
						* COS(RADIANS(userLoc.longitude) - RADIANS(ul.longitude))
						+ SIN(RADIANS(userLoc.latitude)) * SIN(RADIANS(ul.latitude))
					)
				) AS distance
			FROM UserLocation AS ul
			CROSS JOIN (
				SELECT latitude, longitude
				FROM UserLocation
				WHERE userId = ${userId}
			) AS userLoc
			WHERE ul.userId <> ${userId}
		)
		SELECT
			u.id AS userId,
			u.email,
			u.username,
			u.firstName,
			u.lastName,
			u.birthday,
			strftime('%Y', 'now') - strftime('%Y', datetime(u.birthday / 1000, 'unixepoch')) AS age,
			(SELECT gender FROM gender WHERE userId = u.id) AS gender,
			(SELECT preference FROM sexualPreference WHERE userId = u.id) AS sexualPreference,
			(
				SELECT COUNT(ut1.tagId)
				FROM user_tag AS ut1
				JOIN user_tag AS ut2 ON ut1.tagId = ut2.tagId
				WHERE ut1.userId = ${userId}
				AND ut2.userId = u.id
			) AS commonTagCount,
			ud.distance,
			u.fameRating AS fameRating
		FROM UserLocation AS ul
		JOIN user AS u ON ul.userId = u.id
		JOIN UserDistance AS ud ON ul.userId = ud.userId
		WHERE u.birthday IS NOT NULL AND u.id <> ${userId}
		AND NOT EXISTS (
			SELECT 1 FROM \`like\` WHERE userId = ${userId} AND likeId = u.id
		)
		AND EXISTS (SELECT 1 FROM biography WHERE userId = u.id)
		AND EXISTS (SELECT 1 FROM user_tag WHERE userId = u.id)
		AND EXISTS (SELECT 1 FROM gender WHERE userId = u.id)
		AND EXISTS (SELECT 1 FROM sexualPreference WHERE userId = u.id)
		AND EXISTS (SELECT 1 FROM default_picture WHERE userId = u.id)
		AND EXISTS (
			SELECT 1 FROM locationIP WHERE userId = u.id
			UNION
			SELECT 1 FROM locationNavigator WHERE userId = u.id
			UNION
			SELECT 1 FROM locationFake WHERE userId = u.id
		) `;
		if (tagIds?.length) {
			sql += `AND u.id IN (
					SELECT ut.userId
					FROM user_tag AS ut
					WHERE ut.tagId IN (${tagIds.join()})
					GROUP BY ut.userId
					HAVING COUNT(DISTINCT ut.tagId) = ${tagIds.length}
				)`;
		}
		sql += ` AND EXISTS (SELECT 1 FROM gender WHERE userId = u.id AND ${genderSearch})
		AND EXISTS (SELECT 1 FROM sexualPreference WHERE userId = u.id AND ${preferenceSearch}) `;
		if (preference.preference == 'Bisexual') {
			switch (gender.gender) {
				case 'Man':
					sql += ` AND NOT EXISTS (
						SELECT 1 
						FROM gender g
						LEFT JOIN sexualPreference sp ON g.userId = sp.userId
						WHERE g.userId = u.id 
						AND g.gender = 'Man'
						AND sp.preference = 'Hetero'
					) `;
					break;
				case 'Woman':
					sql += ` AND NOT EXISTS (
						SELECT 1 
						FROM gender g
						LEFT JOIN sexualPreference sp ON g.userId = sp.userId
						WHERE g.userId = u.id 
						AND g.gender = 'Woman'
						AND sp.preference = 'Hetero'
					) `;
					break;
			}
		}
		sql += ` AND NOT EXISTS (
			SELECT 1 FROM block WHERE userId = ${userId} AND blockId = u.id
		) `;
		sql += ` AND NOT EXISTS (
			SELECT 1 FROM dislike WHERE userId = ${userId} AND dislikeId = u.id
		) `;
		if (commonTagMin) {
			sql += ` AND commonTagCount >= ${commonTagMin} `;
		}
		if (commonTagMax) {
			sql += ` AND commonTagCount <= ${commonTagMax} `;
		}
		if (fameRatingMin) {
			sql += ` AND fameRating >= ${fameRatingMin} `;
		}
		if (fameRatingMax) {
			sql += ` AND fameRating <= ${fameRatingMax} `;
		}
		if (locationMin) {
			sql += ` AND distance >= ${locationMin} `;
		}
		if (locationMax) {
			sql += ` AND distance <= ${locationMax} `;
		}
		if (ageMin) {
			sql += ` AND age >= ${ageMin} `;
		}
		if (ageMax) {
			sql += ` AND age <= ${ageMax} `;
		}
		switch (orderBy) {
			case 'location':
				sql += `ORDER BY distance ${sortBy}`;
				break;
			case 'age':
				sql += `ORDER BY birthday ${sortBy}`;
				break;
			case 'fameRating':
				sql += `ORDER BY ${orderBy} ${sortBy}`;
				break;
			case 'commonTag':
				sql += `ORDER BY commonTagCount ${sortBy}`;
				break;
		}
		sql += `
		LIMIT ${limit} OFFSET ${offset};)`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then(async (res: { userId: number }[]) => {
				const users: UserPublic[] = [];
				for await (const r of res) {
					const userService = new UserService();
					const user = await userService.getByPK(r.userId);
					users.push(await user.getPublic());
				}
				return users;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}
}
