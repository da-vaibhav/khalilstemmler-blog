---
templateKey: article
title: "Organizing App Logic with the Clean Architecture [with Examples]"
date: '2019-09-16T10:04:10-05:00'
updated: '2019-09-16T10:04:10-05:00'
description: >-
  In this article, you'll learn about the Clean Architecture, why we should separate the concerns of large applications into layers, the 6 most common types of application logic, and which layer they belong to.
tags:
  - Application Logic
  - Architecture
  - Clean Architecture
category: Software Design
image: /img/blog/software-architecture-design/logic-types.png
published: true
---

<div class="solid-book-cta course-cta">
  <div class="solid-book-logo-container">
    <img src="/img/resources/solid-book/book-logo.png"/>
  </div>
  <p>This topic is taken from Solid Book - The Software Architecture & Design Handbook w/ TypeScript + Node.js. <a href="https://solidbook.io">Check it out</a> if you like this post.</p>
</div>

How many times have you been working on an application, and in the middle of writing some logic, asked yourself:

> "Is this the right place to put this logic?"

There's a lot that goes into figuring out where something belongs. 

First, you have to understand the domain that you're working in. That's how you figure out the [subdomains](/articles/domain-driven-design-intro/) in your app.

Then, for each subdomain, you have to identify all the [use cases](/articles/enterprise-typescript-nodejs/application-layer-use-cases/) and which **actors** are allowed to execute them.

