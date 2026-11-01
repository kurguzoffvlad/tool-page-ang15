// commands/templates/page-data/main.js

const getMainTemplate = (componentName, styleType, className) => `import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ExchangeSubscribeComponent, ExchangeLighthouse } from 'tool-exchange-ang15';
import { ToolScreenService, ScreenEnums } from 'tool-screen-ang15';

import { ${className}1RequestService } from './services/${componentName}-1-request.service';
import { ${className}2ServerService } from './services/${componentName}-2-server.service';
import { ${className}3ParsedService } from './services/${componentName}-3-parsed.service';
import { ${className}4FactoryService } from './services/${componentName}-4-factory.service';

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

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
`;

const getMainHtmlTemplate = (componentName) => `<ng-container *ngIf="screen.state$ | async as info">
    <ng-container *ngIf="info.screen.type === ScreenEnums.Phone">
        <exch-${componentName}-phone
            [screenInfo]="info"
            [viewDataPage]="viewDataPage"
            [filters]="filters"
            [options]="options"
        ></exch-${componentName}-phone>
    </ng-container>

    <ng-container *ngIf="info.screen.type === ScreenEnums.Tablet">
        <exch-${componentName}-tablet
            [screenInfo]="info"
            [viewDataPage]="viewDataPage"
            [filters]="filters"
            [options]="options"
        ></exch-${componentName}-tablet>
    </ng-container>

    <ng-container *ngIf="info.screen.type === ScreenEnums.Desktop">
        <exch-${componentName}-desktop
            [screenInfo]="info"
            [viewDataPage]="viewDataPage"
            [filters]="filters"
            [options]="options"
        ></exch-${componentName}-desktop>
    </ng-container>
</ng-container>`;

module.exports = {
	getMainTemplate,
	getMainHtmlTemplate
};
