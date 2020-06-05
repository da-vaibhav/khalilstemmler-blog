---
templateKey: article
title: How to Deploy a Serverless GraphQL API on Netlify [Starters]
date: '2020-02-23T00:05:26-04:00'
description: >-
  Exploring two starter projects you can use to deploy a serverless GraphQL API on Netlify with or without TypeScript.
tags:
  - Tutorial
  - Netlify
  - GraphQL
  - Serverless
  - Starters
category: GraphQL
image: /img/blog/tutorials/serverless-graphql/serverless-graphql.png
published: true
---

You know, I'm very proud to be a developer in 2020. The access we have to tools and services is impressive. The barrier to entry towards crafting side-projects, startups, businesses, etc.- it's almost non-existent.

With tools like [Netlify](https://www.netlify.com/), we can deploy a _serverless_ Apollo GraphQL server for free in seconds. Un. Real.

While I like being able to do things quickly, I'm also one who believes that "if we do it, we know it". So I'm going to give you a few useful resources on how to deploy serverless GraphQL APIs and then walk you through the process so that you can better appreciate what's going on. 

<p class="special-quote">Huge shoutout to the great <a href="https://twitter.com/trevorblades">Trevor Blades</a> who cut 80% of the time it would have taken me to figure this stuff out on my own. Most of this is based off of his <a href="https://github.com/trevorblades/countries">Countries GraphQL API</a>.</p>

## Prerequisites

- You should have Node and npm installed
- You should understand the concept of serverless functions
- You have a code editor installed (preferably VS Code, it's the champ, don't @ me)

## Goals

By the **start** of this article (like- right now), you should be aware of two resources to deploy GraphQL APIs on Netlify. Check them out below.

- [Serverless GraphQL on Netlify API Starter Project](https://github.com/stemmlerjs/serverless-graphql-netlify-starter)
- [Serverless GraphQL on Netlify API using TypeScript Starter Project](https://github.com/stemmlerjs/serverless-typescript-graphql-netlify-starter)

If you just need to get something up and running, you can go to either of those projects, click "Deploy to Netlify", and you're good to go. You can even stop reading right here.

The second goal for the **rest** of this article is to explain _how_ these starters work, what they can do, and how you can use them for your next serverless project.

We will go through the process of creating a GraphQL API using Netlify from scratch with vanilla JavaScript (though the process is similar with TypeScript).

## Initial setup

First we need to create a folder.

```bash
mkdir serverless-starter
cd serverless-starter
```

### Setup Node.js package.json

Next, we'll create a `package.json` and say "yes" to everything.

```bash
npm init -y
```

### Install dependencies

We don't need a whole lot to get things going. In your console, paste the following command to install the dependencies.

```bash
npm install --save apollo-server apollo-server-lambda
npm install --save-dev cpx nodemon
```

- `apollo-server`: When we're developing locally, we're going to want to run our code against a local GraphQL endpoint. Let's install this so that we can craft an excellent local development experience.
- `apollo-server-lambda`: This is a version of Apollo Server optimized to work on serverless lambda functions. It's what we use to deploy to production.
- `cpx`: In Netlify, we need to bundle all of our source code in the `functions/` folder, so we need a way to copy the code from our `src/` folder in a cross-platform-friendly way to the `functions/` folder.
- `nodemon`: We all like cold-reloading. Install this so that we can get live updates when we change any files.

### Creating our server implementations

Let's create our server implementations at `src/server.js`.

```bash
touch src/server.js
```

In `server.js`, we're going to import both the `ApolloServer` from `apollo-server` and `apollo-server-lambda`, but we're going to call the one imported from the lambda project, `ApolloServerLambda` instead.

<div class="filename">server.js</div>

```javascript
const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');
```

Now let's add a simple type definition and resolvers object.

<div class="filename">server.js</div>

```javascript
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hi! Love from @stemmlerjs 🤠."
  }
};
```

The last thing in this file- let's create two **factory functions**: one for the lambda server, and one for the regular server. We'll also export these from the module as an object.

<div class="filename">server.js</div>

```javascript
function createLambdaServer () {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

function createLocalServer () {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

module.exports = { createLambdaServer, createLocalServer }
```

Sweet, now let's get our local server going.

### Configuring our local server

Create `src/index.js`, the entry point to our local development efforts.

```bash
touch src/index.js
```

Then import `createLocalServer` from `./server`, create a server instance, and fire it up.

<div class="filename">src/index.js</div>

```javascript
const { createLocalServer } = require("./server")

const server = createLocalServer();

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

Nice! That's how we get a **local** GraphQL server up and running. 

### Starting up the local server with Nodemon

Because we like cold-reloading, let's create a `nodemon.json` file in the root of the project and add configure it to listen to changes to anything in `src/` or `functions/` (this is where we will configure our GraphQL server).

<div class="filename">nodemon.json</div>

```json
{
  "watch": ["src", "functions"],
  "ext": ".js",
  "ignore": [],
  "exec": "node ./src/index.js"
}
```

In the `package.json`, we can add a `start` script that simply executes nodemon like so.

<div class="filename">package.json</div>

```json
{
  "scripts": {
    "start": "nodemon"
  }
}
```

To start the project, run this command.

```bash
npm run start
```

Then go to `http://localhost:4000/` and check out the local server.

![Serverless GraphQL Local Server](/img/blog/tutorials/serverless-graphql/1-deployed.png)

### Configuring our lambda server

Now that we've got the local server running, it's time to hook up the one that will run on Netlify.

### Create the functions directory

At the root of the project, create a directory called `functions/`-  this is where we'll tell Netlify to look for our functions.

```bash
touch functions
```

### Create the serverless graphql endpoint

In `functions`, create a file called `graphql.js`.

```bash
touch functions/graphql.js
```

Whatever we put in the `functions` folder, Netlify will make it publicly visible as if it were in a directory.

When we deploy this, we will be able to reach this file directly by going to https://OUR_SITE_NAME/.netlify/functions/graphql.

Let's get access to our `createLambdaServer` factory function, call it, and then expose a `handler` using `server.createHandler`, passing in the most permissive CORS configuration.

<div class="filename">functions/graphql.js</div>

```javascript
const { createLambdaServer } = require('../src/server')

const server = createLambdaServer();

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
});
```

This looks good, but there's a problem here. **Netlify can't reach outside of the `functions` folder and into `src`**.

If we were to deploy this, Netlify would yell at us and tell us that it can't find `createLambdaServer`.

The solution is to bundle the code in `src` and copy it over to the `functions` folder.

### Bundling our source code 

In our `package.json`, let's add the `bundle` script.

<div class="filename">package.json</div>

```json
{
  "scripts": {
    "bundle": "cpx src/**/* functions/bundle"
  },
}
```

This command takes everything in `src` and copies it to `functions/bundle`.

Let's give it a run.

```bash
npm run bundle
```

You should see a new folder appear in the `functions` folder with the source code from `src`.

Go into `functions/graphql.js` and update the reference to the `createLambdaServer` function.

<div class="filename">functions/graphql.js</div>

```javascript{1}
const { createLambdaServer } = require('./bundle/server')

const server = createLambdaServer();

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
});
```

We're pretty much all set to go! The last thing to do is configure Netlify.

## Netlify configuration

Here's the stuff that's magic to me. 

### Empty index.html

I'm not entirely sure if this is necessary (someone correct me), but an empty `index.html` file should live at the root of the project.

```bash
touch index.html
```

### Redirects file

By default, our endpoint lives at https://OUR_SITE_NAME/.netlify/functions/graphql. We don't want to have to refer to it like that; we'd prefer to just see to the site like https://OUR_SITE_NAME/. 

To remedy this, create a `_redirects` file at the root of the project.

```bash
touch _redirects
```

Then add the following config.

<div class="filename">_redirects</div>

```text
/ /.netlify/functions/graphql 200!
```

<p class="special-quote">The exclamation mark signals that we will rewrite <i>everything</i> at the root URL to /.netlify/functions/graphql. Read more about <a target="_blank" href="https://docs.netlify.com/routing/redirects/rewrites-proxies/#shadowing">Shadowing</a> from the docs.</p>

### Netlify.toml file

The last thing we need to do is tell Netlify what the **build** command is and where our **functions** live.

We can do set this up with a `netlify.toml` file.

Let's create one at the root of the project.

```bash
touch netlify.toml
```

And since we need to bundle our code before we deploy, let's use `npm run bundle` as the build command.

<div class="filename">netlify.toml</div>

```text
[build]
  command = "npm run bundle"
  functions = "functions"
```

That's it!

## Deploying to Netlify

Two effortless ways to deploy this are:

1. Click the "Deploy to Netlify" button in either starter. It will clone the repos to your GitHub account and deploy them.

2. Manually clone the repos, log in to Netlify, and then select a repository to deploy.



