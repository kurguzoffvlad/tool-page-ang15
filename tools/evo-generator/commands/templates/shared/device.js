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
			UserCardDesktopComponent.extendsClassName,
			exchange
		);
    }
}
`;

const getDeviceHtmlTemplate = (deviceName) => `<div class="device"
    [ngClass]="{
        'phone': screenInfo.screen.type === ScreenEnum.Phone,
        'tablet': screenInfo.screen.type === ScreenEnum.Tablet,
        'desktop': screenInfo.screen.type === ScreenEnum.Desktop
    }"
>
    <div [ngClass]="{
        'vertical': screenInfo.screen.orientation === OrientationScreenEnum.Vertical,
        'horizontal': screenInfo.screen.orientation === OrientationScreenEnum.Horizontal
    }">
                <h1>EVO AI :)</h1>
        <p>${deviceName} device works! Страница - {{ (evo.dynamicWidth.maxPageWidth.lighthouse$ | async)?.maxPageWidth }}</p>
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
