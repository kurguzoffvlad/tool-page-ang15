// commands/templates/shared/styles.js

const getMainStylesTemplate = () => `:host {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;

    font-size: var(--evo40);
}`;

const getDeviceStylesTemplate = () => `:host {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;

    .device {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .desktop { background: green; }
    .tablet { background: blue; }
    .phone { background: red; }

    .vertical { color: white; }
    .horizontal { color: yellow; text-decoration: underline; }
}`;

module.exports = {
    getMainStylesTemplate,
    getDeviceStylesTemplate
};
