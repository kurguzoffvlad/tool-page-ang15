// commands/templates/page-exchange/main.js

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

/* ============================================================
 * HTML
 * ============================================================ */

/**
 * Генерирует .component.html.
 *
 * @param {string} componentName  kebab-case имя компонента — используется в CSS-классе
 *                                контейнера (например, 'user-card-container')
 * @returns {string} готовый HTML
 */
const getHtmlTemplate = (componentName) => `<div class="${componentName}-container">
    <p>${componentName} works!</p>
    <p>ExchangeSubscribeComponent - communication-center-for-components-and-services!!!</p>
</div>`;

/* ============================================================
 * ЭКСПОРТ
 * ============================================================ */

module.exports = {
	getTsTemplate,
	getHtmlTemplate,
};
