---
name: Active Record
templateKey: wiki
published: true
wikicategory: Enterprise Application Architecture
wikitags: 
  - software design
prerequisites: null
date: '2019-05-25T00:05:26-04:00'
updated: '2019-05-25T00:11:26-04:00'
image: null
plaindescription: An `Active Record` is a model that stores an in-memory representation of a database row or document.
---

You know [Sequelize](http://docs.sequelizejs.com/), [TypeORM](https://github.com/typeorm/typeorm), and [Mongoose](https://mongoosejs.com/)? 

Those are all ORMs. When you return an instance of a row (or document), being able to make changes to the database row (that the instance references) is a popular usage of the Active Record pattern.

The Active Record pattern was initially documented by [Martin Fowler](https://en.wikipedia.org/wiki/Active_record_pattern) 

```typescript
// Updating the 'name' column of a user using Sequelize.
const user = await User.find({ where: { user_id: 1 }});

await user.update({ name: 'Don Draper' });
```

Using instances of row objects returned from the ORM technology of our choice, we can Create, Read, Update and Delete instances of pretty much anything inside of the database.

Pretty cool!
