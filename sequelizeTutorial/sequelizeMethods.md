findAll: Извлекает все записи, соответствующие заданному условию.

findOne: Извлекает одну запись, соответствующую заданному условию.

findByPk: Извлекает запись по первичному ключу.

create: Создает новую запись с заданными значениями.

update: Обновляет записи, соответствующие заданным условиям.

destroy: Удаляет записи, соответствующие заданным условиям.

bulkCreate: Пакетное создание записей.

count: Подсчитывает количество записей, соответствующих условиям.

increment: Увеличивает значение поля на заданное число для записей, соответствующих условиям.

decrement: Уменьшает значение поля на заданное число для записей, соответствующих условиям.

sync: Синхронизирует модели с базой данных, создавая таблицы.

transaction: Позволяет выполнить несколько операций в рамках одной транзакции.

belongsTo: Устанавливает связь "один к одному" с другой моделью.

hasMany: Устанавливает связь "один ко многим" с другой моделью.

findAndCountAll: Извлекает записи и подсчитывает их количество, соответствующие заданному условию.



1. Создание нового объекта с вложенными элементами

```javascript
await House.create({
  name: 'Dream House',
  address: '123 Maple St',
  roomCount: 5,
  housesRooms: [
    { name: 'Bedroom', price: 100 },
    { name: 'Kitchen', price: 150 }
  ]
}, {
  include: [Rooms]  // Указание на необходимость включения комнат
});
```


2. Поиск одного объекта с включением связанных таблиц
```javascript

const house = await House.findOne({
  where: { id: 1 },
  include: [
    {
      model: Rooms,
      as: 'housesRooms'
    },
    {
      model: HousesPictures,
      as: 'housesPictures'
    }
  ]
});
```


3. Обновление данных объекта с условиями
```javascript

await House.update({ name: "Updated Name" }, {
  where: { id: 1 }
});
```

4. Удаление объекта
```javascript

await House.destroy({
  where: { id: 1 }
});
```

5. Получение всех объектов с определёнными фильтрами и сортировкой
```javascript

const houses = await House.findAll({
  where: { roomCount: { [Sequelize.Op.gt]: 3 } },  // Больше трёх комнат
  order: [['createdAt', 'DESC']]  // Сортировка по дате создания
});
```

Другие популярные операторы сортировки:
ASC: По возрастанию.
DESC: По убыванию.
Множественная сортировка: [['name', 'ASC'], ['id', 'DESC']] сначала сортирует по имени по возрастанию, затем по ID по убыванию.


6. Сложный поиск с использованием операторов
```javascript

const rooms = await Rooms.findAll({
  include: [{
    model: House,
    where: { name: { [Sequelize.Op.like]: '%Villa%' } }
  }],
  where: {
    level: { [Sequelize.Op.between]: [1, 3] }
  }
});
```

include: Подключает связанные модели. Здесь включается модель House, и фильтрация происходит по имени дома, содержащему "Villa".
where: Фильтрует комнаты, где уровень находится между 1 и 3 (включительно), используя Sequelize.Op.between.

Использование Sequelize.Op.or для комбинации условий:
```javascript
where: {
  [Sequelize.Op.or]: [{ id: 1 }, { id: 2 }]
}
```

Фильтрация по нескольким полям с различными условиями:
```javascript
where: {
  createdAt: { [Sequelize.Op.lt]: new Date(), [Sequelize.Op.gt]: someDate }
}
```

Включение нескольких связанных моделей для сложных запросов:
```javascript
include: [{
  model: User,
  as: 'Owner',
  where: { name: 'John' }
}, {
  model: Room,
  as: 'Rooms',
  required: false
}]
```


7. Подсчет объектов с условиями
```javascript
const count = await House.count({
  where: { name: { [Sequelize.Op.like]: '%Villa%' } }
});
```

8. Поиск и обновление объектов в транзакции
```javascript
await sequelize.transaction(async (t) => {
  const room = await Rooms.findOne({ where: { name: "Old Room" } }, { transaction: t });
  if (room) {
    await room.update({ name: "New Room" }, { transaction: t });
  }
});
```

9. Агрегация данных (суммирование)
```javascript
const totalCost = await Rooms.sum('price', {
  where: { houseId: 1 }
});
```

10. Поиск с максимальным и минимальным значениями
```javascript
const maxPriceRoom = await Rooms.findOne({
  where: { houseId: 1 },
  order: [['price', 'DESC']]  // Наибольшая стоимость
});

const minPriceRoom = await Rooms.findOne({
  where: { houseId: 1 },
  order: [['price', 'ASC']]  // Наименьшая стоимость
});

```

Есть модели User, Product, и Order
```javascript
// Найти всех пользователей старше 18 лет
const users = await User.findAll({
  where: { age: { [Sequelize.Op.gt]: 18 } }
});

// Найти первого пользователя с именем 'John'
const user = await User.findOne({
  where: { name: 'John' }
});

// Найти продукт по первичному ключу (id)
const product = await Product.findByPk(1);

// Создать нового пользователя
const newUser = await User.create({ name: 'Jane', age: 25 });

// Обновить email пользователя с id = 1
await User.update({ email: 'newemail@example.com' }, {
  where: { id: 1 }
});

// Удалить пользователя с id = 1
await User.destroy({
  where: { id: 1 }
});

// Массовое создание продуктов
await Product.bulkCreate([
  { name: 'Product 1', price: 100 },
  { name: 'Product 2', price: 150 }
]);

// Подсчитать количество продуктов ценой больше $50
const count = await Product.count({
  where: { price: { [Sequelize.Op.gt]: 50 } }
});

// Увеличить баланс пользователя на $50
await User.increment('balance', { by: 50, where: { id: 1 } });

// Уменьшить баланс пользователя на $30
await User.decrement('balance', { by: 30, where: { id: 1 } });

// Синхронизировать модель User с базой данных, создавая таблицу если её нет
await User.sync();

// Выполнить транзакцию для создания заказа и обновления баланса пользователя
await sequelize.transaction(async (t) => {
  const order = await Order.create({ userId: 1, total: 100 }, { transaction: t });
  await User.decrement('balance', { by: 100, where: { id: 1 }, transaction: t });
});

// belongsTo много к одному
Order.belongsTo(User, { foreignKey: 'userId' });

// hasMany один ко многим
User.hasMany(Order, { foreignKey: 'userId' });

// Найти и подсчитать все продукты на странице с пагинацией
const { count, rows } = await Product.findAndCountAll({
  where: { price: { [Sequelize.Op.lte]: 200 } },
  offset: 10,
  limit: 5
});

```

<style>
  body { background-color: #000; }
</style>