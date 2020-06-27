---
templateKey: article
title: "Client-Side Architecture Basics [Guide]"
date: '2020-06-24T10:04:10-05:00'
updated: '2020-06-24T10:04:10-05:00'
description: >-
  Though the tools we use to build client-side web apps have changed substantially over the years, the fundamental principles behind designing robust software have remained relatively the same. In this guide, we go back to basics and discuss a better way to think about the front-end architecture using modern tools like React, Redux, xState, and Apollo Client.
tags:
  - Architecture
  - Frontend Development
  - Model-View-Presenter
  - Observer Pattern
  - React
  - Software Design
category: Client-Side Architecture
image: /img/blog/client-side-architecture/Frame_3.24_(1).png
published: true
tableOfContents: 
- id: Why-we-need-a-client-side-architecture-standard
  name: Introduction
- id: We-need-a-shared-language-to-talk-about-client-side-architecture
  name: Shared language
- id: Client-side-needs--testability-flexibility-and-maintainability
  name: Client-side needs
- id: The-most-influential-client-side-architecture-design-principles
  name: Influential design principles
- id: Presentation-components
  name: Presentation components
- id: UI-logic
  name: UI logic
- id: Containercontroller
  name: Container/controller components
- id: Interaction-layer
  name: Interaction layer
- id: -Networking--data-fetching-infrastructure
  name: Networking & data fetching
- id: Conclusion
  name: Conclusion
  
---


When I first learned React and Redux in 2015, I made an enormous mess of the production codebase I was working on.

Back then, class-based components and Redux were the coolest kids on the block. This was my first time prepping up to work on a real-world React project, so I bought the best courses I could find on the topics and dove in.

After a couple of months, according to the React community, the way I was doing things was outdated. There were newer, cleaner, and recommended _best practices_ for me to follow.

I think it's incredible that we question the way we do things. But my vast gap in knowledge of client-side architecture left me always finding it necessary to play catch up to refactor to the _new_ approaches.  

