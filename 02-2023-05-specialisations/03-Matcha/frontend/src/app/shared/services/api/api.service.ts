import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBody, ApiQuery, Route, RouteConfig, api } from '@app/models';
import { LoggerService } from '@app/shared';
import { map, Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	public constructor(
		private http: HttpClient,
		private logger: LoggerService,
	) {}

	public get<T extends ApiQuery, U extends ApiBody>(
		endpoint: string,
		params?: { query?: T; body?: U; params?: string; reportProgress?: boolean },
	): Observable<unknown> {
		try {
			const uri = `${this.getQueryUri(endpoint, 'GET', params as { query: T; body: U; params: string })}`;
			return this.http.get<unknown>(uri, { reportProgress: params?.reportProgress || false });
		} catch (error) {
			this.logger.handleError<unknown>(`api get ${endpoint}`, error);
		}
		return of(null);
	}

	public getUrlToFile(imageUrl: string, fileName: string): Observable<File> {
		return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
			map((blob: Blob) => {
				// Crée un objet File à partir du Blob reçu
				return new File([blob], fileName, { type: blob.type });
			}),
		);
	}

	public post<T extends ApiQuery, U extends ApiBody | FormData>(
		endpoint: string,
		params: { query?: T; body?: U; params?: string; reportProgress?: boolean },
	): Observable<unknown> {
		try {
			const uri = `${this.getQueryUri(endpoint, 'POST', params as { query: T; body: U; params: string })}`;
			return this.http.post<unknown>(uri, params.body, {
				reportProgress: params?.reportProgress || false,
				observe: 'events',
			});
		} catch (error) {
			this.logger.handleError<unknown>(`api post ${endpoint}`, error);
		}
		return of(null);
	}

	public put<T extends ApiQuery, U extends ApiBody>(
		endpoint: string,
		params: { query?: T; body?: U; params?: string; reportProgress?: boolean },
	): Observable<unknown> {
		try {
			const uri = `${this.getQueryUri(endpoint, 'PUT', params as { query: T; body: U; params: string })}`;
			return this.http.put<unknown>(uri, params.body, {
				reportProgress: params?.reportProgress || false,
				observe: 'events',
			});
		} catch (error) {
			this.logger.handleError<unknown>(`api put ${endpoint}`, error);
		}
		return of(null);
	}

	public delete<T extends ApiQuery, U extends ApiBody>(
		endpoint: string,
		params: { query?: T; body?: U; params?: string; reportProgress?: boolean },
	): Observable<unknown> {
		try {
			const uri = `${this.getQueryUri(endpoint, 'DELETE', params as { query: T; body: U; params: string })}`;
			const { body } = params;
			if (body) {
				return this.http.request<unknown>('delete', uri, {
					body,
					reportProgress: params?.reportProgress || false,
					observe: 'events',
				});
			} else {
				return this.http.delete<unknown>(uri, { reportProgress: params?.reportProgress || false });
			}
		} catch (error) {
			this.logger.handleError<unknown>(`api delete ${endpoint}`, error);
		}
		return of(null);
	}

	private getEndpoint(endpoint: string): Route {
		const keys = endpoint.split('.');
		let cur = api;
		for (const key of keys) {
			cur = Object.getOwnPropertyDescriptor(cur, key)?.value;
			if (!cur) {
				throw new Error('API endpoint not found');
			}
			if ('uri' in cur && 'config' in cur) {
				return cur as unknown as Route;
			}
		}

		throw new Error('API endpoint not found');
	}

	private getEndpointConfig(endpoint: string, method: string): RouteConfig | undefined {
		const keys = endpoint.split('.');
		let cur = api;

		for (const key of keys) {
			cur = Object.getOwnPropertyDescriptor(cur, key)?.value;
			if (!cur) {
				throw new Error('API endpoint not found');
			}
			if ('uri' in cur && 'config' in cur) {
				return (cur as unknown as Route).config.find((config) => config.method === method);
			}
		}

		throw new Error('API endpoint not found');
	}

	private getQueryUri<T extends { query?: ApiQuery; body?: ApiBody; params: string }>(
		endpoint: string,
		method: string,
		p?: T,
	): string {
		try {
			const route = this.getEndpoint(endpoint);
			let uri = route.uri;
			if (p) {
				const { query, params } = p as T;
				const config = this.getEndpointConfig(endpoint, method);
				if (config) {
					let httpParams: HttpParams = new HttpParams();
					if (params && config.params) {
						uri = `${route.uri}${params}`;
					}
					if (query && config.query?.config) {
						for (const key of Object.keys(query)) {
							if (Object.prototype.hasOwnProperty.call(config.query.config, key)) {
								httpParams = httpParams.set(
									key,
									Object.getOwnPropertyDescriptor(query, key)?.value as string,
								);
							}
						}
						uri = `${uri}?${httpParams.toString()}`;
					}
				}
			}
			return `${uri}`;
		} catch (error) {
			this.logger.handleError<unknown>('No endpoint found');
		}
		throw new Error('No endpoint found');
	}

	private parseUrl(uri: string): {
		scheme: string;
		domain: string;
		port: string | null;
		paths: string[];
		query: { [key: string]: string };
		fragment: string | null;
	} {
		const uriRegex = /^(.*?):\/\/([^/:]+)(?::(\d+))?(\/[^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
		const match = uri.match(uriRegex);

		if (!match) {
			throw new Error('URI is not in valid format');
		}

		const [, scheme, domain, port, path, queryStr, fragment] = match;

		// Parse paths
		const paths = path.split('/').filter(Boolean);

		// Parse query parameters
		const query: { [key: string]: string } = {};
		if (queryStr) {
			queryStr.split('&').forEach((param) => {
				const [key, value] = param.split('=');
				query[decodeURIComponent(key)] = decodeURIComponent(value);
			});
		}

		return {
			scheme,
			domain,
			port: port || null,
			paths,
			query,
			fragment: fragment || null,
		};
	}

	public needAuth(url: string, method: string): boolean {
		const uri = this.parseUrl(url);
		const keys = uri.paths.filter((path) => path !== 'api');
		let cur = api;
		for (const key of keys) {
			const old = cur;
			cur = Object.getOwnPropertyDescriptor(cur, key)?.value;
			if (!cur) {
				// gestion des parametres dynamiques d'url :id
				if (/^[0-9]+$/.test(key) || /^[0-9a-z_-]{36}$/.test(key)) {
					cur = Object.getOwnPropertyDescriptor(old, 'id')?.value;
					if (key === keys[keys.length - 1]) {
						if ('config' in cur) {
							for (const config of (cur as unknown as Route).config) {
								if (config.method === method) {
									return config.requiresAuth;
								}
							}
						}
					}
					continue;
				}
				throw new Error(`API endpoint not found: ${key}`);
			}
			if ('config' in cur) {
				for (const config of (cur as unknown as Route).config) {
					if (config.method === method) {
						return config.requiresAuth;
					}
				}
			}
			if ('id' in cur) {
				if ('config' in (cur['id'] as Route)) {
					for (const config of (cur['id'] as unknown as Route).config) {
						if (config.method === method) {
							return config.requiresAuth;
						}
					}
				}
			}
			if ('endpoint' in cur) {
				for (const config of (cur['endpoint'] as unknown as Route).config) {
					if (config.method === method) {
						return config.requiresAuth;
					}
				}
			}
		}
		throw new Error('API endpoint not found');
	}
}
