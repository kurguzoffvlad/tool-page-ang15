// commands/templates/shared/device.js

const getDeviceTemplate = (deviceName, styleType, parentClassName, parentImportPath, className) => `import { Component } from '@angular/core';

import { ${parentClassName} } from '${parentImportPath}';
import { ExchangeLighthouse } from 'tool-exchange-ang15';

@Component({
    selector: 'exch-${deviceName}',
    templateUrl: './${deviceName}.component.html',
    styleUrls: ['./${deviceName}.component.${styleType}']
})
export class ${className} extends ${parentClassName} {
    private static readonly extendsClassName = '${className}';

    public constructor(
		public override exchange: ExchangeLighthouse,
	) {
        super(
			${className}.extendsClassName,
			exchange
		);
    }
}
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDeviceHtmlTemplate = (deviceName) => `<div class="device"
    [ngClass]="{
        'phone': screenInfo.screen.type === ScreenEnums.Phone,
        'tablet': screenInfo.screen.type === ScreenEnums.Tablet,
        'desktop': screenInfo.screen.type === ScreenEnums.Desktop
    }"
>
    <div [ngClass]="{
        'vertical': screenInfo.screen.orientation === OrientationScreenEnum.Vertical,
        'horizontal': screenInfo.screen.orientation === OrientationScreenEnum.Horizontal
    }">
                <h1>AI :)</h1>
        <p>Смартфон - {{screenInfo.devices.phoneMaxSize}}</p>
        <p>Планшет - {{screenInfo.devices.tabletMaxSize}}</p>
        <p>Монитор - {{screenInfo.devices.desktopMaxSize}}</p>
        <p>ScreenWidth - {{screenInfo.screen.options.proportions.width}}</p>
        <p>ScreenInnerWidth - {{screenInfo.screen.options.proportions.innerWidth}}</p>
    </div>
</div>`;

module.exports = {
	getDeviceTemplate,
	getDeviceHtmlTemplate
};
