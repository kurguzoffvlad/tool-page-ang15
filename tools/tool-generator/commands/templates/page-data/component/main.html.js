// noinspection AngularMissingRequiredDirectiveInputBinding

const getMainHtmlTemplate = (componentName)=>
// language=HTML
`
<ng-container *ngIf="screen.state$ | async as info">
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
</ng-container>
`;

module.exports = { getMainHtmlTemplate };