This is [Conway's Law](/wiki/conways-law/) **in action**.

What I've found to be <u>the most challenging part</u>, especially for developers new to [enterprise application development](/articles/categories/enterprise-node-type-script/) that have [moved well-past simple CRUD MVC apps](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/), is implementing a **layered architecture** to separate the concerns of app development.

The challenge seems to be understanding _which layer_ exactly to place logic.

<!-- If you know what the **layers** are, and you know what each layer _is for_, then you **never have to be confused** about where logic should go, ever again. -->

In this article, we'll learn about the following:

- Clean Architecture, and why we should separate the concerns of large applications into layers.
- The 6 most common types of application logic and which layer they belong to.

## The Clean Architecture / Layered Architecture

Robert Martin wrote about _Clean Architecture_ in his book of the same name. Although a bit of a challenging read (took me 2 really good reads), it's amazing. It teaches you about how to organize and group code into components, and then how to organize an application that connects those components to things like databases, APIs, web servers and other external things that we need to power applications.

A really simplified version of what the clean architecture might look like:

![Simplified Clean Architecture](/img/blog/clean-architecture/group.svg)

### Domain Layer

In one layer (domain) we have all of the important stuff: the entities, business logic, rules and events. This is the irreplaceable stuff in our software that we can't just swap out for another library or framework. It's also the stuff that's much less likely to need to change because it represents _what our business does_. 

For example, if we're an app that sells books, we sell books. If we're an app that finds parking spots, the domain layer contains the _core logic_ to find parking spots. 

Because we're unlikely to change the core essense of what our business does, the domain layer is the most [stable layer](/wiki/stable-dependency-principle/).

The domain layer assumes a kind of **higher-level policy** that everything else relies on. 

### Infra (everything-else) layer

The other layer (infra) contains everything that actually spins up the code in the domain layer to execute.

## Clean architecture expanded

We can **generally** express the clean architecture as _domain_ and _infrastructure_. 

Stuff that's specific to our business is **domain**, and the adapter-stuff that just hooks into the technologies that enable us to run a web app (database, web servers, controllers, caches, etc) is the **infrastructure**.

But the devil is in the details.

If we wipe our glasses off, a more detailed view of the clean architecture would look like this.

![](/img/blog/software-architecture-design/app-logic-layers.svg)

--- 

For [trivially small applications](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/), this might seem like overkill. But for applications that are expected to live a long life, be maintained by larger teams, and make / save a company money, it's vital to figure out how to separate the concerns and where to put logic.

Failure to address that complexity and solve it with a better architecture can turn a project _legacy-mode_, real quick.

Without further ado, here are the 6 most common types of application logic that find their way into large applications.

## 1. Presentation Logic

> Logic that's concerned with how we present something to the user.

Most apps used by consumers have front-ends. This type of logic is entirely concerned with _how we present something to the user_.

It's the HTML, CSS and JavaScript that we write that turns a blank page into a well-designed, living, breathing front-end application.

```sass
.container
  background: white;
  color: blue;
```

### Dumb UIs should contain no business rules

There's a principle called **Dumb UI**.

The idea is to keep the UI logic divorced from any **domain-layer** logic, because the domain-layer logic acts as dependency to _everything else_ in the architecture.

The front-end is **volatile**. That means it's constantly requiring changes. Due to that, it wouldn't be a good idea to locate logic (domain logic, specifically) that was important to other components in the architecture, because that would have the potential to consistently break the app.

<p class="special-quote"><b>Stable Dependency Principle</b>: If you're interested in this phenomenon of what makes a dependency stable and what makes it unstable, check <a href="/wiki/stable-dependency-principle/">this</a> out.</p>

### Smart and dumb components

Modern front-end JavaScript frameworks like React and Angular have popularized **smart (container) components** and **dumb (functional) components**. 

There may be a good separation of concerns between those two, where **smart** components hold the state and methods that manipulate the state, leaving **dumb components** to simply project the view, but front-end is still primarily **presentation** logic and should contain little to no other types of logic (besides some validation logic).

To the backend, front-end is an **infrastructural** concern that we provide data access / adapters to through RESTful APIs and the like.

## 2. Data Access / Adapter Logic

> Logic concerned with how we enable access to infrastructure layer concern like caches, databases, front-ends, etc.

We can't get very far with just a plain ol' JavaScript/TypeScript objects that represent our domain layer.

We need to hook this thing up to the internet and enable a front-end to connect to it! Which web server do we want to use? Express.js? Hapi?

We also need to figure out how we'll persist our domain objects. Want to use a SQL database? NoSQL? 

What about caching? 

Oh, and how do make use of cool external services like Stripe for billing or Pusher for real-time chat? We need to write adapters for those so that our inner layers can use them. 

That's right. This layer is all about defining the **adapters** to the outside world. Simplify usage for the inner layers by encapsulating the complexity of [persisting an aggregate to a database](/articles/typescript-domain-driven-design/repository-dto-mapper/) by creating a **Repository** class to do that.

Here are several common things to do at this layer:

- **RESTful APIs**: Define a RESTful API with Express.js and create controllers to accept requests.
- **Production middleware**:Write Express.js controller middleware to protect your API from things like DDos and brute force login attempts.
- **Database Access**: Create repositories that contain methods that perform CRUD on a database. Use either an ORM like Sequelize and TypeORM or raw queries to do this.
- **Billing Integrations**: Create an adapter to a payment processor like Stripe or Paypal so that it can be used by inner layers.

## 3. Application Logic / Use Cases

> Logic that defines the actual features of our app

[Use cases](/articles/enterprise-typescript-nodejs/application-layer-use-cases/) are the  features of our app.

Once all the use-cases of our application have been identified and then developed, we are _objectively_ done.

<p class="special-quote"><b>Done</b>: "Done" is a word that I don't throw around often. It has different meanings to everyone. However, we can get closer to a shared understanding of <i>done</i> if we: figure out the use cases, and figure out who or what should be able to execute those use cases (actors or agents- because robots/servers are actors too). Once that happens, I'm more confident about saying we're <i>done</i>.</p>

### CQS / CQRS

Use Cases are either `COMMANDS` or `QUERIES` if we're following the [Command-Query Segregation](/articles/oop-design-principles/command-query-segregation/) principle.

### Use Cases are application specific

Your company might have several applications within it.

Take Google for example. Google has **Google Drive**, **Google Docs**, **Google Maps**, etc.

Each of these applications has their own set of use cases, like this:

**Google Drive**
  - `shareFolder(folderId: FolderId, users: UserCollection)`: Shares a folder with other users in the Google enterprise.
  - `createFolder(parentFolderId: FolderId, name: string)`: Creates a folder.
  - `createDocument(parentFolderId: FolderId)`: Creates a Google Docs document.

**Google Docs**
  - `shareDocument(users: UserCollection, visibility: VisibilityType)`: Shares a document with several users.
  - `deleteDocument(documentId: DocumentId)`: Deletes a document.

**Google Maps**
  - `getTripRoutes (start: Location, end: Location, time?: Date)`: Gets all routes for a trip.
  - `startTrip (start: Location, end: Location)`: Starts a trip now.

A more common and simple example is deploying an **Admin** panel. You might need a separate dashboard from your main app in order to do a couple of admin-y things.

<div class="solid-book-cta course-cta">
  <div class="solid-book-logo-container">
    <img src="/img/resources/solid-book/book-logo.png"/>
  </div>
  <p>I usually <u>plan and build software around use cases</u> because it makes the code a lot easier to reason about, and <u>improves how rapidly</u> you can complete projects.  <br/> <br/>I have a <a href="/resources/names-construct-structure/">free ebook</a> called "Name, Construct & Structure" where you can learn more about this approach to designing readable codebases. <br/> <br/>If you're more into the nitty-gritty of how to actually learn to code using Use-Case Driven Development, first <a href="/articles/enterprise-typescript-nodejs/application-layer-use-cases/">read this article on Use Cases</a> (it's my favourite article).  <br/> <br/>If you want more, check out my book on <a href="https://solidbook.io">software design and architecture</a> where I walk you through the process of Use-Case Driven Development.</p>
