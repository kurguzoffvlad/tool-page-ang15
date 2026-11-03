// commands/templates/page-data/services.js

const getRequestServiceTemplate = (componentName, className) => `import { Injectable } from '@angular/core';

export interface IPageDataRequestConfig {
	url: string;
	params?: Record<string, string | number>;
}

@Injectable({
    providedIn: 'root'
})
export class ${className} {
    public start(): IPageDataRequestConfig {
		return {
			url: 'https://jsonplaceholder.typicode.com/posts',  // с VPN - иначе - 'assets/mock-posts.json',
			params: { _limit: 10 } // Ограничим до 10 записей для наглядности
		}
	};
}
`;

const getServerServiceTemplate = (componentName, className) => `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPageDataRequestConfig } from './${componentName}-1-request.service';

@Injectable({
    providedIn: 'root'
})
export class ${className} {
    public constructor(private http: HttpClient) {}

    public start(config: IPageDataRequestConfig): Observable<any> {
		// Для локального файла params не нужны
		return this.http.get<any>(config.url, { params: config.params });
	}
}
`;

const getParsedServiceTemplate = (componentName, className) => `import { Injectable } from '@angular/core';

export interface IPageDataParsedItem {
	id: number;
	userId: number;
	title: string;
	body: string;
}

export interface IPageDataParsedResult {
	content: IPageDataParsedItem[];
	total: number;
}

@Injectable({
    providedIn: 'root'
})
export class ${className} {
	public start(serverResult: any): IPageDataParsedResult {
		// Проверяем, что сервер вернул массив
		if (!Array.isArray(serverResult)) {
			return { content: [], total: 0 };
		}

		// Парсим и защищаемся от пустых полей
		const content: IPageDataParsedItem[] = serverResult.map((item: any) => ({
			id: Number(item.id) || 0,
			userId: Number(item.userId) || 0,
			title: String(item.title || 'Без названия').trim(),
			body: String(item.body || '').trim()
		}));

		return {
			content,
			total: content.length
		};
	}
}
`;

const getFactoryServiceTemplate = (componentName, className) => `import { Injectable } from '@angular/core';

import { IPageDataParsedResult } from './${componentName}-3-parsed.service';

export interface IPageDataViewModel {
	id: number;
	userId: number;
	title: string;
	bodyPreview: string;
	displayName: string;
}

@Injectable({
    providedIn: 'root'
})
export class ${className} {
	public start(parsedResult: IPageDataParsedResult): IPageDataViewModel[] {
		if (!parsedResult || !parsedResult.content) {
			return [];
		}

		return parsedResult.content.map(item => ({
			id: item.id,
			userId: item.userId,
			title: item.title,
			bodyPreview: item.body.length > 50 ? item.body.substring(0, 50) + '...' : item.body,
			displayName: item.title
		}));
	}
}
`;


module.exports = {
	getRequestServiceTemplate,
	getServerServiceTemplate,
	getParsedServiceTemplate,
	getFactoryServiceTemplate
};
