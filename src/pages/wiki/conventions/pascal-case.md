---
name: 'Pascal Case'
templateKey: wiki
published: true
wikicategory: Coding Conventions
wikitags: null
prerequisites: null
date: '2020-03-07T00:05:26-04:00'
updated: '2020-03-07T00:05:26-04:00'
image: null
plaindescription: Pascal Case is a naming convention that promotes naming identifiers using all upper-case words.
---

Pascal case (or should I say `PascalCase`) is one of three primary **capitalization conventions** (underscore, Pascal, and [camel](/wiki/conventions/camel-case/)) used in programming languages.

Pascal case dictates that each word in an identifier be **capitalized** with **no separators (like underscores) in between them**.

_Not pascal case_

```typescript{1,6,10,14}
type user = { 
  id: string; 
  name: string
}

interface serializable {
  toJSON (): string;
}

class user_model implements serializable {
  ...
}

const shouldlistenToJohnMaus = likesWeirdmusic() && isGenerallyAHappyPerson();
```

_Pascal case_

```typescript{1,6,10,14}
type User = { 
  id: string; 
  name: string
}

interface Serializable {
  toJSON (): string;
}

class UserModel implements Serializable {
  ...
}

const ShouldListenToJohnMaus = LikesWeirdMusic() && IsGenerallyAHappyPerson();
```

## The role of Pascal case in TypeScript & JavaScript

In TypeScript & JavaScript, the Pascal case convention is _usually_ used to signify that an identifier is a class, type, or interface.

We would normally use Pascal case for things like this:

```typescript
// This is conventional!
type User = { 
  id: string; 
  name: string
}

// Also conventional usage!
interface Serializable {
  
  // But notice that the attributes are NOT Pascal case.
  toJSON (): string;
}

// Pascal case on classes are conventional.
class UserModel implements Serializable {
  ...
}
```

But not for variables or functions:

```typescript
// It's not conventional to use Pascal case for variables or functions in TypeScript and JavaScript
const ShouldListenToJohnMaus = LikesWeirdMusic() && IsGenerallyAHappyPerson();
```

## Pascal case in other languages

- In C#, Pascal case is used for most things. It's a common convention to name variables, function, classes, and interfaces using Pascal case.


## See also

- [Camel case](/wiki/conventions/camel-case/)