</div>

## 4. Domain Service logic

> Core business logic that doesn't quite fit within the confines of a single entity.

Now we're in the **domain layer**. And [Domain-Driven Design](/articles/domain-driven-design-intro/) is the best way to approach creating a rich domain model.

In DDD, we always try to locate domain logic closest to the [entity](/articles/typescript-domain-driven-design/entities/) it pertains to.

There comes situations where that logic spills into perhaps two or more entities, and it doesn't quite seem to make sense to locate that logic in one or the other.

We use domain services to ensure that we don't lose that **business rule** within one specific application's **use case**, but instead keep it within the domain layer so that it can be used by every application that relies on it.

## 5. Validation logic

> Logic that dictates what it means for a domain object to be valid.

Validation logic is another **domain layer** concern, not an infrastructure one.

Let's say that we wanted to create a `User` entity. And `User` contained a property called `email:string`.  

```typescript
interface UserProps {
  userEmail: string;
}
class User extends Entity<UserProps> {
  private constructor (props: UserProps, id?: UniqueEntityId) {
    super(props, id)
  }

  public static create (props: UserProps, id?: UniqueEntityId): Result<User> {
    const propsResult = Guard.againstNullOrUndefined(props.userEmail);
    if (!propsResult.succeeded) {
      return Result.fail<User>(propsResult.error);
    }

    return Result.ok<User>(new User(props, id))
  }
}
```

What's stopping someone from creating a `User` with an invalid `userEmail:string`?

```typescript
const userOrError: Result<User> = User.create({ userEmail: 'diddle' });
userOrError.isSuccess // true
```

That's what we use [Value Objects](/articles/typescript-value-object/) for. We can encapsulate the validation rule with a **Value Object** for `userEmail`.

If we change the type of `userEmail` to be strictly-typed instead of _string-ly_ typed like this:

```typescript
interface UserProps {
  userEmail: UserEmail;
}
```

And then create a `UserEmail` value object...

```typescript
import { TextUtil } from '../utils'
import { Result, Guard } from '../../core'

interface UserEmailProps {
  email: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {

  // Private constructor. No one can say "new UserEmail('diddle')"
  private constructor (props: UserEmailProps) {
    super(props);
  }

  // Factory method, can do UserEmail.create() 
  public static create (props: UserEmailProps): Result<UserEmail> {
    if (Guard.againstNullOrUndefined(props.email) || 
      !TextUtil.isValidEmail(props.email)) {
        return Result.fail<UserEmail>("Email not provided or not valid.");
    }  else {
      return Result.ok<UserEmail>(new UserEmail(props));
    }
  }
}
```

Now, there's no way to create an invalid `User`.

## 6. Core business logic / entity logic

> Logic that belongs to a single entity.

The most important is where the family jewels of the application are: the entity.

And if the entity has a reference to other related entities, the [aggregate root](/articles/typescript-domain-driven-design/aggregate-design-persistence/).

Core business logic that lives here are:

- Initial / default values
- Protecting [class invariants](/wiki/invariant/) (what changes are allowed, and _when_)
- Creating **Domain Events** for changes, creations, deletions, and anything else relevant to the business. It's through domain events that complex business logic can be chained.

## Some principles to follow

### Never over-engineer

You should know when you need to use a layered architecture. Typically, it makes most sense when your application **has a lot of business rules**. In that case, it's a good idea to implement a layered architecture in order to keep the concerns of **persistence logic** (for example), separate from **validation logic** and the **core business rules** of the Domain Layer.

---

## Conclusion

In this article, we covered the 6 main types of logic in large application development.

Here they are in summary:

- **Presentation Logic**: Logic that's concerned with how we present something to the user.
- **Data Access / Adapter Logic**: Logic concerned with how we enable access to infrastructure layer concern like caches, databases, front-ends, etc.
- **Application Logic / Use Cases**: Logic that defines the actual features of our app
- **Domain Service logic**: Core business that doesn't quite fit within the confines of a single entity.
- **Validation logic**: Logic that dictates what it means for a domain object to be valid.
- **Core business logic / entity logic**: Logic that belongs to a single entity.

