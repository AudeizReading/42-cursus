import { ApiBody, ApiQuery, ProfileDTO } from '.';

export type SortType = 'ASC' | 'DESC';
export type OrderByBrowsingType = 'location' | 'commonTag' | 'fameRating' | 'age';

export type SortObjectType = { column: OrderByBrowsingType; order: SortType | undefined };

export interface BrowserApiQueryDTO extends ApiQuery {
	howManyUser?: number;
	currentUser?: number;
	orderBy?: OrderByBrowsingType;
	sortBy?: SortType;
}

export interface Range {
	min?: number;
	max?: number;
}

export interface BrowserApiBodyDTO extends ApiBody {
	tagIds?: number[];
	ageRange?: Range;
	distanceRange?: Range;
	fameRatingRange?: Range;
}

export interface BrowserApiResponseDTO {
	results: ProfileDTO[];
	limit: number;
	page: number;
}

export interface IBrowsingSearch {
	orderBy?: OrderByBrowsingType;
	sortBy?: SortType;
	locationMin?: number;
	locationMax?: number;
	commonTagMin?: number;
	commonTagMax?: number;
	fameRatingMin?: number;
	fameRatingMax?: number;
	ageMin?: number;
	ageMax?: number;
}
