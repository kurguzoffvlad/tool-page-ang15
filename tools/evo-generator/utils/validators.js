// evo-front-lib\projects\evo-lib\tools\evo-generator\utils\validators.js

const VALID_STYLES = ['css', 'scss', 'sass', 'less', 'styl'];

function validateComponentName(name) {
    if (!name || name.trim() === '') {
        throw new Error('❌ Имя компонента не может быть пустым');
    }
    if (/[а-яА-ЯёЁ]/.test(name)) {
        throw new Error('❌ Имя компонента не должно содержать кириллицу');
    }
    if (!/^[a-z][a-z0-9-]*$/.test(name)) {
        throw new Error('❌ Имя компонента должно быть в kebab-case (например: user-profile)');
    }
    return true;
}

function validateStyleType(style) {
    if (!VALID_STYLES.includes(style)) {
        throw new Error(`❌ Допустимые типы стилей: ${VALID_STYLES.join(', ')}`);
    }
    return true;
}

module.exports = {
    validateComponentName,
    validateStyleType,
    VALID_STYLES
};
