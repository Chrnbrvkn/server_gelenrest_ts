#Транзакции

Транзакции в Sequelize представляют собой важный инструмент управления группой связанных операций базы данных, которые должны быть выполнены как единое целое. Транзакции обеспечивают целостность данных и помогают предотвратить возможные ошибки, возникающие в результате параллельных изменений данных разными пользователями или системными процессами.

Обрабатываются с помощью метода sequelize.transaction(). Этот метод может принимать колбэк, который выполняет необходимые операции базы данных. Все операции внутри колбэка должны использовать объект транзакции t как параметр, чтобы гарантировать, что они включены в одну транзакционную сессию.
```javascript
// Выполнить транзакцию для создания заказа и обновления баланса пользователя
await sequelize.transaction(async (t) => {
  const order = await Order.create({ userId: 1, total: 100 }, { transaction: t });
  await User.decrement('balance', { by: 100, where: { id: 1 }, transaction: t });
});
```

В этом примере:

sequelize.transaction() начинает транзакцию.
Внутри транзакции сначала создается новый заказ (Order.create()), где передается объект транзакции t для включения этой операции в транзакцию.
Затем баланс пользователя уменьшается на 100 (User.decrement()), снова с использованием той же транзакции t.
Если все операции успешно выполнены, транзакция автоматически завершается с фиксацией изменений (commit). Если во время выполнения операций происходит ошибка, транзакция откатывается (rollback), и все изменения, сделанные в рамках транзакции, отменяются.


Обновление связанных данных:
Создание заказа и одновременное обновление складского учета и баланса пользователя для отражения покупки.
```javascript
await sequelize.transaction(async (t) => {
  const order = await Order.create({ userId: 1, productId: 10, quantity: 2 }, { transaction: t });
  await Product.decrement('stock', { by: 2, where: { id: 10 }, transaction: t });
  await User.decrement('balance', { by: order.totalPrice, where: { id: 1 }, transaction: t });
});
```

Передача данных между пользователями:
Передача средств или активов между двумя пользователями, гарантируя, что обе операции выполнены успешно.
```javascript
await sequelize.transaction(async (t) => {
  await User.decrement('balance', { by: 150, where: { id: 1 }, transaction: t });
  await User.increment('balance', { by: 150, where: { id: 2 }, transaction: t });
});
```

Групповое обновление данных:
Массовое обновление данных пользователей или продуктов, например, обновление статуса всех заказов в конце дня.
```javascript
await sequelize.transaction(async (t) => {
  await Order.update({ status: 'Shipped' }, { where: { status: 'Processed' }, transaction: t });
});
```

Миграции данных:
Безопасное выполнение миграций данных, которые требуют нескольких изменений в разных таблицах.
```javascript
await sequelize.transaction(async (t) => {
  await sequelize.query('ALTER TABLE users ADD COLUMN last_login TIMESTAMP;', { transaction: t });
  await sequelize.query('UPDATE users SET last_login = NOW();', { transaction: t });
});
```

Откат изменений при ошибках:
Выполнение сложной серии операций, которые должны быть отменены при возникновении любой ошибки в процессе.
```javascript
await sequelize.transaction(async (t) => {
  const user = await User.create({ name: 'New User', balance: 100 }, { transaction: t });
  try {
    await someComplexOperationThatMightFail({ userId: user.id }, { transaction: t });
  } catch (error) {
    throw new Error('Operation failed, transaction will be rolled back');
  }
});
```

<style>
  body { background-color: #000; }
</style>