These sentiments were also recently echoed in this painfully accurate Twitter thread from [Joel Hooks](https://twitter.com/jhooks). 

> Developers are confused about where to start and what to choose when they start learning to write high-quality React applications. They want a strong foundation of knowledge and the confidence to architect React applications at scale built to current industry standards. 

> They are frustrated that there are no widely accepted standards for building React applications consistently, coherently, and **with minimal risks to their professional reputations and livelihoods**.

> On top of that, there is a sea of choices and tradeoffs that React developers face every day. From how the project is even started, which framework to use, how to manage state, how does it get bundled, accessibility, and deployment just to get going.

> At each f🐬kin' stop, there's a new choice to make: a new chance to be wrong.

> Trying to build a solid foundation in React feels like a slot machine. — [@jhooks, June 17th, 2020](https://twitter.com/jhooks/status/1273392253646434304)

Some point later in my developer journey, I too realized this was happening. I realized I could never keep up to date with the current trends of the libraries and frameworks I was using. I also decided I didn't want those nuances to dictate my professional reputation or livelihood. It wasn't good enough for me. I needed something better.

Eventually, I sought out the originating principles— the fundamentals, to client-side architecture. I sought out to construct a standard for building client-side apps. A professional one. One based on the software design principles that have helped us design robust software for decades.

---

This guide teaches you client-side architecture fundamentals. 

It's the result of my research using [first principles](https://www.julian.com/blog/mental-model-examples) on how to **design and develop robust, flexible, testable, and maintainable client-side applications.**

During my experience working on client-side apps of varying sizes, I've realized that  **_some_ serious upfront design** on the architecture can have a significant impact on the quality of the code for the duration of its life.

From simple dashboards to multi-layered apps with rendering layers, domain logic, multiple types of users - this guide teaches you the essential design principles front-end developers inadvertently code around within their everyday programming jobs. 

**This guide proposes architectural standards for client-side web development**.

While we're primarily focused on React, because it's the most popular library with the least structure, the principles are transferrable to any configuration of view-layer library or framework. 

Programming tends to seem more like a trade than a science. Each tool, be it a state management library, API, or a transport-layer technology, is best suited to solve a particular set of problems. As a developer and a tradesperson, it's good to know how the tools in our toolbox are best used. 

> ... if all you have is a hammer, everything looks like a nail.

At the end of this guide, you'll learn a standard for web development. You'll have a clear understanding of the **[discrete layers of concerns]((view, interaction, routing, state management, networking, auth, etc))** in a client-side app: from the view layer to various forms of state management, and how to handle interaction (app) logic. 

## Prerequisites

- Familiarity with at least one front-end view layer library and state management approach.
- (optional) [Knowing When CRUD & MVC Isn't Enough | Enterprise Node.js + TypeScript](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/)
- (optional) ["A Treatise on State" by Jed Watson](https://www.youtube.com/watch?v=tBz3UmZG_bk)

## Why we need a client-side architecture standard

Allow me to paint the picture of why we need a better client-side architecture. To start, let's look at the foundation we're all currently working on top of.

### Model-View controller

You've probably heard of **[Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**, the architectural pattern that describes how to design apps involving user interfaces.

**MVC** says that we should split our application into *model*, *view*, and *controller* layers. This is so each layer can focus on their own respective responsibilities. 

- The model handles data and logic
- The view handles presentation
- and the controller turns user events into changes to the model

![img/blog/client-side-architecture/Untitled.png](/img/blog/client-side-architecture/Untitled.png)

<p class="caption">Model-view-controller architectural pattern. Used to separate the concerns between a client-side web app and backend services.</p>

Most full-stack apps are comprised of a **client-side portion,** utterly separate from **backend services**. When users ask to make a change from the UI, it makes things happen by interacting with the backend through some API: in MVC, the API is the *controller*.

This works! And we like it. At least, we *must* — it's one of the first architectural patterns we teach to new developers learning how to build full-stack apps.

### Model-View presenter

Where *Model-View-Controller* explained how to separate the concerns of a **full-stack web application**, [Model-View Presenter](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter), a derivation of MVC, told us how to separate the concerns of **the client part**.

![Model-View-Presenter](/img/blog/client-side-architecture/model-view-presenter.png)

<p class="caption">Model-View-Presenter is the architectural pattern typically used within client applications. It's a derivation of the MVC pattern.</p>

In *Model-View-Presenter*, the **view** creates user events. 

Those user events get turned into **updates** or **changes** to the model. 

When the **model** changes, the **view** is updated with the new data.

It's heartening to realize that <b>every client app uses some form of the model-view presenter pattern</b>.

<!-- TODO: Add this -->
<!-- <p class="special-quote">Additionally, astute developers might notice this is a fancy way to say <i>Observer pattern</i>. It turns out that <a href="/articles/client-side-architecture/observer-pattern/">most client apps are built around the Observer Pattern</a>. Hold some data, subscribe to it from elsewhere, then notify subscribers when it changes. Each framework/library (React, Vue, Angular) implements this pattern in a slightly different way.</p> -->

### MVC & MVP are too generic

MVC and MVP are great starters. They give you a *good enough* understanding of the communication pathways from a 5000-ft view. 

Unfortunately, they both suffer from the same problem: being *too generic*.

In both MVC and MVP, **the biggest challenge is that the `M` is responsible for way too much**. 

As a result, developers don't know *which tools* are responsible for *which tasks*.

![img/blog/client-side-architecture/Frame_42_(1).png](/img/blog/client-side-architecture/Frame_42_(1).png)

In MVC and MVP, the model is ambiguous. This makes matching the correct tool up to the task feel like a puzzle.

### Tasks of the model

In the real world, the model portion in most client-side web apps does a lot.

**State management —** Most apps need a way to fetch state, update state, and configure reactivity to when state changes, the *view* can re-render.

**Networking & data fetching —** The actual *data-fetching* concern is sometimes conflated as part of the model. The data fetching and networking aspect of an app need to know about backend services, formulate requests, handle responses, and marshall data, but it also needs to signal request *metadata* (ie: `isLoading`, `error`). What about features like optimistic updates? Is that a concern of the model? I think it is.

**Model behavior (ie: domain, app, or interaction logic) —** Deciding what happens next when a user clicks *submit*, or wants to interact with something on the page is a form of *[interaction logic](https://www.notion.so/Client-Side-Architecture-Basics-Generic-0f4a99f4f7a9445e928f67d058656a52#025b4ebebef64948a0fc5bfaa598309f)*. Sometimes there are rules we need to enforce. They can be simple — like validation before sending off an API call. They can be complicated — like deciding if a chess piece can be dropped on the selected square. 
Some call this *app logic*, which I believe to be sufficient since it describes how our app responds to user events. Alternatively, I call it *interaction logic* because it explains what happens in response to *user interaction*. 
There's one another kind of logic here, and that's *domain logic*. Domain logic doesn't normally have anything to do with the application itself. Instead, it originates from an understanding of the domain. For example, while displaying a modal *before move a chess piece* might be **application/interaction logic**, enforcing the policy that *a knight can only move in an L-shaped fashion* is a form of **domain logic**. That rule originates from understanding the domain of _chess_ where the application-specific logic holds rules about how the user interacts with the app. Usually, domain logic lives behind backend services, and if we break the rules, we can get an error back as a response. Still, sometimes we co-locate it on the client-side, especially for more complex applications.

**Authentication & authorization logic (specific type of model behavior) —** This is another specific type of model behavior, but it's common enough to mention. Most of the time, authN & authR finds itself being used from within the view layer (show *Login screen if not authenticated*). Sometimes, it manifests in the **application/interaction** layer as well, preventing access to specific operations.

### Tools used within the model

These are all common challenges to solve. In 2020, the developer toolbox for a React developer looks a little something like this:

- React hooks
- Redux
- Context API
- Apollo Client
- xState
- react-query
- and now, recoil

Each of these are capable of addressing a particular piece of the *ambiguous model* we described, but matching the correct tool to the proper concern can be tricky.

Of course, it's tricky. We don't have a standard language to describe the different concerns. Instead of thinking about the tools right away, I think we need to back up and look at the bigger picture of the problems to be solved.

## We need a shared language to talk about client-side architecture

We need a shared language to describe these architectural concepts upon which we either:

- Configure a library or a framework to solve
- Write the code ourselves for

Most React developers know the implementation-specific terminology like hooks, reducers, context, and props, but architectural concerns are sometimes misunderstood.

![img/blog/client-side-architecture/Frame_37_(1).png](/img/blog/client-side-architecture/Frame_37_(1).png)

Having a shared understanding of what constitutes **client-side architecture concerns** enables us to:

- Have better design conversations
- Communicate which concerns are addressed by which tool
- Avoid code from concerns creeping too profoundly into another

If we can, as a community, communicate a shared understanding of the concerns that make up the model (and the other parts), I think we can more easily answer questions like this: 

- Where do we put *application logic* in a React/Redux app? What about an Apollo Client one? What about a [insert new library/framework here] one?
- Should I use container components?
- Should I put my GraphQL mutations inside of my component?
- Do I need to write tests for Apollo Client? Redux?
- What kind of logic should I put in a React hook?

I've got good news for you...

## We've already solved this problem

Let's not discredit the software design and architecture research done over the last 30 years.

While the tools and approaches to web development have changed at a miraculous pace, **software design** **principles and patterns have remarkably, remained the same**.

<p class="special-quote"><b>Knowledge drain</b>: When (domain, trade, scientific) knowledge is lost or forgotten over time.</p>

Let's look at backend development. 

How did we solve the *ambiguous model* problem when building out backend services?

Initially, with MVC on the server, we thought the model could be *services*, [ORM](https://sequelize.org/)s, or even the *database* itself*.* Each of these are *part* of the model, but they're not the entire model.

According to [wikipedia](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), the **model** is supposed to represent the **data, logic, and any rules of the application**. 

When backend developers discovered that [MVC doesn't provide enough insight as to how to structure the *model* portion](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/), we used design principles to create more advanced architectures, like the [clean architecture](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/).

![img/blog/client-side-architecture/Frame_34_(1).png](/img/blog/client-side-architecture/Frame_34_(1).png)

The clean architecture sheds more light on how to structure your backend in a testable and flexible way. It also helps accommodate for more advanced applications containing business logic.

The *clean architecture* (which has many similar variants — see layered, [hexagonal architecture](https://khalilstemmler.com/articles/graphql/graphql-architectural-advantages/), or ports & adapters) provides specifics as to what the `M` in the model is. 

By splitting the model into **infrastructure,** **application,** and **domain** layers, we exercise the **separation of concerns** design principle, and we're left with a much easier to reason about architecture. 

![img/blog/client-side-architecture/Frame_43.png](/img/blog/client-side-architecture/Frame_43.png)

The middle layers (domain and application) are the purest. It's the code that *we,* the developers, **have to write from scratch**. Our since our app doesn't do much unless we can hook it up to the real-world. Using things like web servers, databases, APIs, and caches, the adapter layer provides a flexible way to integrate **those infrastructural dependencies into our app, while keeping them distanced** from our domain and app layer code. 

<p class="special-quote">To learn more about the clean architecture read <a href="/articles/software-design-architecture/organizing-app-logic/">Organizing App Logic with the Clean Architecture [with Examples]</a>.</p>

---

A layered architecture like this comes at the cost of being more *complex* than a simple single-tiered one, but let's be honest — **sometimes we have to solve some *damn* hard problems**.

A *layered* architecture has a lot of benefits:

- It makes it **extremely clear** which tools are needed at which layer of the stack.
- It keeps concerns separate and enables you to **keep your app and domain layer code unit testable.**
- It allows you to mock out expensive to test things, **and swap libraries and frameworks** (not that you do that too often — but, in case you ever needed to, you can).

That's hella cool.

Quick question.

> **Where's our *client-side* version of this?**

## Client-side needs — testability, flexibility, and maintainability

Let's back up a bit. 

Before we discuss an equivalent client-side architecture, let's talk about our needs first.

We don't want to dogmatically copy the clean architecture.

What are we *really* looking for when we talk about *architecture* on the client-side? Why does any of this matter? Why don't we just write all of our code in a single file (actually, some of us *do* write single file components)? Is architecture about *file organization*, or is it about something more?

> **It's about writing testable, flexible, and maintainable code**.

### Testability

I've noticed that an alarming amount of developers don't write tests for their front-end code. 

It could be a conscious decision of *choosing* not to write tests — which is one thing, but it could also be a lack of education for how to write code so that it can **be tested**.

I've found that depending on your testing strategy, your needs to separate concerns changes. **If you're only going to be writing integration tests, then separation of concerns matters less**. **If you're going to be writing a lot of unit tests, then mocking is going to be your saving grace, and separation of concerns is paramount**.

If you understand the app you're building and the complexity of it, you can kind-of gauge this upfront.

### <div class="expandable-section">When to write unit tests<div class="expandable-section-button" onclick="toggleExpandableSection('unit-tests')">+</div></div>

<div id="unit-tests" class="expandable-section-content">
  <p>Unit testing is the preferred approach for testing your client app if there's a <b>heavy amount of interaction/app logic</b>, like a metadata layer in a 3D rendered game, chess game logic, a boating application, or a streaming site like Twitch.</p> 

  <p>If the accuracy of the most important use cases cannot be verified by merely observing the side effects in the view, then unit tests are the way to go.</p>
</div>

### <div class="expandable-section">When to write integration tests<div class="expandable-section-button" onclick="toggleExpandableSection('integration-tests')">+</div></div>

<div id="integration-tests" class="expandable-section-content">
  <p>Kent C. Dodds recommends integration tests when 90% of your users' primary use cases can be tested against by observing changes to the view in response to user interaction. In this case, we're talking about basic CRUD apps.
  </p>

  <p>The view is an implementation detail, and it's recommended to not test against implementation details. <a href="https://testing-library.com/">Testing library</a> provides an excellent suite of tools to run integration tests on React apps through the view without focusing on implementation details.</p>

</div>
    

### Flexibility

It's not so often that we need to switch from REST to GraphQL or swap out APIs, but there are a select few cases that we should enable flexibility for.

**Swapping out view components —** Keeping app logic out of your presentational components allows you to swap out how the component looks from how it works, as painlessly as humanly possible.

**Changing model behavior —** If your app is the interaction-logic heavy kind of app that needs lots of unit tests, using [dependency inversion](https://khalilstemmler.com/articles/tutorials/dependency-injection-inversion-explained/) to mock out API and framework code enables you to run fast tests against the behavior of the model.

### Maintainability

Maintainability is our ability to constantly provide value. If we struggle to change code or add new features, maintainability is low. 

It's worthy to note that if developer experience is low, there's a *chance* maintainability is low as well.

Here's an argument to challenge everything I've praised about a *clean architecture* so far. Looking at it from another point of view, *too many layers* and *too many rules* traditionally yields low developer experience for newer developers less familiar with the approach. 

This might be why so many new developers prefer to use React over Angular. Angular is actually quite opinionated and forces you towards a particular style of architecture. React lets you do whatever.

There's a balance to be struck here. We want the structure of architecture, but we want the developer experience of knowing what to do and having the freedom to do it however we want. 

> **Design** is the balance of conflicting priorities

> Office furniture = cost vs. quality

> Note-taking = context vs. compression <br/> — Tiago Forte

And more relevant to us:

> Software design = structure vs. developer experience

I believe that developers who care not only about getting the job done but also getting it done *right* will push through learning curves.

## The most influential client-side architecture design principles

While the *clean architecture* works, we don't need a copy of it on the client-side. However, I *do* think it's a good idea to look at the same design principles and practices that formed it and apply those to the client.

You'll notice that each principle, in some way, is about enforcing some structural constraints as to what can be done, and how things are organized. 

In my opinion, these are the **most crucial** design principles. They influence 90% of what constitutes good client-side architecture. 

- Command-Query Separation
- Separation of Concerns

### Command Query Separation

> Separate methods that change state from those that don't

Command Query Separation is a design principle that states that an operation is either a `command` or a `query`.

- `commands` change state but return no data, and
- `queries` return data but don't change state.

![img/blog/client-side-architecture/Frame_44_(2).png](/img/blog/client-side-architecture/Frame_44_(2).png)

**Operations** are the same thing as *interactions*.

The primary benefit of this pattern is that it makes code **easier to reason about**. Ultimately, it urges us to carve out two code paths: one for *reads*, and one for *writes*. 

The simplest way to see it in action is at the *method-level.*

#### **Commands**

Consider the methods `createUser` and `selectTodo`. These are both `command`-like operations. 

```tsx
function createUser (props: UserDetails): Promise<void> { ... }
function selectTodo (todoId: number): void { ... }
```

Notice that neither of these methods return anything. They're both `void`. That's what a valid `command` is. 

That means that the following methods aren't valid commands.

```tsx
function createUser (): Promise<User> { ... }
function selectTodo (): Todo { ... }
```

#### **Queries**

Queries are operations that return data and perform no side-effects. Like these, for example:

```tsx
function getCurrentUser (): Promise<User> { ... }
function getUserById (userId: UserId): Promise<User> { ... } 
```

#### **Why does it matter?**

- Simplifies the code paths — this is what React hooks does with the accessor/mutator API of `useState`, and what GraphQL does with `queries` and `mutations`.
- Operations are easier to reason about — consider how hard (and disastrous) it would be to test a `query` was working properly if it always also performed a side-effect that changed the state of the system.
- All *features* can be thought about as operations: `commands` or `queries`. If you want to make sure that all your features have integration tests, ensure a good separation of `commands` and `queries` that the user performs, and test each one.
One other interesting discovery: since most **pages/routes** in your app invoke one or more *features,* a potentially maintainable folder structure could be formed by [co-locating](https://kentcdodds.com/blog/colocation) all the concerns and components by features, and then by page/route. The folks behind React Router seem to be on a similar *page* (sorry); their new project, [Remix](https://remix.run/), features file system routes and route layout nesting.
- Apparently, cache invalidation is one of the hardest problems in computer science. It's easier with this. Using CQS, we can be sure that when if no new `commands` were executed (against a particular item), we can continue to perform `queries` for directly from the cache. The moment a `command` is executed, we invalidate the item in the cache. Consider how this might be useful for a state management library.



### Separation of Concerns

> Consciously enforcing logical boundaries between each of the architectural concerns of your app

Assume we have a list of todos. 

When a user clicks *delete* on the todo, what happens next?

```tsx
export const Todo = (props) => (
  <div className="todo">
    <div class="todo-text">{props.text}</div>
    <button onClick={props.onDeleteTodo}>Delete</button>
  </div>
)
```

Well, the *view* passes off the event to a container. That could connect the user event to a method from a React Hook or a Redux thunk. From there, we might want to run some logic, decide if we should invoke a network request, update the state stored locally, then somehow notify the UI that it should update.

That's a lot. And that's a *simple* app. And when I said we might want to *run some logic* a moment ago, I wasn't clear about **exactly** what kinds of logic it could be. It could be authorization logic, validation logic, interaction/domain logic, etc. Instead of putting five different kinds of logic *wherever*, we can classify it, carve out a place for it to live, and be more structured and conscious about how we connect features together.

Separation of concerns is one of my favorite design principles. It's about thinking the jobs to be done, delegating them to a particular layer that handles those concerns, and then ensuring those layers do their jobs, and their jobs *only*.

![img/blog/client-side-architecture/Frame_46_(1).png](/img/blog/client-side-architecture/Frame_46_(1).png)

#### **How separation of concerns and CQS work together**

CQS said that every *feature* is an operation. It also said that every operation is either a `command` or `query`. 

This means that every *feature* cuts through several concerns to work. 

I like to think of features as ***vertical slices* that cut through the stack.**

#### **Features are vertical slices**

When we add or change features in an application, we're modifying a part of the vertical slice for that feature. 

![img/blog/client-side-architecture/Frame_49.png](/img/blog/client-side-architecture/Frame_49.png)

Need to change the way the login component looks? No problem, you're going to add some styles to the presentational component in the presentation layer *from the Login feature*.

Need to change what happens a when todo open for longer than 30 days was just completed? Want to throw confetti on the screen and say how proud of the user you are? Gotcha. Add some logic to the [xState model](https://xstate.js.org/docs/recipes/react.html#hooks) from the interaction layer for the *Complete Todo* feature.

![img/blog/client-side-architecture/Frame_50.png](/img/blog/client-side-architecture/Frame_50.png)

I'm a huge fan of this.

Understanding the responsibilities of each layer enables us to better reason about which tools to use **per feature**. 

Using Apollo Client, React Hooks + xState

- Application logic: Hooks + xState
- State management: Apollo Client (global state)
- Data fetching: Apollo Client

Using Apollo Client and plain JavaScript

- Interaction logic: Hooks + [pojo-observer](https://github.com/xolvio/pojo-observer)
- State Management: Apollo Client (global state)
- Data fetching: Apollo Client

Using REST, Redux, and React Hooks

- Interaction logic: Hooks
- State Management: Redux (global state). Connect for observability/reactivity, and Thunks for signaling async states.
- Data fetching: Fetch or Axios

I first heard of the term *vertical slices* from [Jimmy Bogard](https://jimmybogard.com/vertical-slice-architecture/). Thinking of features this way reduces the amount of time it takes for developers to figure out where to add or change code.

This is where developers get stuck, figuring out what the layers of the stack are, and which tools can be used at each layer of the stack.

Vertical slices enables us to keep [Single Responsibility](https://khalilstemmler.com/articles/solid-principles/single-responsibility/) high if we "minimize coupling between slices, and maximize coupling in a slice" — via [Jimmy Bogard](https://jimmybogard.com/vertical-slice-architecture/). Also read Kent C. Dodd's article on "[Co-location](https://kentcdodds.com/blog/colocation)".

#### **Why does it matter?**

- Better visibility as to which tasks need to be done, which layer they belong to, and which tools can be used to address those concerns.
- Helps to decide whether we want to implement a layer ourselves or use a framework/library. For example, most developers won't build their own view-layer library for presentational components — they'll use React or Vue. But lots of users ***will* build their own state management system from scratch** using Redux and Connect.

## Layers

We're finally ready to decompose each part of Model-View-Presenter, especially the *model* part.

Here's a graphic to illustrate that decomposition into something more concrete.

![img/blog/client-side-architecture/Client-side_architecture_basics_(5).png](/img/blog/client-side-architecture/Client-side_architecture_basics_(5).png)

Can you see both CQS and SoC in here?

Let's examine it from the top.

### Presentation components

> Render the UI and create user events

If you read the title and feel like closing the tab because of *[this article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)* by Dan Abramov, hang in there. Just wait until we get to container components to decide if you want to bounce 🏀.

Presentation components live within the boundaries of the *View* portion of Model-View-Presenter. Their entire purpose is to:

- Display data in the UI
- Generate user events (from keypresses, button clicks, hover states, etc)

#### Presentation components are an implementation detail

An implementation detail is a low-level detail that helps us accomplish our *main* goal. But they're not our *main* goal. If our *main* goal is to hook up the *Add Todo* feature, the buttons, styling, and text in the UI is an implementation detail in realizing the feature.

#### Presentation components can be volatile

Anything subject to frequent change is said to be *volatile*. Us constantly changing the look and feel of components is what makes them so. 

One way to accommodate this phenomenon is to decide on a **[stable](https://khalilstemmler.com/wiki/stable-dependency-principle/)** set of reusable components (that either you wrote or grabbed from a component library), then create your views from those.

Even though we could use reusable components, data requirements change frequently. 

Take this simple `CardDescription` component that uses a GraphQL query to describe a card.

```tsx
const CARD_DESCRIPTION_QUERY = gql`
  query CardDescription($cardId: ID!) {
    card(id: $cardId) {
      description
    }
  }
`;

const CardDescription = ({ cardId }) => {
  const { data, loading } = useQuery({ 
    query: CARD_DESCRIPTION_QUERY, 
    variables: { cardId }
  });

  if (loading) {
    return null;
  }

  return <span>{data.card.description}</span>
}
```

How likely is it that we'd need to change the styling? What about displaying something like a `lastChanged` date beside it? Chances are we pretty likely.

#### Should we include GraphQL queries in our presentation components?

It's good to have GraphQL queries **as close to the presentational component as possible**. Queries define the data requirements. And since they'll likely need to be changed together if the requirements change, having them close together reduces unnecessary cognitive load accrued by flipping back and forth between files.

One potential *downside* to putting your queries in your components is that now, if you ever wanted to switch away from GraphQL, your components aren't pure— they're coupled to GraphQL. If you wanted to switch transport-layer technologies, you'd have to refactor every component.

Another potential downside is that to test these components, you'd need to make sure they're wrapped in a [mocked Apollo Client provider](https://www.apollographql.com/docs/react/development-testing/testing/#mockedprovider).

My recommendation is to couple the queries to the components anyways. What you gain in an incredible developer experience is, in my opinion, worth the risk of going fully in with GraphQL and deciding you want to change later down the road.

**Note on query performance**: It's ok to have lots of queries for super-specific chunks of data like shown above. Using Apollo Client, Apollo handles that complicated logic of checking whether the data is cached already, and if not — it makes a request to get it.

#### What to test in presentation components

Unit testing implementation details is typically fruitless — especially for volatile things. It doesn't do us much good testing to see if a button is blue or green. Instead, when testing presentation components, we want to test against UI logic.

To demonstrate what I mean, here's a bland, basic presentation component.

<div class="filename">/components/Todo.tsx</div>

```tsx
export const Todo = (props) => (
  <div className="todo">
    <div class="todo-text">{props.text}</div>
    <button onClick={props.onDeleteTodo}>Delete</button>
  </div>
)
```

There's no UI logic involved here. It merely takes in props, hooks up callbacks, and renders some HTML.

Here's *another* example of the same component, but this time, as a class-based component with **UI logic*.***

<div class="filename">/components/Todo.tsx</div>

```tsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'

type Props = any;

export default class Todo extends Component<Props, Props> {
  static propTypes = {
    todo: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired
  }

  state = {
    editing: false
  }

  handleDoubleClick = () => {
    this.setState({ editing: true })
  }

  handleSave = (id: number, text: string) => {
    if (text.length === 0) {
      this.props.deleteTodo(id)
    } else {
      this.props.editTodo(id, text)
    }
    this.setState({ editing: false })
  }

  render() {
    const { todo, completeTodo, deleteTodo } = this.props

    return this.state.editing ? (
      <TodoTextInput 
          text={todo.text}
          editing={this.state.editing}
          onSave={(text: string) => this.handleSave(todo.id, text)} />
    ) : (
      <div className="view">
        <input 
           className="toggle"
           type="checkbox"
           checked={todo.completed}
           onChange={() => completeTodo(todo.id)} />
        <label onDoubleClick={this.handleDoubleClick}>
          {todo.text}
        </label>
        <button 
          className="destroy"
          onClick={() => deleteTodo(todo.id)} />
      </div>
    )
  }
}
```

### UI logic

> View behavior & local component state

The main difference between the two previously shown `Todo` components is that the second `Todo` component contained UI logic where the first did not.

#### UI logic is view behavior

![img/blog/client-side-architecture/Frame_51_(3).png](/img/blog/client-side-architecture/Frame_51_(3).png)

"If you're logged in, show *this* — otherwise, show *this."*

"If you're this type of user, show *this* — otherwise, show *this."*

"Depending on which page you're on in the signup process, show the correct form".

A component has UI logic when it exudes behavior. Conditionals that determine *what to show*, or *when certain user events get called over others* **are a form of view behavior (UI logic)**.

Here's a conditional example from the previous code sample **determining what to show**.

```tsx
return this.state.editing ? (
    <TodoTextInput 
        text={todo.text}
        editing={this.state.editing}
        onSave={(text: string) => this.handleSave(todo.id, text)} />
  ) : (
    <div className="view">
      <input 
         className="toggle"
         type="checkbox"
         checked={todo.completed}
         onChange={() => completeTodo(todo.id)} />
      <label onDoubleClick={this.handleDoubleClick}>
        {todo.text}
      </label>
      <button 
        className="destroy"
        onClick={() => deleteTodo(todo.id)} />
    </div>
  )
```

Here's a conditional **determining which user event to create**.

```tsx
handleSave = (id: number, text: string) => {
  if (text.length === 0) {
    this.props.deleteTodo(id)
  } else {
    this.props.editTodo(id, text)
  }
  this.setState({ editing: false })
}
```

#### Component / local state

This is where the *first* type of state we might encounter: `local (component)` state.

In [Jed Watson](https://twitter.com/JedWatson)'s talk from GraphQL Summit 2019 titled, "[A Treatise on State](https://www.youtube.com/watch?v=tBz3UmZG_bk&feature=emb_title)", he describes five different types of state when building web apps: `local (component)`, `shared (global)`, `remote (global)`, `meta`, and `router`.

- **Explanations of the five types of state**
    - `local (component)` : State that belongs to a single component. Can also be thought about as UI state. UI state can be extracted from a presentation component into a React hook. **Note: we're about to do this**.
    - `shared (global)` : As soon as some state belongs to more than one component, it's *shared* global state. Components shouldn't need to know about each other (a header shouldn't need to know about a todo).
    - `remote (global)` : The state that exists behind APIs in services. When we make `queries` for remote state, we hold onto a local copy of it accessible from a global scope.
    - `meta` : Meta state refers to state *about* state. The best example of this is the `loading` async states that tell us the progress of our network requests.
    - and `router` state: The current URL of the browser.

This state, `local (component)` state, belongs to a single component. You can call this UI state. It's meant to hold onto data that helps a single component do its job. 

To better see what it looks like, let's extract all UI state from this class-based component and refactor to a functional component and a React hook. 

<div class="filename">/components/Todo.tsx</div>

```tsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import { useState } from 'react'

/**
 * Decompose the UI logic from the presentational component
 * and store it in a React hook.
 *
 * All data and operations in this hook are UI logic for the
 * component - we've just separated concerns, that's all.
 */

function useTodoComponent (actions) {
  // "editing" is a form of local (component) state
  const [editing, setEditing] = useState(false);

  const handleSave = (id: number, text: string) => {
    if (text.length === 0) {
      actions.deleteTodo(id)
    } else {
      actions.editTodo(id, text)
    }
    setEditing(true);
  }

  const handleDoubleClick = () => {
    setEditing(true);
  }

  return { 
    models: { editing }, 
    operations: { handleSave, handleDoubleClick } 
  }
}

/**
 * This component relies on some local state, but none of 
 * it lives within the component, which is purely 
 * presentational.
 */

export function Todo (props) {
  const { todo, actions } = props;
  
  // Grab our local (component) state and access to other UI logic
  const { models, operations } = useTodoComponent(actions);
  
  // Conditional UI logic
  return models.editing ? (
    <TodoTextInput 
      text={todo.text}
      editing={models.editing}
      onSave={(text: string) => operations.handleSave(todo.id, text)} />
  ) : (
    <div className="view">
      <input 
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        onChange={() => actions.completeTodo(todo.id)} />
      <label onDoubleClick={operations.handleDoubleClick}>
        {todo.text}
      </label>
      <button 
        className="destroy"
        onClick={() => actions.deleteTodo(todo.id)} />
    </div>
  )
}
```

#### UI logic is what we *actually* try to test within components

Since UI logic is behavior, *this* is actually what we want to test against in our integration tests. The behavior. You *could* write unit tests as well, but it might be trivial if component logic is straightforward. It could be more worthwhile and give you more confidence that the feature is working correctly to integration test both the component and the UI logic together.

### Container/controller

> The glue layer (pages)

Traditionally, the responsibilities of a container component were to:

- Consume user events & pass them to the model
- Subscribe to data changes (reactivity) and keep the view updated

![img/blog/client-side-architecture/Frame_52_(1).png](/img/blog/client-side-architecture/Frame_52_(1).png)

This isn't new. The definition of a *controller/presenter,* all the way back from the *Model-View-Presenter* pattern, made this distinction.

#### Do we really need container components?

In 2019, with the advent of React hooks, [Dan said we don't](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). 

> The main reason I found [container components] useful was because it let me separate complex stateful logic from other aspects of the component. Hooks let me do the same thing without an arbitrary division.

Here are my thoughts.

I fully agree that complex stateful logic **shouldn't live within presentation components**. When we do that, we don't get the ability to reuse logic across different components. 

Now, as for stateful logic in *container components*? I don't believe it *ever should have been in 'em.*
 

Previously, React developers were advised to put data and behavior in container components and write code that determined "how things work". That breaks the rules of what was said to be the responsibility of a container/presenter.

Just because we know to put stateful data and behavior in React Hooks, it **doesn't mean we removed the problems a container component solves**.

We *still* need to configure *reactivity*, sometimes using Redux, sometimes using Apollo Client or something else, and we *still* need some construct to **act as the glue, knowing which components to load up for the features we enable on a page**.

#### Container components are pages

In the following React Router example, we have three main *pages:* home, about, and dashboard. 

<div class="filename">src/App.js</div>

```tsx
export default function App () {
  return (
    <Router>
        <Switch>
          <Route exact path="/"> 
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
    </Router>
  );
}
```

Each page:

- is responsible for enable a variable number of features (remember, a feature is a `command` or `query`)
- has a variable number of presentational components within it, and
- knows about `shared` reactive state, and *sometimes* connects it to presentational components that need it

Container components are the top-level modules that turn on all the features for a particular page. In Gatsby.js, we call them *Page components*. Since all client architectures naturally evolve from this Model-View-Presenter pattern, it's unlikely we'll **get rid of the presenter (container) entirely**.

To demonstrate my point, here's a *container component* in a React hooks world. It might not look like much, but notice that **it fulfills the two responsibilities of a container component**.

<div class="filename">/modules/home/Home.container.tsx</div>

```tsx
import React from 'react'
import MainSection from '../components/MainSection'
import { useQuery } from '@apollo/client'
import { VisiblityFilter } from '../models/VisibilityFilter'
import { Todos } from '../models/Todos'
import { GET_ALL_TODOS } from '../operations/queries/getAllTodos'
import { GET_VISIBILITY_FILTER } from '../operations/queries/getVisibilityFilter'
import { todoMutations } from '../operations/mutations'

const todosAPI = new TodosAPI();

export default function Home () {
  // Shared (global) or remote (global) state.
  const { operations, models } = useTodos(todosAPI);
  const { 
    completeAllTodos, 
    setVisibilityFilter, 
    clearCompletedTodos 
  } = operations;

  return (
    <Layout>
      <MainSection
        // Pass data to components
        activeVisibilityFilter={visibilityFilter}
        todosCount={models.todos.length}
        completedCount={models.todos.filter(t => t.completed).length}
        
        // Delegate operations to the model
        actions={{
          completeAllTodos,
          setVisibilityFilter,
          clearCompletedTodos
        }}
      />
      <ReportSection 
        // Pass data to components
        todos={models.todos}

        // Delegate operations to the model
        actions={{
          completeAllTodos,
          setVisibilityFilter,
          clearCompletedTodos
        }}
       />
    </Layout>
  );
};
```

***Something* is responsible for knowing how to connect to a reactive model, and knowing what to do with events that come from presentation components. That's a container.**

Of course, you could call everything a *component,* but then the explicit communication and delineation of responsibilities we're fighting for is lost.

#### Container components contain no functionality

The container component is pretty bare. That's a good thing. They're not supposed to contain any functionality. They're not worthy of unit testing. They're just meant to stitch things together. However, if you want to do an integration test all features of a page, just load up the container component and have at 'er.

### Interaction layer

> Model behavior

We're finally in the most challenging part of a client-side architecture: the *model*. 

The first layer of the model, which is what gets called from the container component, is the **interaction layer**.

![img/blog/client-side-architecture/Untitled%201.png](/img/blog/client-side-architecture/Untitled%201.png)

#### The interaction layer is the behavior of the model

When you click submit to "*add a todo"*, do you jump straight to the GraphQL `mutation` right away? Do you perform any validation logic? Are there any rules to enforce?

A lot of times, there *aren't* any rules. Sometimes we can't be bothered and we leave validation logic as something the *server* handles. This is particularly common on simple dashboard apps. These apps have pretty much **no rules to enforce**, so an interaction layer doesn't exist.

It goes controller → network request. 

Or as we've been doing for a long time, presentation component → network request.

When there **is** policy to enforce, it's time to think about carving out an interaction layer.

#### The interaction layer is the decision-making layer

**Application (or interaction) logic** is the logic that makes a decision as to what happens next.

Let's say you have a `command` called `createTodoIfNotExists`. Whatever construct is responsible for the interaction layer contains the code that helps you decide, "should we follow through with this"?

Here's a [Redux Thunk](https://github.com/reduxjs/redux-thunk) example, where sometimes, we need to reach into some form of `global` state (maybe cached in a store) to make a decision.

<div class="filename">/todos/redux/thunks/createTodoIfNotExists.tsx</div>

```tsx
// Interaction example
export function createTodoIfNotExists (text: string) {
  return (dispatch, getState) => {
    const { todos } = getState();

    const alreadyExists = todos.find((t) => t === text);
    
    if (alreadyExists) {
      return;
    }

    ...
    // Validate
    // Request
  }
}
```

Alternatively, here's a React Hooks & Apollo Client example.

<div class="filename">/models/useTodos.tsx</div>

```tsx
function useTodos (todos) {

  const createTodoIfNotExists = (text: string) => {
    const alreadyExists = todos.find((t) => t === text);
    
    if (alreadyExists) {
      return;
    }
    
    ...
    // Validate
    // Request
  }

  return { createTodoIfNotExists }
}

// Container
function Main () {
  const { data: todos } = useQuery(GET_ALL_TODOS);
  const { createTodoIfNotExists } = useTodos(todos);

  ...
}
```

#### It contains your application's operations

Some refer to this layer as **app logic**, which works as well because these are all of the *operations* of your app. The interaction layer contains the discrete set of `commands` and `queries` that your users will carry out. These are the *use cases*.

Having great visibility into these [use cases](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/application-layer-use-cases/) enables us to get pretty structured with our integration testing as well. We can functionally test every use case with edge cases using Given-When-Then style tests.

For example:

- *Given* no todos exist, *when* I perform `CreateTodo`, *then* I should see one todo.
- *Given* I have 3 completed todos and 1 uncompleted one, *when* I perform `CompleteAllTodos`, *then* I should have 4 completed todos.

If you're familiar with [Domain-Driven Design](/articles/domain-driven-design-intro/) concepts, this is the [Application Service](/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/#Application-Services) equivalent.

#### Shared behavior

This behavior is written to be used by any component. It contains the rules for how shared state is allowed to change. 

At this level, we're often handling concerns like `auth`, `logging`, or even more *domain-specific* things like `todos`, `users`, `calendar`, or even `chess`.

Consider an interaction-layer React hook that contained all your chess game logic.

<div class="filename">/hooks/useChess.tsx</div>

```jsx
function useChess (todosAPI: ITodosAPI) {
  ...
  return { 
   operations: { makeMove, isValidMove, ... },
   models: { board, players, currentTurn }
  }
}
```

Read "[Domain-Driven GraphQL Schema Design](https://khalilstemmler.com/articles/graphql/ddd/schema-design/)" for the principles and practices for how to use event Storming to discover the subdomains within your app.

#### Other ways to implement the model

Though most React developers will be comfortable writing their application/interaction layer logic using something like React Hooks, there's tons of other ways to implement the model. 

- If you like to think of your model as a state machine, the [xState library](https://xstate.js.org/docs/recipes/react.html#hooks) does this exceptionally well and provides capabilities for you to plug your model instance into a React hook.
- For those who want to try to model their interaction layer using plain vanilla JavaScript, the [pojo-observer library](https://github.com/xolvio/pojo-observer) takes advantage of the fact that every client-app is an implementation of the observer pattern. Separating your model code from React hooks, it also provides a way to notify React that the model changed so a re-render is necessary.

Someone once asked me [if it's possible to do DDD in the front-end](https://khalilstemmler.com/articles/typescript-domain-driven-design/ddd-frontend/). Initially, I said *no*, but after sometime thinking about it, it *totally is*. While the true high-level policy will always live on the backend, the interaction layer is comparable to the Application and *possibly* Domain layer in DDD.

#### There are usually several layers

Most of the time, your app will have several of these **application / interaction** layers.

Here are some more examples of interaction layers that are commonly built out.

- **Examples of other interaction layers**
    - Auth layer — Extremely common. Check out the [useAuth](https://github.com/Swizec/useAuth) library which implements Auth0 authentication and authorization as a React hook.
    - Logging — Sometimes it's important to. Luckily, there are many tools out there that can do this for you, but if you needed to build one yourself, it would exist as an entirely separate layer within your model.
    - Real-time subscriptions — Let's say you're subscribed to a stream of data. When a chunk comes in, you need to process it, and perhaps act on a `switch` statement to figure out if you should invoke a `command`. Keep your code clean by delegating this responsibility to a layer.
    - Complex rendering logic — I once worked on a project that built out really complex call flows for call centers using Angular and D3. Hundreds of different node types could be dragged and dropped onto a surface. When dropped, the way they connected to each other and how they could be used depended on the rendering and application logic, each decoupled from each other.
    - Metadata layer — Imagine building a multiplayer video game where new prizes and weapons come out every week. How can we prevent hard-coding weapons and prizes?

If you're curious about what a large-scale version of this looks like, check out [Twilio's video-app example](https://github.com/twilio/twilio-video-app-react) built with React hooks and context for global state.

### 🚡 Networking & data fetching (infrastructure)

> Performing API calls and reporting metadata state

The responsibilities of a networking and data fetching layer are to:

- Know where the backend service(s) are
- Formulate responses
- Marshal response data or errors
- Report async statuses (isLoading)

![img/blog/client-side-architecture/Untitled%201.png](/img/blog/client-side-architecture/Untitled%201.png)

#### Reporting metadata state

Jed Watson describes the async states that tell you about the status of a network request as **meta state** — state *about* state.

For example, in Apollo Client, the `loading` variable we deconstruct from the query response is a form of meta state.

```tsx
const { data, loading, error } = useQuery(GET_ALL_TODOS);
```

With Apollo Client, that's handled for us. Though if we were to use a more barebones approach, like Axios and Redux, we'd have to write this signaling code ourselves within a Thunk.

```tsx
export function createTodoIfNotExists (text: string) {
  return async (dispatch, getState) => {
    const { todos } = getState();

    const alreadyExists = todos.find((t) => t === text);
    
    if (alreadyExists) {
      return;
    }
     
    // Signaling start
    dispatch({ type: actions.CREATING_TODO })

    try {
      const result = await todoAPI.create(...)
      
      // Signaling success
      dispatch({ type: actions.CREATING_TODO_SUCCESS, todo: result.data.todo })
    } catch (err) {
  
      // Signaling Failure
      dispatch({ type: actions.CREATING_TODO_FAILURE, error: err })
    }

  }
}
```

<p class="special-quote"><b>Note</b>: The code example above is a demonstration of doing a little too much. Recall that a Redux Thunk is an interaction layer concern? That means it should <i>only</i> be responsible for the decision-making logic, and no <i>signalling</i> logic, since request signalling is a concern of the networking & data-fetching layer. It can be hard to establish these concrete boundaries sometimes. Especially if the library or framework wasn't designed with separation of concerns in mind.</p>

### 🗄️ State management & storage (infrastructure)

> Storage, updating data, reactivity

A state management library has *three* responsibilities:

- **Storage** — Hold onto global state somewhere, usually in a store / client-side cache.
- **Updating data** — Make changes to the data in the cache.
- **Reactivity**  — Provide a way for view-layer presentation components to subscribe to data, and then re-render when data changes.

#### State management and networking are often solved together

State management is complex. 

Because it's complex, there are libraries out there to make life a little bit easier. Two of those libraries, Apollo Client and react-query, actually handle the *networking* part for you.

It can be preferable to choose a library instead of building out the state management machinery and *networking* layer manually.

![img/blog/client-side-architecture/Untitled%202.png](/img/blog/client-side-architecture/Untitled%202.png)

Apollo Client handles both the state management and data fetching concerns.

#### Shared global state

Two types of state exist at this layer. They are:

- `remote (global)` state — The state that exists behind APIs in services. When we make `queries` for remote state, we hold onto a local copy of it accessible from a global scope.
- `shared (global)` : We said earlier, "as soon as some state belongs to more than one component, it's *shared* global state". And you'll know you need this when **two components that rely on the same state don't need to know about each other**. To be clear, this type of state can be live in the interaction layer (via hooks and context, for example). Though sometimes, when working with `remote(global) state`, it's preferable to have something act as a single source of truth, especially if you need to mix remote and local state.

#### Mixture of remote and local state

We often cache remote state in a client-side cache or store. Since we do that, it's reasonable to try to use the store as a single source of truth. Often, we'd like to add some client-only local variables or pieces of state to the store as well.

Here's a Redux example of adding an `isSelected` attribute to each of the `todos` before merging to the store.

```tsx
switch (action.type) {
  ...
  case actions.GET_TODOS_SUCCESS:
    return {
      ...state,
      // Add some local state to the remote state before merging it
      // to the store
      todos: action.todos.map((t) => { ...t, isSelected: false })
    }
}
```

And in Apollo Client 3, here's the equivalent with cache policies and reactive variables. 

```jsx
import { InMemoryCache } from "@apollo/client";

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Todo: {
      fields: {
        isSelected: {
          read (value, opts) {
            const todoId = opts.readField('id');
            const isSelected = !!currentSelectedTodoIds()
              .find((id) => id === todoId)
              
            return isSelected;
          }
        }
      }
    }
  }
});

export const currentSelectedTodoIds = cache.makeVar<number[]>([]);
```

We can configure a way to request `remote` state and *client-only* `shared` local state in the same query.

```tsx
export const GET_ALL_TODOS = gql`
  query GetAllTodos {
    todos { 
      id  
      text  
      completed
      isSelected @client
    }
  }
`
```

#### Storage facades

Most of the time we don't provide direct access to whats stored within the *store*. Usually, there's some *facade*, an API, that sits in-front of the data and provides ways for us to interact with it.

In Redux, this is `dispatch` (for updates) and connect (for reactivity).

In Apollo Client, this is `useMutation` (for updates) and `useQuery` (for reactivity).

Even SQL is a form of a storage facade. It's a powerful pattern.

![img/blog/client-side-architecture/storage__facades.png](/img/blog/client-side-architecture/storage__facades.png)

## Conclusion

I know this article expressed a lot of new ideas. To be completely honest, I spent about three months thinking about this off and on, and I'm likely going to spend some time revising it.

But let's look at what we've covered. Zooming out, we started with this:

![img/blog/client-side-architecture/Untitled.png](/img/blog/client-side-architecture/model-view-presenter.png)

And then zooming in, we landed on this:

![img/blog/client-side-architecture/Client-side_architecture_basics_(5).png](/img/blog/client-side-architecture/Client-side_architecture_basics_(5).png)

Here a couple of final thoughts to recap.

#### Model-View-Presenter isn't good enough for our needs anymore

The problems we're solving on the client-side are much more complex than they were 20 years ago. Because of that, the starting point for an architecture probably can't be MVP.

#### Design principles have persisted for a long time to help us write better software

I honestly think that reading books and learning from the past is one of the best ways to avoid future mistakes. Design principles are great. You don't need to always follow them, but know the rules before deciding whether you want to break 'em.

#### There are no silver bullets

There really aren't. With this advanced client-side architecture, what we introduce in structural quality, we lose in developer experience based on the potential learning curve involved. But ask yourself this question: [is the complexity related to nature of the problem itself, or is it just related to the way we're solving it](https://khalilstemmler.com/articles/software-professionalism/absolute-and-relative-complexity/)?

#### This is for developers where "use what works for you" is daunting, and would like a good conceptual starting point for an air tight React architecture

I'm really excited about these ideas. I've been milling around with this for a couple of months now but I think it's really important today. If you're a developer that has been told to use "what works for you", that's still incredibly good advice. But if you run into any of the pain-points in your React project like suddenly facing issues adding features, changing code, and feeling like things have turned to mush, this might help.

#### Next steps

**Choosing a stack**: How do you choose a stack with this architecture?

**Organizing code:** How do you organize code within a React project? What principles are at play?

**Dealing with prop drilling**: If we have these clear-cut layers, doesn't that mean we'll have to do a lot of prop drilling? 

