
/**
 * Шаблоны для exchange-компонента (page-exchange).
 *
 * Exchange-компонент — «плоский»: нет devices/common-devices, нет сервисов.
 * Он наследует ExchangeSubscribeComponent из tool-exchange-ang15 и получает
 * данные через @Input() viewDataFields.
 *
 * Стили здесь НЕ описаны — они общие и берутся из
 * templates/shared/styles.js → getMainStylesTemplate().
 */

/* ============================================================
 * TypeScript
 * ============================================================ */

/**
 * Генерирует .component.ts.
 *
 * @param {string} componentName  kebab-case имя компонента (например, 'user-card')
 * @param {string} styleType      css | scss | sass | less | styl — для styleUrls
 * @param {string} className      PascalCase имя класса (например, 'UserCard')
 * @returns {string} готовый TS-код
 */
const getTsTemplate = (componentName, styleType, className) => `import { Input, Component, OnInit, OnDestroy } from '@angular/core';

import { ExchangeSubscribeComponent, ExchangeLighthouse } from 'tool-exchange-ang15';

@Component({
    selector: 'exch-${componentName}',
    templateUrl: './${componentName}.component.html',
    styleUrls: [ './${componentName}.component.${styleType}' ]
})
export class ${className}Component extends ExchangeSubscribeComponent implements OnInit, OnDestroy {
    private static readonly extendsClassName = '${className}Component';

    @Input() public viewDataFields: any = {};

    public constructor(
        public override exchange: ExchangeLighthouse) {
        super(${className}Component.extendsClassName, exchange);
    }

    public ngOnInit(): void { }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
`;

module.exports = {
	getTsTemplate,
};
