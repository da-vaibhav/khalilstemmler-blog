---
templateKey: article
title: 'Name, Construct & Structure | Organizing Readable Code - Part 1'
date: '2019-06-15T10:04:10-05:00'
updated: '2019-06-15T10:04:10-05:00'
description: >-
  Naming files & folders well, using well-understood technical constructs and strategically organizing files well are three ways to improve our ability to change code quickly. 
tags:
  - TypeScript
  - JavaScript
category: Software Design
image: /img/blog/name-construct-structure/banner.png
published: false
anchormessage: This article is from "Name, Construct & Structure". <a href="https://solidbook.io">Get it while it's free</a>.
---

_This article is part of a 32-page ebook titled "Name, Construct & Structure". It, as well as the [SOLID Book](https://solidbook.io) are available free for a limited time before it becomes available only on Gumroad. Grab it [here]._

---

Have you ever come back to an old codebase feeling completely daunted by having to re-learn everything?

Have you ever entered into a sizable codebase and felt like none of the files or folders gave you any hints as to what the contents were?

Have you felt like it was way too hard to understand <u>w​hat things are</u>,​ ​<u>what they do</u>,​ and <u>w​here they’re located?</u>​

Similarly to how UX designers spend time understanding how users use their products and come up with ways to reduce friction, there's a _similar art_ to structuring codebases.

After spending some time really thinking about structuring projects, learning [Domain-Driven Design](/articles/domain-driven-design-intro/), Design Patterns, and reading Uncle Bob's "Clean Architecture", I think I've found a good **pattern for structuring large codebases and naming files & folders** that works really well for myself and my team.

It comes down to three things.

> Name, construct & structure.

In this article, we'll talk about `Name`.

## <a  class="anchor" name="Name"></a>Name

!["Name"](/img/blog/name-construct-structure/name.png)

> “There are only two hard things in Computer Science: cache invalidation and naming things”. -- Phil Karlton

Choosing names for **c​lasses**,​ **​files**, ​and f​olders​ can be incredibly hard sometimes. However, it’s kind of important to put some effort into it.

It’s important because the goal of naming things is to inform the reader _as quickly as possible_ about <u>what something is</u>​​.

How do we do that? How do we name things so that it quickly informs the reader **what it is​**?

## <a  class="anchor" name="Picking-good-names"></a>Tips for picking good names

Here are a few of the approaches that I use for most cases. Having these in my back pocket enables me to usually never spend more than a couple of seconds thinking about a name.

### Approach #1: Name files by Domain + Construct

When naming f​iles, ​I’ll often choose names based on the **s​ubdomain it belongs to** ​+ **the c​onstruct type**.

You might be wondering, “what’s a domain”?

!["Domain definition"](/img/blog/name-construct-structure/domain-definition.png)

Secondly, we should understand what _c​onstructs_ a​re.

!["Construct definition"](/img/blog/name-construct-structure/construct-definition.png)

Since we understand what _s​ubdomains_ a​nd _c​onstructs_​ are now, we could use them to assemble names for our files by appending the c​onstruct​ type to the s​ubdomain (or element from the subdomain - see below).

!["Choosing names"](/img/blog/name-construct-structure/choosing-names.svg)

Let’s see what some of that might look like in principle.

!["Choosing names"](/img/blog/name-construct-structure/screenshot-1.png)

It’s a good start, but there’s a problem. **W​e’re not organizing our subdomains properly**​.

Things from the `J​ob` ​​subdomain are mixed up with the `U​sers` ​​subdomain. That’s definitely giving me _clutter-y_ feels.

It’s time to think about naming folders.

## Approach #2: Name folders by Subdomain, and (optionally) Subdomain + Construct

Naming folders by the name of the **subdomain** ​is a great way to segment code so that you can focus on one particular part of your project at a time.

Here’s a start.

!["subdomain organized code"](/img/blog/name-construct-structure/screenshot-2.png)

That’s better, but you might still feel a little bit discombobulated looking at this many files at one time. I like to take the next step of also creating sub-folders and naming them by the **c​onstruct type**.​

!["organize by construct  type"](/img/blog/name-construct-structure/screenshot-3.png)

I like this a lot. We talk about it more in **P​art 3: Structure**, ​but this is called “Packaging by Component”.

## <a  class="anchor" name="Constructs-for-everything"></a>There’s a construct for everything

If we can’t decide on a good name for a file, it might be because _w​e don’t know_​ what type of construct the class in our file actually is.

So beware of naming things “etc-manager” and “etc-implementor”, because when we start to do that, files become harder to understand what they’re [s​ingularly responsible](/articles/solid-principles/single-responsibility/) for ​at first glance.

If you’re finding that you’re often not sure what type of construct to use, my suggestion is the following:

## <a  class="anchor" name="Design-Patterns"></a>Learn Design Patterns

Design patterns tend to be pretty narrowly scoped solutions to common problems in software.

Because of that, they communicate well with other developers that are familiar with them.

For example, when I started getting into D​omain-Driven Design​​ and realized that I needed to convert a `J​ob`​ model to different formats (to a Domain entity, to an ORM representation, to a DTO, etc), I went looking for a pattern. I discovered that the pattern was the _D​ata Mapper_ pattern​.

From then on, anytime I realize I need to do this particular behavior, I name it an “​`[EntityName from Domain]Mapper`​”.

So dig around a little bit! That’s the best way to learn design patterns. By actually having problems that need to get solved, to looking for the correct tool for the job, to implementing it, you’ll find that you retain that information much deeper rather simply going through the entire catalog of design patterns.

That being said, the best resources for to sift through are these books:

- Martin Fowler’s book called Patterns of Enterprise Application Architecture
- GoF: Design Patterns Book
- PoSA: Pattern Oriented Software Architecture Book

---

Also, if you want to learn how to write cleaner code overall, check out “Clean Code” by Robert C. Martin (Uncle Bob). It’s a great read.

## Bad names
If you want to see an entire list of ways to d​o evil and keep your job forever, ​check out this repo: h​ttps://github.com/Droogans/unmaintainable-code.




## Look out for too many helper/utility/service classes

It’s easy to call just about everything a “helper”, “utility” or “service”. 

Understanding if something should be a h​elper​ comes from having knowledge about the domain.

I’ve talked about this topic quite a bit [h​ere](/articles/solid-principles/single-responsibility/) ​and [h​ere (anemic domain models)](/wiki/anemic-domain-model/).​

---

In the next sections, we'll talk about how <u>understanding what construct to use</u> in addition to <u>which domain it belongs to</u> enables us to organize **clear architectural boundaries**. 

### Want the book?

This article is part of a 32-page ebook titled "**Name, Construct & Structure**". It, as well as the **[SOLID Book](https://solidbook.io)** are available free for a limited time before it becomes available only on Gumroad.

Want it? [Get the free 32-page PDF](/resources/names-construct-structure) 🙂.

