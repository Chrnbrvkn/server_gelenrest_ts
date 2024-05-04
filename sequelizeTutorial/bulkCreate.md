Метод bulkCreate в Sequelize используется для массового добавления записей в таблицу, что обычно эффективнее, чем последовательное создание каждой записи отдельно. Это особенно полезно при инициализации базы данных или массовом импорте данных.

Массовое добавление пользователей:
```javascript
await User.bulkCreate([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Carol', email: 'carol@example.com' }
]);
```
Массовое добавление продуктов с разными ценами:
```javascript
await Product.bulkCreate([
  { name: 'Notebook', price: 1000 },
  { name: 'Pen', price: 3.5 },
  { name: 'Desk', price: 200 }
]);
```
Инициализация категорий для магазина:
```javascript
await Category.bulkCreate([
  { title: 'Electronics' },
  { title: 'Clothing' },
  { title: 'Books' },
  { title: 'Home & Garden' }
]);
```
Добавление множества заказов для разных пользователей:
```javascript
await Order.bulkCreate([
  { userId: 1, productId: 5, quantity: 2 },
  { userId: 2, productId: 6, quantity: 3 },
  { userId: 3, productId: 7, quantity: 1 }
]);
```
Заполнение таблицы логов:
```javascript
await Log.bulkCreate([
  { message: 'System initialized', level: 'info' },
  { message: 'User logged in', level: 'info' },
  { message: 'Data updated', level: 'warning' }
]);
```

<style>
  body { background-color: #000; }
</style>