// commands/templates/page-detail/main.js

const getMainTemplate = (componentName, styleType, className) => `import { Component, Input, OnDestroy } from '@angular/core';

import { ToolScreenService, ScreenEnums } from 'tool-screen-ang15';

@Component({
    selector: 'exch-${componentName}',
    templateUrl: './${componentName}.component.html',
    styleUrls: [ './${componentName}.component.${styleType}' ]
})

export class ${className}Component implements OnDestroy {
    @Input() viewDataPage: any = {};
    @Input() filters: any;
    @Input() options: any;

    public ScreenEnums = ScreenEnums;

    public constructor(public screen: ToolScreenService) {}

    public ngOnDestroy(): void {
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
