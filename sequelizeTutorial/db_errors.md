1. Ошибки валидации (SequelizeValidationError)
Эти ошибки возникают, когда входные данные не соответствуют ограничениям модели. 
Ошибки валидации часто включают:

1.1 notNull Violation: Ошибка возникает, когда обязательное поле получает null.
```javascript
User.create({ username: null })

{
  "name": "SequelizeValidationError",
  "errors": [{
    "message": "username cannot be null",
    "type": "notNull Violation",
    "path": "username",
    "value": null
  }]
}
```
1.2 string violation: Поле строкового типа получает данные, которые не 
соответствуют его валидационным правилам (например, превышение длины строки).
```javascript
User.create({ username: "a very long name that exceeds the defined limit for this field" })

{
  "name": "SequelizeValidationError",
  "errors": [{
    "message": "Value too long for username",
    "type": "string violation",
    "path": "username",
    "value": "a very long name that exceeds the defined limit for this field"
  }]
}
```
1.3 Validation error: Включает ошибки, связанные с пользовательскими валидаторами, 
например, проверка на формат электронной почты или регулярные выражения.
```javascript
User.create({ email: "not-an-email" })

{
  "name": "SequelizeValidationError",
  "errors": [{
    "message": "Invalid email format",
    "type": "Validation error",
    "path": "email",
    "value": "not-an-email"
  }]
}
```
2. Ошибки уникальности (SequelizeUniqueConstraintError)
Эти ошибки возникают, когда операция нарушает ограничение уникальности SQL. 
Например, попытка вставить дублирующееся значение в столбец, который должен быть уникальным.
```javascript
User.create({ email: "existing@email.com" })

{
  "name": "SequelizeUniqueConstraintError",
  "errors": [{
    "message": "email must be unique",
    "type": "unique violation",
    "path": "email",
    "value": "existing@email.com"
  }]
}
```
3. Ошибки исключения (SequelizeExclusionConstraintError)
Ошибка происходит, когда операция нарушает ограничение исключения в базе данных.
```javascript
Reservation.create({ roomNumber: 101, date: '2023-01-01' })

{
  "name": "SequelizeExclusionConstraintError",
  "errors": [{
    "message": "Room is already reserved for this date",
    "type": "exclusion violation",
    "path": "roomNumber",
    "value": 101
  }]
}
```
4. Ошибки базы данных (SequelizeDatabaseError)
Общая ошибка, возникающая при наличии проблем с запросом SQL, который не может быть 
выполнен базой данных по какой-либо причине, например, из-за синтаксической ошибки в SQL-запросе.
```javascript
User.create({ age: "twenty" })

{
  "name": "SequelizeDatabaseError",
  "message": "invalid input syntax for type integer: \"twenty\"",
  "sql": "INSERT INTO users (age) VALUES ('twenty');"
}
```

5. Ошибки подключения (SequelizeConnectionError)
Эти ошибки возникают при невозможности подключения к базе данных. Они могут быть вызваны 
сетевыми проблемами, неправильными учетными данными доступа или отказом службы базы данных.
```javascript
sequelize.authenticate();

{
  "name": "SequelizeConnectionError",
  "parent": {
    "error": "connect ECONNREFUSED 127.0.0.1:5432"
  },
  "message": "Connection refused"
}
```

6. Ошибки тайм-аута (SequelizeTimeoutError)
Возникают, когда запрос к базе данных не выполняется в установленное время. 
Часто связаны с перегрузкой сервера базы данных или замедлением сети.
```javascript
User.findAll()

{
  "name": "SequelizeTimeoutError",
  "message": "Timeout exceeded when trying to connect"
}
```

7. Ошибки отката транзакции (SequelizeTransactionError)
Происходят при неудачной попытке отката транзакции из-за нарушения целостности данных.
Если одна из операций нарушает ограничение целостности (например, ссылочную целостность),
это приведёт к ошибке, после которой транзакция будет откачена.
```javascript
sequelize.transaction(async (t) => {
  const user = await User.findByPk(1, { transaction: t });
  user.name = "Bob";  // Допустим, имя должно быть уникальным
  await user.save({ transaction: t });

  // Предположим, что следующая строка нарушает ограничение целостности, userId не может быть null
  const payment = await Payment.create({ userId: null, amount: 100 }, { transaction: t });
})


{
  "name": "SequelizeForeignKeyConstraintError",
  "message": "insert or update on table \"payments\" violates foreign key constraint \"payments_userId_fkey\"",
  "sql": "INSERT INTO payments (userId, amount) VALUES (NULL, 100);"
}
```
После возникновения этой ошибки, все изменения, сделанные в рамках транзакции, 
должны быть откачены. Ошибка SequelizeForeignKeyConstraintError приведёт к откату транзакции.
```javascript
{
  "name": "SequelizeTransactionError",
  "parent": {
    "name": "SequelizeForeignKeyConstraintError",
    "message": "insert or update on table \"payments\" violates foreign key constraint \"payments_userId_fkey\"",
    "sql": "INSERT INTO payments (userId, amount) VALUES (NULL, 100);"
  },
  "message": "Transaction rolled back due to a foreign key constraint error on table 'payments'"
}
```

8. Ошибки оптимистичного блокирования (SequelizeOptimisticLockError)
Эта ошибка возникает при конфликте версий записи при использовании оптимистичного блокирования для предотвращения конкурирующих изменений.
```javascript
const user = await User.findByPk(1);
user.version = 1;
await user.save();

{
  "name": "SequelizeOptimisticLockError",
  "message": "Attempting to update a stale model instance: User"
}
```
