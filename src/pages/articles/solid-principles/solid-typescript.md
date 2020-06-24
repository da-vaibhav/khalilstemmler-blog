---
templateKey: article
title: "SOLID Principles: The Software Developer's Framework to Robust & Maintainable Code [with Examples]"
date: '2019-05-18T10:04:10-05:00'
updated: '2019-07-16T10:04:10-05:00'
description: >-
  The SOLID principles are a set of software design principles that teach us how we can structure our functions and classes to be as robust, maintainable and flexible as possible.
tags:
  - SOLID
  - Software Design
  - Enterprise software
category: Software Design
image: /img/blog/solid/solid.png
published: true
anchormessage: This article is part of Solid Book - The Software Design & Architecture Handbook. <a href="https://solidbook.io">Get the book</a>.
tableOfContents: 
- id: S-Single-Responsibilty-Principle
  name: Single Responsibility Principle
- id: Open-Closed-Principle
  name: Open-Closed Principle
- id: Liskov-Substition-Principle
  name: Liskov Substitution Principle
- id: Interface-Segregation-Principle
  name: Interface Segregation Principle
- id: Dependency-Inversion-Principle
  name: Dependency Inversion Principle
---

<div class="solid-book-cta course-cta">
  <div class="solid-book-logo-container">
    <img src="/img/resources/solid-book/book-logo.png"/>
  </div>
  <p>This article is part of Solid Book - The Software Design & Architecture Handbook w/ TypeScript + Node.js. <a href="https://solidbook.io">Check it out</a> if you like this post.</p>
</div>

Writing code can be like pouring concrete.

If what you've written in the past doesn't suit your needs today, it can be expensive to change.

And change is inevitable. 

So if we're writing code, we need to write code that can be changed.

That's a lot harder than it sounds.

--- 

My initial approach to writing code was that *"if I get enough time to do it, I can hack it together and make it work"*.

I realized that making things work the first time was **easy**. It's just _brute force_, really. 

But adding features to existing code? Making it work the second time, the third time and the **fourth time**? Multiple iterations on something can be hard to do without introducing bugs.

I should have changed it to *"if I get enough time to do it, I can hack it together and make anything work [once]"*.

In 180k-line JavaScript projects, I found it hard to iterate fast. Iterations and incremental improvements are what agile is all about. 

Eventually, I got tired of pushing out bugs to users and getting stuck in messes that I made myself. I realized something needed to change. 

I started learning TypeScript and studying **software design**.

--- 

When we first start out coding, we often have little regard for <u>software design</u>. 

Why should we? After we achieve dexterity with a programming language, we focus our efforts on fighting undefined errors, what _this_ means and several other annoying things.

Not to mention, it's pretty challenging to enter the JavaScript world these days.

JavaScript developers have a **lot** on their plates to figure out as is (browsers, transpilation, build tools, and now TypeScript).

The **learning roadmap** for JavaScript developers can be a lot less streamlined than it  can be for Java and C# developers. 

So today, I'm here to bring awareness on the subject of <u>design</u> to JavaScript developers who won't tolerate the thought of writing another **flimsy Node.js backend**.

We've all done it, and it hurts... slowly.

> In order to go fast, we need to go well

I think the answer is Uncle Bob's **SOLID Principles**.

## What are the SOLID Principles?

The SOLID principles are a set of <u>software design principles</u> that teach us how we can structure our functions and classes in order to be as <u>robust</u>, <u>maintainable</u> and <u>flexible</u> as possible.

#### Quick history

The SOLID principles are a mnemonic acronym that were popularized by Robert C. Martin (Uncle Bob) in 2004-ish. They stand for:

1. [S: Single Responsibility Principle](#SRP)
2. [O: Open-Closed Principle](#OCP)
3. [L: Liskov-Substitution Principle](#LSP)
4. [I: Interface Segregation Principle](#ISP)
5. [D: Dependency Inversion Principle](#DIP)

### Primary benefits
If you ask me, the primary benefits of becoming well acquainted with the SOLID principles are that you'll learn how to:

- write code that's testable
- write code that's easily understood
- write code where things are where they're expected to be
- write code where classes **narrowly** do what they were intended to do
- write code that can be adjusted and extended quickly
- write code that can be adjusted and extended quickly without producing bugs
- write code that separates the _policy_ (rules) from the _details_ (implementation)
- write code that allows for implementations to be swapped out (think swapping out Email APIs, ORMs or web server frameworks)

So let's go through em!

### S: Single Responsibilty Principle

> "A class or function should only have one reason to change."

So, instead of thinking that we should split code up because it would look cleaner in a single file, we split code up based on the <u>social structure</u> of the users using it. Because that's what really dictates change.

If we had an HR department, an Accounting department and an IT department in an enterprise application that calculates pay, and reports and saves hours, we'd better make sure that we've split up (or abstracted) the _operations most likely to change_ for each <u>each department</u>.

Here's an SRP _violation_:

```typescript
class Employee {
  public calculatePay (): number {
    // implement algorithm for hr, accounting and it
  }
  public reportHours (): number {
    // implement algorithm for hr, accounting and it
  }

  public save (): Promise<any> {
    // implement algorithm for hr, accounting and it
  }
}
```

This is bad, very bad. The algorithm for each department is located in the **same class**. If one department were to request a 
change to one of their respective algorithms, it has the increased potential to ripple into another department's algorithm.

_Making this work_ would require some nasty `if` or `switch` statements.

_Design Tip: If we see lots of code in switch statements, that should be a signal to us of a potential refactoring from a `switch` statement to several classes_.

```typescript
abstract class Employee {
  // This needs to be implemented
  abstract calculatePay (): number;
  // This needs to be implemented
  abstract reportHours (): number;
  // let's assume THIS is going to be the 
  // same algorithm for each employee- it can
  // be shared here.
  protected save (): Promise<any> {
    // common save algorithm
  }
}

class HR extends Employee {
  calculatePay (): number {
    // implement own algorithm
  }
  reportHours (): number {
    // implement own algorithm
  }
}

class Accounting extends Employee {
  calculatePay (): number {
    // implement own algorithm
  }
  reportHours (): number {
    // implement own algorithm
  }

}

class IT extends Employee {
  ...
}
```

Much better. Each employee in this social structure has a single place where we can go to in order adjust their respective algorithm that is most likely to change.

The key thing is to separate responsibility based on the **social structure** of the users using the application.

### Open-Closed Principle

Intially written about by Bertrand Meyer in the 1980s, Uncle Bob calls this the "most important principle of object-oriented design".

> "A software artifact should be open for extension but closed for modification.”

Generally, this principle is all about writing your code in such a way so that when you need to add new functionality, it shouldn't require changing the existing code. 

That's what we strive for in software architecture 😤. Being able to design your software so that the minimum amount of code needs to change in order to take it from point A to point B.

To do this, we **write interfaces and abstract classes** in order to dictate the **higher-level policy** that needs to be implemented, and then we **implement that policy** using [concrete classes](/wiki/concrete-class/).

#### Email service example

Let's say that our boss told us that he wanted us to use SendGrid for sending emails.

So we went and coded out a [concrete](/wiki/concrete-class/) `SendGridService` class, connecting to the Sendgrid API.

```javascript
class SendGridService {
  constructor (sendgridInstance) {
    this.sg = sendgridInstance;
  }

  sendMail (from, to, body) {
    // format the mail object to the sendgrid api shape
    // send it
    // create a result object 
    // return the result (success, failure, bounded, etc)
  }
}
```

3 months later he tells us that he wants us to use MailChimp instead because SendGrid is too expensive.

So we go and code a [concrete](/wiki/concrete-class/) `MailChimpService`. But in order to hook it up, we're going to have to <u>change and potentially break</u> a lot of code. 

How could we have designed that better?

Following OCP, we could define an `interface` that specifies **what** a mail service _can do_, and leave the actual implementation to be figured out separately. 

![](/img/blog/solid/ocp-2.png)

The main idea is to <u>keep the policy separate from the detail</u> in order to enable loose coupling.

> Higher level-components are protected from changes to lower level components.

This goes hand-in-hand with the **[Dependency Inversion Principle](#DIP)** of depending on an interface instead of [concretions](/wiki/concrete-class/), and closely with **[Liskov Substitution Principle](#LSP)** in terms of being able to _swap out_ implementations as long as the same _type_/_interface_ is being depended on.

#### From an architectural standpoint

This principle still makes a lot of sense when we think about the larger picture of software architecture.

Imagine that this is some generic app where there's a controller that handles requests, passes it off to **Use Case** (something that actually executes the business logic) and then maps the response into two different views for a Web App and a Mobile App.

![](/img/blog/solid/ocp.png)

What's the **higher-level component**?

It's the Use Case!

![](/img/blog/solid/ocp-1.png)

If the Use Case were to change, it would likely affect the **database**, the **controller** and the **data mappers** which create **views** passed to web and mobile.

But if the Web or Mobile View were to change, it's a lot less likely that that requirement will translate into something that affects the Use Case because the Use Case contains the <u>business logic and the entities</u>.

Again,

> Higher level-components are protected from changes to lower level components.

### Liskov-Substition Principle

Introduced by Barbara Liskov in the 1980s, she said:

> Let Φ(x) be a property provable about objects x of type T. Then Φ(y) should be true for objects y of type S where S is a subtype of T.

Admittedly, that's pretty confusing.

The easiest way to explain it is that we should be able to swap one implementation for another.

In Uncle Bob's "Clean Architecture", he says:

> "To build software systems from interchangeable parts, those parts must adhere to a contract that allows those parts to be substituted one for another."

He's talking about using **interfaces** and **abstract classes**.

I think the **Mail** example we gave a moment ago is the best way to think about this.

Since we've defined an `IMailService` interface:

```typescript
type TransmissionResult = 'Success' | 'Failure' | 'Bounced'

interface IEmailTransmissionResult {
  result: TransmissionResult;
  message?: string;
}

interface IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult>
}
```

We can implement various email services, as long as they implement the `IMailService` interface and the required `sendMail(email: Mail)` method.

```typescript
class SendGridEmailService implements IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
    // algorithm
  }
}

class MailChimpEmailService implements IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
    // algorithm
  }
}

class MailGunEmailService implements IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
    // algorithm
  }
}
...
```

And then we can *"Dependency Inject"* it into our classes, making sure we refer to the **interface** it belongs to rather than one of the concrete implementations.

```typescript
class CreateUserController extends BaseController {
  private emailService: IEmailService;
  constructor (emailService: IEmailService) { // like this 😇
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    // handle request
    
    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

Now, all of these are valid.

```typescript
const mailGunService = new MailGunEmailService();
const mailchimpService = new MailChimpEmailService();
const sendgridService = new SendGridEmailService();

// any of these are valid 
const createUserController = new CreateUserController(mailGunService);
// or
const createUserController = new CreateUserController(mailchimpService);
// or
const createUserController = new CreateUserController(sendgridService);
```

Because we can interchange which implementation of an `IEmailService` we pass in, we're adhering to LSP.

---

### Interface Segregation Principle

> Prevent classes from relying on things that they dont need

In order to prevent this, we should make sure to really <u>split up</u> the unique functionality into interfaces.

Ie: we "segregate the interfaces".

And we _should_  be depending only on interfaces or abstract classes as per the **the [Dependency Inversion Principle](#DIP)**.

Here's a famous example.

#### The 3 user operations example
Let's say we have 3 different `User` classes, that use 3 different methods on the same `Operations` class, and for each `User` class, we're depending on 2 additional operations that we don't need.

![](/img/blog/solid/isp.svg)

For this, it might not seem like a big deal. But it could be a big deal if the constructor for the `Operations` class required us to inject all different kinds of dependencies in order to satisfy the other 2 operations that we didn't need.

```typescript
class Operations implements U1Ops, U2Ops, U3Ops {
  constructor (
    userRepo: IUserRepo, 
    emailService: IEmailService, 
    authService: IAuthService,
    redisService: IRedisService,
    ... // and more
  )

  ...
}
```

That's when it's really a blaring no-no.

This does occasionally end up with **services** in [CRUD-first design](/articles/typescript-domain-driven-design/ddd-vs-crud-design/), but to fix it, we can start by making sure that we rely on _abstractions_ to the things that we need.

Like this...

![](/img/blog/solid/isp-2.svg)

And then, if it were cumbersome to create the `Operations` class because it depended on so many things, taking `User1` for example, we would be able to create a class that ONLY implements `U1Ops`.

```typescript
class User1Operations implements U1Ops {
  constructor (userRepo: IUserRepo) {
    ...
  }
  ...
}
```

Now `User1` only needs `User1Operations` and not all the other junk from `Operations`.

### Dependency Inversion Principle

> Abstractions should not depend on details. Details should depend on abstractions.

What's an abstraction again? An interface or abstract class.

What's a detail again? A [concrete class](/wiki/concrete-class/).

Abstractions should never depend on details. Ok, so that means, try not to do this:

```typescript
interface IMailService {
  // refering to concrete "PrettyEmail" and "ShortEmailTransmissionResult" from an abstraction
  sendMail(email: PrettyEmail): Promise<ShortEmailTransmissionResult>
}
```

But instead, do this.

```typescript
class SendGridEmailService implements IMailService {
  // concrete class relies on abstractions
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
  }
}
```

You can normally tell when I'm using an `interface` (at least in my code) from the Microsoft code style, which recommends that we prefix interfaces with an "I". 

And this is already what you've beeing seeing throughout this article so far! We've been referring to abstractions (interfaces and abstract classes) instead of concrete ones. 

#### Main components / detail components

We can't _never_ reference concrete classes. That's how we actually hook things up to get stuff to happen. 

Like [hooking up an express.js router](/articles/enterprise-typescript-nodejs/clean-consistent-expressjs-controllers/).

```typescript
// user/http/router/index.js
import * as express from 'express'
import { Router } from 'express'
import { CreateUserController } from '../controllers'
import { MailGunEmailService } from '../services'

const mailGunService = new MailGunEmailService();
const createUserController = new CreateUserController(mailGunService);

const userRouter = Router();

userRouter.post('/new', (req, res) => createUserController.exec(req, res))

export {
  userRouter
}
```

We need to reference those concrete `CreateUserController` and `MailGunEmailService` classes in order to hook them up.

But we _only_ do this to hook them up. Uncle Bob calls these **Main components**. They're messy but they're necessary.

**However**, we shouldn't refer to concrete classes from another concrete class _directly_.

This is what gives us the ability to **test code**, because we leave the power to the implementor to pass in a **mocked dependency** if we don't want to make API calls or rely on something we're not currently interested in testing.

Therefore, do this.

```typescript
class CreateUserController extends BaseController {
  private emailService: IEmailService; // <- abstraction
  constructor (emailService: IEmailService) { // <- abstraction
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    // handle request
    
    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

Not this.

```typescript
class CreateUserController extends BaseController {
  // we're limiting ourselves to a particlar concrete class.
  private emailService: SendGridService; // <- concretion
  constructor (emailService: SendGridService) { // <- concretion
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    // handle request
    
    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

And _definitely_ not this.

```typescript
import { SendGridService } from '../../services'; // <- source code dependency

class CreateUserController extends BaseController {
  // impossible to mock for tests
  private emailService: SendGridService = new SendGridService(); // <- concretion
  constructor () {
  }

  protected executeImpl (): void {
    // handle request
    
    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

#### Dependency Injection Frameworks

If hooking up dependencies to classes like this gets out of hand where there are _potentially hundreds of dependencies_, we can look to a **Dependency Injection Framework** to help resolve dependencies auto-magically.

Although I haven't tried it, [Inversify](http://inversify.io/) seems to be the most popular one at the moment.

#### More on Dependency Inversion

If you're interested in a deeper dive, check out the [wiki page](/wiki/dependency-inversion/) on this principle.

## Conclusion

We just went through all of the SOLID principles. 

If you're using TypeScript, for you to really get the most out of your object-oriented software design efforts, I recommend re-reading this article a few times and referring back to it as you write TypeScript code, asking yourself "is this SOLID"?

And if you're interested in having something you can download, I'm putting together an [ebook](https://solidbook.io) (that's <u>free before its release</u>) on applying the SOLID principles in Node.js and TypeScript. 

Definitely grab that if you're interested in having something you can print out.

### SOLID JavaScript?

**Wow, we really talked a lot about interfaces, didn't we?**

And you know what the sad part is?

> Interfaces don't exist in JavaScript 😔

Which makes all of this a _whole lot harder_ to adhere to. 

That doesn't mean it's impossible to write SOLID JavaScript, it means that it will take a considerably increased amount of both discipline and attention to detail on our side. That's largely because we don't have the compiler on our side.

### Too SOLID?

There's definitely a thing as _too SOLID_. Writing clean code like this does increase the amount of files you introduce because you're writing abstractions for your concretions. 

If you're confident you'll never need to abstract something, consider making that trade-off for something more concrete-y.

### Additional reading

- "Clean Architecture" by Uncle Bob

### Examples of SOLID code

If you're interested in seeing some SOLID code, particularly the `Email` example, check out [this repo](https://github.com/stemmlerjs/solid-email-microservice).

If you're reading this and have really good repos of SOLID TypeScript or JavaScript code that you'd like to share, reach out on Twitter and I'll include it.

--- 
