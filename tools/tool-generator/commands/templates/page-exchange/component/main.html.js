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

module.exports = {
	getHtmlTemplate,
};
