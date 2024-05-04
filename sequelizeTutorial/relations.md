
Типы связей в Sequelize
---

Один-к-одному (One-to-One) Этот тип связи устанавливается, когда каждая запись в одной таблице может быть связана только с одной записью в другой таблице. Например, у каждого пользователя может быть только один паспорт.Пример кода:

```javascript
import { HasOne, ForeignKey } from 'sequelize-typescript';

@Table
export class User extends Model {
  @HasOne(() => Passport)
  declare passport: Passport;
}

@Table
export class Passport extends Model {
  @ForeignKey(() => User)
  @Column
  declare userId: number;
}
```
Users:
```javascript
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" },
  { "id": 3, "name": "Cindy" },
  { "id": 4, "name": "David" }
]
```
Passports:
```javascript
[
  { "id": 101, "userId": 1, "passportNumber": "X1234567" },
  { "id": 102, "userId": 2, "passportNumber": "Y7654321" },
  { "id": 103, "userId": 3, "passportNumber": "Z2345678" },
  { "id": 104, "userId": 4, "passportNumber": "A3456789" }
]
```


Один-ко-многим (One-to-Many)Эта связь используется, когда одна запись в одной таблице может быть связана с множеством записей в другой таблице. Например, один пользователь может иметь множество заказов.Пример кода:

```javascript
import { HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';

@Table
export class User extends Model {
  @HasMany(() => Order)
  declare orders: Order[];
}

@Table
export class Order extends Model {
  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}
```

Users:
```javascript
[
  { "id": 1, "name": "Charlie" },
  { "id": 2, "name": "Diana" },
  { "id": 3, "name": "Ethan" },
  { "id": 4, "name": "Fiona" }
]
```
Orders:
```javascript
[
  { "id": 201, "userId": 1, "orderDetail": "10 apples" },
  { "id": 202, "userId": 1, "orderDetail": "5 oranges" },
  { "id": 203, "userId": 2, "orderDetail": "3 bananas" },
  { "id": 204, "userId": 2, "orderDetail": "2 pineapples" },
  { "id": 205, "userId": 3, "orderDetail": "5 mangos" },
  { "id": 206, "userId": 4, "orderDetail": "4 kiwis" },
  { "id": 207, "userId": 4, "orderDetail": "1 melon" },
  { "id": 208, "userId": 4, "orderDetail": "6 peaches" }
]
```


Многие-ко-многим (Many-to-Many)В этом случае множество записей из одной таблицы могут быть связаны с множеством записей из другой таблицы, обычно через промежуточную таблицу. Например, студенты и курсы — студенты могут записаться на множество курсов, и каждый курс может иметь множество студентов.Пример кода:

```javascript
import { BelongsToMany } from 'sequelize-typescript';
import { Student } from './Student';
import { Course } from './Course';
import { Enrollment } from './Enrollment';

@Table
export class Student extends Model {
  @BelongsToMany(() => Course, () => Enrollment)
  declare courses: Course[];
}

@Table
export class Course extends Model {
  @BelongsToMany(() => Student, () => Enrollment)
  declare students: Student[];
}

@Table
export class Enrollment extends Model {
  @ForeignKey(() => Student)
  @Column
  declare studentId: number;

  @ForeignKey(() => Course)
  @Column
  declare courseId: number;
}
```


Students:
```javascript
[
  { "id": 1, "name": "Eva" },
  { "id": 2, "name": "Frank" },
  { "id": 3, "name": "Grace" },
  { "id": 4, "name": "Henry" }
]
```
Courses:
```javascript
[
  { "id": 301, "courseName": "Mathematics" },
  { "id": 302, "courseName": "History" },
  { "id": 303, "courseName": "Biology" },
  { "id": 304, "courseName": "Chemistry" }
]
```
Enrollments:
```javascript
[
  { "studentId": 1, "courseId": 301 },
  { "studentId": 1, "courseId": 302 },
  { "studentId": 2, "courseId": 301 },
  { "studentId": 3, "courseId": 303 },
  { "studentId": 4, "courseId": 304 },
  { "studentId": 4, "courseId": 302 },
  { "studentId": 4, "courseId": 301 },
  { "studentId": 3, "courseId": 302 },
  { "studentId": 2, "courseId": 303 }
]
```



