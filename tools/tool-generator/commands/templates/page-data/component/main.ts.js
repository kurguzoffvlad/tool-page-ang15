const getMainTemplate = (componentName, styleType, className) => `import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { firstValueFrom } from 'rxjs';

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
    	this.loadData().then();
    }

    public loadData(): Promise<> { // !!! в <> - добавить void
		this.isLoading = true;
		this.errorMessage = null;

		try {
			const config = this.requestService.start();

			const serverResult = await firstValueFrom( this.serverService.start(config) );

			const parsedResult = this.parsedService.start(serverResult);

			const items = this.factoryService.start(parsedResult);

			this.dataItems = items;
		} catch (error) {
			console.error('Ошибка получения данных:', error);
			this.errorMessage = 'Не удалось загрузить данные с сервера';
			this.dataItems = [];
		} finally {
			this.isLoading = false;
		}
	}
	}

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
`;

module.exports = { getMainTemplate };
