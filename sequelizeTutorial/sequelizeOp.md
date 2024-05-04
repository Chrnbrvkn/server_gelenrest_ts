
 Логические операторы Sequelize.Op

Op.and: Логическое "И" между условиями.
Op.or: Логическое "ИЛИ" между условиями.
Op.gt: Сравнение, больше чем.
Op.gte: Сравнение, больше или равно.
Op.lt: Сравнение, меньше чем.
Op.lte: Сравнение, меньше или равно.
Op.ne: Не равно.
Op.eq: Равно.
Op.not: Логическое отрицание условия.
Op.between: Значение находится между двумя данными значениями.
Op.notBetween: Значение не находится между двумя данными значениями.
Op.in: Значение находится в списке.
Op.notIn: Значение не находится в списке.
Op.like: Сравнение с шаблоном (SQL LIKE).
Op.notLike: Отсутствие совпадения с шаблоном.

```javascript
// Op.and Op.gt, Op.gte, Op.lt, Op.lte, Op.ne, Op.eq:

await User.findAll({
  where: {
    [Sequelize.Op.and]: [
      { age: { [Sequelize.Op.gt]: 18 } },
      { isActive: true }
    ]
  }
});

// Op.or:
await Product.findAll({
  where: {
    [Sequelize.Op.or]: [
      { price: { [Sequelize.Op.lt]: 100 } },
      { stock: { [Sequelize.Op.gt]: 50 } }
    ]
  }
});

// Op.not:
await User.findAll({
  where: { email: { [Sequelize.Op.not]: null } }
});

// Op.between, Op.notBetween:
await Product.findAll({
  where: { price: { [Sequelize.Op.between]: [10, 50] } }
});

// Op.in, Op.notIn:
await User.findAll({
  where: { id: { [Sequelize.Op.in]: [1, 2, 3] } }
});

// Op.like, Op.notLike:
await User.findAll({
  where: { name: { [Sequelize.Op.like]: 'Jo%' } }
});
```

<style>
  body { background-color: #000; }
</style>