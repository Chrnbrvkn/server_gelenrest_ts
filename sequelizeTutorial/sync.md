```javascript
// Создаст таблицу 'users' если она не существует
await User.sync();

// Создаст таблицы для всех моделей определенных в Sequelize
await sequelize.sync();

// Удаляет таблицу если она существует и создает заново
await User.sync({ force: true });

// Выполнит sync только если имя базы данных заканчивается на '_test'
await sequelize.sync({ match: /_test$/ });

// Создаст уникальные индексы или внешние ключи, если они указаны в моделях
await sequelize.sync({ alter: true });
```