---
templateKey: article
title: "Clean Node.js Architecture | Enterprise Node.js + TypeScript"
date: '2019-06-06T10:04:10-05:00'
updated: '2019-06-06T10:04:10-05:00'
description: >-
  In this article, we'll look at the various different versions of the "clean architecture", simplify it, and understand how we can use it to write more flexible Node.js code with TypeScript.
tags:
  - Node.js
  - Architecture
  - Enterprise software
category: Enterprise Node + TypeScript
image: /img/blog/enterprise-node/enterprise-node.png
published: true
---

Have you ever heard of the "clean architecture"? 

Maybe you've heard it by a different name...

[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), the [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/), [Ports & Adapters](http://www.dossier-andreas.net/software_architecture/ports_and_adapters.html), [Hexagonal Architecture](http://alistair.cockburn.us/Hexagonal+architecture), the Layered Architecture, DCI (Data, Context and Interaction), etc.

They're all a little bit different in implementation, but for our understanding: they all mean the same thing.

> Separation of concerns at the architectural level

I first discovered the term when I read "[Clean Architecture](https://www.amazon.ca/gp/product/0134494164/ref=as_li_tl?ie=UTF8&tag=stemmlerjs09-20&camp=15121&creative=330641&linkCode=as2&creativeASIN=0134494164&linkId=32995f69d0747d8723d42ffdda296878)" by Robert C. Martin (Uncle Bob) (which, despite some negative reviews is actually an incredible read and I highly recommend you check it out).

After reading his book and spending some time [learning the SOLID principles](/articles/solid-principles/solid-typescript/), not only did I enjoy the fact that the flexibilty and testability of my code improved, but I became _way more confident_ tackling <u>complex software development problems</u> with TypeScript and Node.js.

In this article, I'll cover:

<ul class="aside">
  <li>How the clean architecture separates the concerns of your code</li>
  <li>How it enables you to write testable code</li>
  <li>How it also enables you to write flexible code</li>
</ul>

## Understanding the Clean Architecture

### Policy vs. Detail

When we're writing code, at any given time, we're either writing **Policy** or **Detail**.

![](/img/blog/clean-architecture/policy-vs-detail.svg)

**Policy** is when we're specifying what should happen, and _when_. 

**Policy** is mostly concerned with the business-logic, rules and abstractions that exist in the domain that we're coding in.

**Detail** is when we specify _how_ the **policy** happens.

**Details** actually enforce the policy. **Details** are implementations of the policy.

An easy way to figure out if the code you're writing is _detail_ or _policy_ is to ask yourself:

- does this code enforce a rule about how something should work in my domain?
- or does this code simply _make something work_

For that reason: frameworks (like [Nest.js](https://nestjs.com/) and [Express.js](https://expressjs.com/)), npm libraries (like [lodash](https://lodash.com), [RxJs](https://rxjs-dev.firebaseapp.com/) or [Redux](https://redux.js.org/)) <u>are details</u>.

Again,

> The ultimate goal of the Clean Architecture is to separate Policy vs. Detail at the architectural level.

So let's see what that looks like:

### Layered Architecture

![](/img/blog/clean-architecture/group.svg)

_Those small half-circles are meant to signify writing interfaces (at the policy level) to be implemented by the detail level_.

This diagram is a sort of simplification of all of the other diagrams I found. There's more than just these two layers (read "[Organizing App Logic with the Clean Architecture](/articles/software-design-architecture/organizing-app-logic/)" for a more detailed depiction). But for our understanding of the concept, its much easier to think about a clean architecture like this.

<u>So what does this mean?</u>

In one layer (domain) we have all of the important stuff: the _entities_, _business logic_, _rules_ and _events_. This is the <u>irreplaceable</u> stuff in our software that we can't just swap out for another library or framework.

The other layer (infra) contains everything that actually _spins up_ the code in the domain layer to execute.

You'll recall that this is [the biggest challenge in MVC](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/), figuring out what the "M" should do and how it does it. Well, this is it. The "M" = that Domain Layer.

Here's an illustration how a RESTful HTTP call might cause code to be executed across our entire architecture. 

![](/img/blog/clean-architecture/execution-cycle.svg)

There's a pattern here with respect to the <u>direction of dependencies</u>.

### The Dependency Rule

In Uncle Bob's book, he describes **the dependency rule**.

That rule specifies that something declared in an outer circle <u>must not be mentioned in the code by an inner circle</u>.

_In other diagrams, there are many more layers. The rule still applies._

That means that code can only point inwards.

Domain Layer code can't depend on Infrastructure Layer code.

But Infrastructure Layer Code _can depend_ on Domain Layer code (because it goes inwards).

When we follow this rule, we're essentially following the [Dependency Inversion](dependency-inversion/) rule from the [SOLID Principles](/articles/solid-principles/solid-typescript/).
---  

### Ports and Adapters way of thinking about Clean Architecture

The **ports and adapters** approach to thinking about this is that the _interfaces_ and _abstract classes_ are the **Ports** and the [concrete classes](/wiki/concrete-class/) (ie: the implementations) are the **adapters**.

Let's visualize it.

Let's say I was to design an `IEmailService` interface. It specifies all of the things that an _Email Service_ can do. But it doesn't actually implement any of those things specifically.

```typescript
export interface IEmailService {
  sendMail(mail: IMail): Promise<IMailTransmissionResult>; 
}
```

Here's my little **Port**.

![](/img/blog/clean-architecture/email-service-1.svg)

And let's say I'm just wiring up some code that relies on an `IEmailService`.

```typescript
class EmailNotificationsService implements IHandle<AccountVerifiedEvent> {
  private emailService: IEmailService;
  constructor (emailService: IEmailService) {
    DomainEvents.register(this.onAccountVerifiedEvent, AccountVerifiedEvent.name)
  }

  private onAccountVerifiedEvent (event: AccountVerifiedEvent): void {
    emailService.sendMail({
      to: event.user.email,
      from: 'me@khalilstemmler.com',
      message: "You're in, my dude"
    })
  }
}
```

Because I'm referring to **policy**, all that's left to do is to create the **implementation** (the details).

```typescript
// We can define several valid implementations.
// This infra-layer code relies on the Domain layer email service.
class MailchimpEmailService implements IEmailService {
  sendMail(mail: IMail): Promise<IMailTransmissionResult> {
    // alg
  }
}

class SendGridEmailService implements IEmailService {
  sendMail(mail: IMail): Promise<IMailTransmissionResult> {
    // alg
  }
}

class MailgunEmailService implements IEmailService {
  sendMail(mail: IMail): Promise<IMailTransmissionResult> {
    // alg
  }
}
```

![](/img/blog/clean-architecture/email-service-2.svg)

When I go to hook this thing up, I have several options available now.

```typescript
// index.js
import { EmailNotificationsService } from './services/EmailNotificationsService'
import { MailchimpEmailService } from './infra/services/MailchimpEmailService'
import { SendGridEmailService } from './infra/services/SendGridEmailService'
import { MailgunEmailService } from './infra/services/MailgunEmailService'

const mailChimpService = new MailchimpEmailService();
const sendGridService = new SendGridEmailService();
const mailgunService = new MailgunEmailService();

// I can pass in any of these since they are all valid IEmailServices
new EmailNotificationsService(mailChimpService) 
```

Look! The port fits the adapter ❤️.

![](/img/blog/clean-architecture/email-service-3.svg)

--- 

<a href="https://solidbook.io">
  <img src="/img/resources/solid-book/book-banner.png"/>
</a>

Hopefully we're starting to see how this can make our code more  **testable** and **flexible**.


## Code is testable

If you follow the dependency rule, domain layer code has 0 dependencies.

You know what that means? 

> We can actually test it

Next time you're writing code, think about it like this...

Before you get too far along working on some classes, ask yourself: "can I _mock_ what I just wrote?"

If you were following [SOLID](/articles/solid-principles/solid-typescript/) and referring to **interfaces** or **abstract classes**, the answer will be _yes_.

If you've been referring to concretions, it'll be considerably more challenging to write tests for it. This is caused by [coupling](/wiki/dependency-inversion/).

## Code is flexible

When we've separated the concerns between Policy and Detail, we create an explicit relationship that we know how to deal with.

If we change the policy, we _might_ end up affecting the detail (since detail depends on policy).

But if we change the detail, it should <u>never affect the policy</u> because policy doesn't depend on detail.

This separation of concerns, combined with adhering to the [SOLID](/articles/solid-principles/solid-typescript/) principles makes changing code a lot easier.

### Tests?

The only way we can be certain about changing code is to have written tests for it. 

Domain code is incredibly easy to test (since it has 0 dependencies) and refers to abstractions. We can really easily create mocks for things by implementing the interface with our mock classes.

Infrastructure layer code is a little bit more challenging (and slower) to test because it has dependencies (web servers, caches, key-value object stores like Redis, etc).

## Too clean?

The more complex the software you're building, and the more robust it needs to be, the <u>more you need to build into it, the mechanisms for flexibility</u>.

For example: if you're writing a quick Node.js script to scrape a particular web page periodically so that you can automate something, **don't spend _too much time_ trying to make your code SOLID**.

But, if you're building a web scraper that needs to _know how to scrape all of the 100 most popular job boards in the world_, then you might want to consider coding it for flexibility. 

```typescript
// Define the abstraction to implement the algorithms
abstract class BaseScraper {
  constructor () {
    this.puppeteer = new Puppeteer();
  }
  abstract getNumberPages (): Promise<number>;
  abstract getJobTitle (): Promise<HTML>;
  abstract getJobDescription(): Promise<HTML>;
  abstract getJobPaymentDetails(): Promise<HMTL>;
}

// Implement the algorithms
class LinkedInScraper extends BaseScraper {
  constructor () {
    super();
  }

  getNumberPages (): Promise<number> {
    // implement algorithm
    this.puppeteer...
  }

  getJobTitle (): Promise<HTML> {
    // implement algorithm
  }

  getJobDescription(): Promise<HTML> {
    // implement algorithm
    
  }

  getJobPaymentDetails(): Promise<HMTL> {
    // implement algorithm
  }
}

class GlassdoorScraper extends BaseScraper {
  constructor () {
    super();
  }
  
  getNumberPages (): Promise<number> {
    // implement algorithm
    this.puppeteer...
  }

  getJobTitle (): Promise<HTML> {
    // implement algorithm
  }

  getJobDescription(): Promise<HTML> {
    // implement algorithm
    
  }

  getJobPaymentDetails(): Promise<HMTL> {
    // implement algorithm
  }
}

```


