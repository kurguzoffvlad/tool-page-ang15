// commands/templates/shared/common-devices.js

// language=TEXT
const getCommonDevicesTemplate = (componentName, className, useObservableScreen = false) => {
    const screenInput = useObservableScreen
        ? '@Input() screenInfo$!: Observable<IScreenInfo>;'
        : '@Input() screenInfo!: IScreenInfo;';

    const imports = useObservableScreen
        ? 'import {Observable} from \'rxjs\';\n'
        : '';

    return `import { Component, Input, Inject, OnDestroy } from '@angular/core';
${imports}import { ExchangeSubscribeComponent, ExchangeLighthouse } from 'tool-exchange-ang15';
${imports}import { IScreenInfo, ScreenEnums, OrientationScreenEnum } from 'tool-screen-ang15';

@Component({
    selector: 'exch-${componentName}',
    template: \`<ng-content></ng-content>\`,
    styles: [\`
        :host {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            overflow: hidden;
        }
    \`]
})
export class ${className} extends ExchangeSubscribeComponent implements OnDestroy {
    ${screenInput}
    @Input() viewDataPage: any = {};
    @Input() filters: any;
    @Input() options: any;


    ScreenEnums = ScreenEnums;
    OrientationScreenEnum = OrientationScreenEnum;

    public constructor(
    	@Inject(String) extendsClassName: string,
    	public override exchange: ExchangeLighthouse
    ) {
        super(extendsClassName, exchange);
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
`;
};

module.exports = {
    getCommonDevicesTemplate
};
