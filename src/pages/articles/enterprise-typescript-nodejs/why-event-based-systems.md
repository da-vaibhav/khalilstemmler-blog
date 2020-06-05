---
templateKey: article
title: "Why Event-Based Systems? | Enterprise Node.js + TypeScript"
date: '2019-12-27T10:04:10-05:00'
updated: '2019-12-27T10:04:10-05:00'
description: >-
  There are so many reasons why event-based systems are the standard for large-scale enterprise applications like GitHub, Facebook, Google, etc. In this article, I list a few reasons why I believe in 'em.
tags:
  - Event-based systems
  - Architecture
  - Enterprise software
category: Enterprise Node + TypeScript
image: /img/blog/enterprise-node/enterprise-node.png
published: true
---

There are several ways to design systems. When I first starting building applications, I would start out with the database. Eventually, I realized that the view dictates the data, so I moved to starting out with the UI. Then I realized that I was failing to represent a lot of important business rules, so I began to search for something else.

Eventually I found [Domain-Driven Design](/articles/domain-driven-design-intro/) and starting building applications by first understanding the domain, then working upwards from the [domain layer](/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/).

I then realized the utility of [domain events](/articles/typescript-domain-driven-design/chain-business-logic-domain-events/) and the fact that you can illustrate an entire business's operations on a timeline with domain events.

Designing systems from domain events instead of columns in a database, endpoints on an API, or components in a view, has so many benefits.

Here are just a few.

## Communication 

Thinking in terms of domain events is the closest we can get to expressing what happens in the real world. Features can be communicated by non-technical folk as a series of domain events.

```bash
UserRegistered -> EmailVerificationSent -> EmailVerified
```

## Auditing & Reasoning

When we represent a system using events, we can reason about the way that the system changed over time since the current state is computed by applying all of the domain events that ever occurred. In some domains, this is mandatory for audits.

## Estimates 

Software can be a very creatively unbounded process. Find and count all the `views` (read models) that present data and `commands` (write models) that change the system and cause domain events, then measure their complexity.

<p class="special-quote">The views and commands that a system needs in order to be complete are called "Use Cases" and adhere to the <a href="/articles/oop-design-principles/command-query-segregation/">Command-Query Segregation</a> design principle. Read "<a href="/articles/enterprise-typescript-nodejs/application-layer-use-cases/">Better Software Design with Application Layer Use Cases | Enterprise Node.js + TypeScript</a>" to learn more about how to design with use cases.</p>

## Scalability

Sometimes, in large applications- a single transaction might need to pass through or notify several other systems. In high-traffic scenarios, instead of blocking an async call, we introduce "<a target="_blank" href="https://en.wikipedia.org/wiki/Eventual_consistency">Eventual Consistency</a>" as a way to enable systems to "catch up" eventually.

## Complexity

Business rules are often missed in [CRUD-first design](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/). In order to avoid unmaintainable `if` and `else` statements and [anemic domain models](/wiki/anemic-domain-model/), think in terms of events, the commands they sometimes invoke as side effects, and the preconditions that govern how and when they can be invoked.

---

## Conclusion

Event-based architecture seems to be the common place to go when the problem we're solving with software gets really large. 

Unfortunately, there's a bit of a learning curve.

If you're interested in learning event-based systems, here's what _I think_ the general learning path looks like:

- Get really good at one programming language to the point where it feels like breathing for you.
- Understand what an [anemic domain model](/wiki/anemic-domain-model/) looks like and if you have one.
- Learn about Event Storming and how it can help you plan a project using events.
- Learn [Domain-Driven Design concepts](/articles/domain-driven-design-intro/) like entities, value objects, aggregates, and domain events.
- Learn about CQRS and why you would want to use it in your DDD project.
- Learn about Event-Sourcing
- Build an application using DDD, CQRS, and Event-Sourcing.
