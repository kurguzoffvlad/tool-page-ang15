const getMainTemplate = (componentName, styleType, className) => `import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';

import { ExchangeSubscribeComponent, ExchangeLighthouse } from 'tool-exchange-ang15';
import { ToolScreenService, ScreenEnums } from 'tool-screen-ang15';

import { ${className}1RequestService } from './services/${componentName}-1-request.service';
import { ${className}2ServerService } from './services/${componentName}-2-server.service';
import { ${className}3ParsedService } from './services/${componentName}-3-parsed.service';
import { ${className}4FactoryService, IPageDataViewModel } from './services/${componentName}-4-factory.service';

@Component({
    selector: 'exch-${componentName}',
    templateUrl: './${componentName}.component.html',
    styleUrls: [ './${componentName}.component.${styleType}' ]
})
export class ${className}Component extends ExchangeSubscribeComponent implements OnInit, OnDestroy {
    static readonly extendsClassName = '${className}Component';

    @Input() viewDataPage: any = {};
    @Input() filters: any;
    @Input() options: any;

    public ScreenEnums = ScreenEnums;

	public dataItems: IPageDataViewModel[] = [];
	public isLoading: boolean = false;
	public errorMessage: string | null = null;

	private readonly destroyedData$ = new Subject();

    public constructor(
        public requestService: ${className}1RequestService,
        public serverService: ${className}2ServerService,
        public parsedService: ${className}3ParsedService,
        public factoryService: ${className}4FactoryService,
        public screen: ToolScreenService,
        public override exchange: ExchangeLighthouse

    ) {
        super(${className}Component.extendsClassName, exchange);
    }

    public ngOnInit(): void {
    }

    public loadData(): void {
		this.isLoading = true;
		this.errorMessage = null;

		// 1. Request
		const config = this.requestService.start();

		// 2. Server (выполнение HTTP-запроса)
		this.serverService.start(config)
			.pipe(
				// Отписка при уничтожении компонента
				takeUntil(this.destroyedData$),

				// 3. Parsed
				map((serverResult) => this.parsedService.start(serverResult)),

				// 4. Factory
				map((parsedResult) => this.factoryService.start(parsedResult)),

				// Обработка ошибок
				catchError((error) => {
					console.error('Ошибка получения данных:', error);
					this.errorMessage = 'Не удалось загрузить данные с сервера';
					this.isLoading = false;
					return of([]); // Возвращаем пустой массив
			})
		).subscribe({
			next: (items) => { this.dataItems = items; },
			error: () => {}, // Уже обработан в catchError
			complete: () => { this.isLoading = false; }
		});
	}

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        this.destroyedData$.next(undefined);
		this.destroyedData$.complete();
    }
}
`;

module.exports = { getMainTemplate };
