// commands/templates/page-data/main.js

const getMainTemplate = (componentName, styleType, className, componentPascal) => `import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';

import {ExchangeSubscribeComponent, ExchangeLighthouse} from 'tool-exchange-ang15';
import {ToolScreenService, ScreenEnums} from 'tool-screen-ang15';

import { ${componentPascal}1RequestService } from './services/${componentName}-1-request.service';
import { ${componentPascal}2ServerService } from './services/${componentName}-2-server.service';
import { ${componentPascal}3ParsedService } from './services/${componentName}-3-parsed.service';
import { ${componentPascal}4FactoryService } from './services/${componentName}-4-factory.service';

@Component({
    selector: 'exch-${componentName}',
    templateUrl: './${componentName}.component.html',
    styleUrls: ['./${componentName}.component.${styleType}']
})
export class ${className}Component extends ExchangeSubscribeComponent implements OnInit, OnDestroy {
    static readonly extendsClassName = '${className}Component';

    @Input() viewDataPage: any = {};
    @Input() filters: any;
    @Input() options: any;

    public ScreenEnum = ScreenEnums;

    public constructor(
        public requestService: ${componentPascal}1RequestService,
        public serverService: ${componentPascal}2ServerService,
        public parsedService: ${componentPascal}3ParsedService,
        public factoryService: ${componentPascal}4FactoryService,
        public screen: ToolScreenService,
        public override exchange: ExchangeLighthouse

    ) {
        super(${className}Component.extendsClassName, exchange);
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
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
            (click)="newPage()"
        ></exch-${componentName}-phone>
    </ng-container>

    <ng-container *ngIf="info.screen.type === ScreenEnums.Tablet">
        <exch-${componentName}-tablet
            [screenInfo]="info"
            [viewDataPage]="viewDataPage"
            [filters]="filters"
            [options]="options"
            (click)="newPage()"
        ></exch-${componentName}-tablet>
    </ng-container>

    <ng-container *ngIf="info.screen.type === ScreenEnums.Desktop">
        <exch-${componentName}-desktop
            [screenInfo]="info"
            [viewDataPage]="viewDataPage"
            [filters]="filters"
            [options]="options"
            (click)="newPage()"
        ></exch-${componentName}-desktop>
    </ng-container>
</ng-container>`;

module.exports = {
	getMainTemplate,
	getMainHtmlTemplate
};
