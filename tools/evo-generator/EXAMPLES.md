# EVO Generator - Документация

```
"scripts": {
    evo": "node projects/evo-lib/tools/evo-generator/index.js"
}
```

## Команды

| Команда | Описание |
|---------|----------|
| `component-exchange` | Компонент с NgExchangeSubscribeComponent |
| `page-detail` | Страница детализации (с устройствами) |
| `page-data` | Страница со списком данных + 5 сервисов |

## Параметры

| Параметр | Обязательность | По умолчанию | Пример |
|----------|----------------|--------------|--------|
| `--name` | Да | - | `--name user-card` |
| `--style` | Нет | `scss` | `--style less` |
| `--path` | Нет | текущая папка | `--path features/admin` |

## Примеры использования разработчиком в режиме разработки

---

### Базовое создание - component-exchange
npm run evo component-exchange -- --name user-card

#### С указанием стиля
npm run evo component-exchange -- --name user-card --style less

#### В конкретной папке
npm run evo component-exchange -- --name user-card --style scss --path components/shared

---

### Базовое создание - page-detail
npm run evo page-detail -- --name user-profile

#### С указанием стиля и пути
npm run evo page-detail -- --name user-profile --style css --path pages/profile

---

### Базовое создание (с 5 сервисами) - page-data
npm run evo page-data -- --name users-list

#### Полный вариант - page-data
npm run evo page-data -- --name users-list --style scss --path features/admin

---

## Примеры использования пользователем после становки библиотеки

npx evo-generator page-data -- --name user-car --style scss --path src/app
