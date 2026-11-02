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

module.exports = {
	getMainTemplate,
};
