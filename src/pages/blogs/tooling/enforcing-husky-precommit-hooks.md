---
templateKey: blog-post
title: "Enforcing Coding Conventions with Husky Pre-commit Hooks"
date: '2020-03-10T10:04:10-05:00'
updated: '2020-03-101T10:04:10-05:00'
description: >-
  In this guide, we'll learn how to setup Husky to prevent bad git commits and enforce code standards in your project.
tags:
  - Guides
  - TypeScript
  - Prettier
  - Formatting 
category: Tooling
published: true
displayInArticles: true
image: /img/blog/templates/banners/tooling-banner.png
---

<p class="special-quote">This post is a part of the <b>Clean Code Tooling</b> series. <br/>You may want to read the previous posts.<br/><a href="/blogs/typescript/eslint-for-typescript/">1. How to use ESLint with TypeScript</a><br/><a href="/blogs/tooling/prettier/">2. How to use Prettier with ESLint and TypeScript in VSCode</a></p>

## Intro

On most projects I've ever worked collaboratively on, _someone_ takes the role of the _code cleanliness champion_. It's usually the team lead, and often times, their role involves reviewing [PRs](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) and making sure love and care is put into the quality of the code.

Quality includes both the chosen **coding conventions** in addition to the **formatting** of the code.

Today, it's good practice in JavaScript projects to utilize [ESLint](/blogs/typescript/eslint-for-typescript/) to define the project's coding conventions. For example, how does your team feel about using `for` loops? What about semicolons- are those required? Etc.

Those are conventions.

The other piece of the puzzle is formatting. That's the _visual appearance_ of the code. When there's more than one developer working on a project, ensuring that code _looks_ consistent is something to be addressed.

[Prettier](/blogs/tooling/prettier/) is the correct tool for this.

In the [previous article](/blogs/tooling/prettier/), we learned how to combine both ESLint and Prettier, but we didn't learn how to actually **enforce** the conventions and formatting on a real life project with multiple developers.

In this article, we'll learn how to use [Husky](https://github.com/typicode/husky) to do so on a Git-based project.

## Husky

Husky is an npm package that "makes Git hooks easy".

When you initialize [Git](https://git-scm.com/) (the version control tool that you're probably familar with) on a project, it automatically comes with a feature called **hooks**.

If you go to the root of a project intialized with Git and type:

```bash
ls .git/hooks
```

You'll see a list of sample hooks like `pre-push`, `pre-rebase`, `pre-commit`, and so on. This is a way for us to write plugin code to execute some logic _before_ we perform the action.

If we wanted to ensure **before someone creates a commit** using the `git commit` command, that their code was properly linted and formatted, we could write a `pre-commit` Git hook.

Writing that _manually_ probably wouldn't be fun. It would also be a challenge to distribute and ensure that hooks were installed on other developers' machines.

These are some of the challenges that Husky aims to address.

With Husky, we can ensure that for a new developer working in our codebase (using at least Node version 10):

- Hooks get created locally
- Hooks are run when the Git command is called
- Policy that defines _how_ someone can contribute to a project is enforced.

Let's get it set up.

## Installing Husky

To install Husky, run:

```bash
npm install husky --save-dev
```

## Configuring Husky

To configure Husky, in the root of our project's `package.json`, add the following `husky` key:

<div class="filename">package.json</div>

```json
"husky": {
  "hooks": {
    "pre-commit": "",       // Command goes here
    "pre-push": "",         // Command goes here
    "...": "..."
  }
}
```

When we execute the `git commit` or `git push` command, the respective hook will run the script we supply in our `package.json`.

## Example workflow

Following along from the previous articles, if we've configured ESLint and Prettier, I suggest to utilize two scripts: 

- `prettier-format`: Format as much code as possible.
- `lint`: Ensure that the coding conventions are being adhered to. Throw an error if important conventions are broken.

<div class="filename">package.json</div>

```json{3,4,9}
{
  "scripts": {
    "prettier-format": "prettier --config .prettierrc 'src/**/*.ts' --write",
    "lint": "eslint . --ext .ts",
    ...
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run prettier-format && npm run lint"
    }
  }
}
```

Include these scripts in the `scripts` object in your `package.json`. Then, _at the very least_, run `prettier-format` and then `lint` as a `pre-commit` hook.

This will ensure that you cannot complete a `commit` without formatted code that passes the conventions.

### No-loops example

I like to use the [no-loops](https://github.com/buildo/eslint-plugin-no-loops) package as an example. This convention doesn't allow developers to use `for` loops, and instead suggests that we use Array utility functions like `forEach`, `map`, and the like.

Adding the plugin and its rule to the `.eslintrc`:

<div class="filename">.eslintrc</div>

```json{6,16}
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "no-loops",
    "prettier"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-loops/no-loops": 2, // 2 means throw an ERROR 
    "no-console": 1,
    "prettier/prettier": 2
  }
}
```

And then placing a `for` loop in the source code...

<div class="filename">src/index.ts</div>

```typescript
console.log('Hello world!');

for (let i = 0; i < 12; i++) {
  console.log(i);
}
```

And attempting to commit, it should exit with a non-zero exit code, which as we know, means an error occurred.

```bash
simple-typescript-starter git:(prettier) ✗ git commit -m "Test commit"
husky > pre-commit (node v10.10.0)

> typescript-starter@1.0.0 prettier-format simple-typescript-starter
> prettier --config .prettierrc 'src/**/*.ts' --write

src/index.ts 191ms

> typescript-starter@1.0.0 lint /simple-typescript-starter
> eslint . --ext .ts


/simple-typescript-starter/src/index.ts
  1:1  warning  Unexpected console statement  no-console
  3:1  error    loops are not allowed         no-loops/no-loops
  4:3  warning  Unexpected console statement  no-console

✖ 3 problems (1 error, 2 warnings)
```

And there it is!

## Other considerations

If you notice that linting is taking a long time, check out this package, [lint-staged](https://github.com/okonet/lint-staged). It runs the linter, but only against files that are staged (files that you're ready to push). This was suggested to me by [@glambertmtl](https://twitter.com/glambertmtl). Thank you!




