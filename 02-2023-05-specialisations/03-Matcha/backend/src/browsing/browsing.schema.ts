import { UserPublic } from '$app/user/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class BrowsingQuery {
	@ApiProperty({ required: false, default: 0 })
	currentUser?: number;
	@ApiProperty({ required: false, default: 5 })
	howManyUser?: number;
	@ApiProperty({
		example: `location, commonTag, fameRating, age`,
		required: false,
	})
	orderBy?: orderByBrowsingType;
	@ApiProperty({ example: `ASC, DESC`, required: false })
	sortBy?: sortType;
}

export class SearchGapQuery extends BrowsingQuery {
	@ApiProperty({ required: false })
	ageMin?: number;
	@ApiProperty({ required: false })
	ageMax?: number;
	@ApiProperty({ required: false })
	locationMin?: number;
	@ApiProperty({ required: false })
	locationMax?: number;
	@ApiProperty({ required: false })
	commonTagMin?: number;
	@ApiProperty({ required: false })
	commonTagMax?: number;
	@ApiProperty({ required: false })
	fameRatingMin?: number;
	@ApiProperty({ required: false })
	fameRatingMax?: number;
}

export class OkResponseBrowsing {
	@ApiProperty({ type: [UserPublic] })
	results: UserPublic[];
}

export class Range {
	@ApiProperty({ required: false })
	min?: number;
	@ApiProperty({ required: false })
	max?: number;
}

export class SearchBrowsingDto {
	@ApiProperty({ required: false, type: [Number] })
	tagIds?: number[];
	@ApiProperty({ required: false, type: Range })
	ageRange?: Range;
	@ApiProperty({ required: false, type: Range })
	distanceRange?: Range;
	@ApiProperty({ required: false, type: Range })
	fameRatingRange?: Range;
}

export type sortType = 'ASC' | 'DESC';
export type orderByBrowsingType =
	| 'location'
	| 'commonTag'
	| 'fameRating'
	| 'age';
