---
templateKey: blog-post
title: "5 Ways to Manage Lambda Cold Starts"
date: '2020-06-27T10:04:10-05:00'
updated: '2020-06-271T10:04:10-05:00'
description: >-
  AWS Lambda is a serverless computing platform, which enables you to run code without managing servers or provisioning. It is very useful, especially if you’re using other AWS resources. However, there are some challenges you need to be aware of. AWS Lambda cold starts and timeouts are particularly challenging to solve.
tags:
  - AWS
  - Lambda
  - Serverless
category: Serverless
published: true
image: /img/blog/serverless/aws-lambda.png
displayInArticles: false
guestPost: true
guestPostAuthor: Gilad Maayan
---

In this article, you will learn how cold start issues occur, what factors contribute to cold starts, and how to manage Lambda cold starts.

## Understanding the Cold Start Problem

A Lambda cold start occurs when a new function instance must be created and initialized. The cold start refers to the delay between invocation and runtime created by the initialization process. 

Lambda cold starts occur when there is no available function instance to respond to an invocation. This can happen when instances have expired due to inactivity or when there are more invocations than active instances. Cold starts are an inherent problem with serverless models because providers are unwilling or unable to keep inactive instances alive indefinitely. 

To maximize resource use and optimize provider costs, instances are only kept alive for a set amount of idle time. This means that unless your functions are consistently activated, you are going to have to manage latency caused by cold starts. 

## What Factors Contribute to Cold Starts?
Several factors contribute to cold starts when using Lambda functions. While one of these factors is not controllable (i.e. how long AWS keeps instances alive), most are. Below are some of the factors with the greatest impact that you should be mindful of. 

### Languages
The length of time it takes to cold start an instance depends significantly on the language you use for your function. For example, JavaScript or Python functions will initialize much faster than C# or Java-based ones. 

Additionally, just-in-time (JIT) compilation, like that used by .NET languages, substantially increases start time. This is because the language’s machine agnostic assemblies must be converted to machine-specific assemblies at initialization. 

### Function chains
In many applications, developers use chains of functions to perform tasks. This chaining is fine when functions are already available but can cause significant overhead if not. When chaining, each function in the chain must wait for the possible initialization and response of any later functions. 

This ordered process compounds cold start times and can cause Lambda functions to time out. If timeouts occur, you have to start the invocation process all over, creating even more latency.

### Virtual Private Clouds (VPC)
While VPCs can help keep your data more secure, these networks are a barrier to the performance of Lambda functions. This is because most Lambda functions require an external connection for request and response operations. This connectivity requires the creation of an elastic network interface (ENI).

When instances are initialized inside a VPC, the cold start process is extended by the creation of the ENI. During this process, an IP must be allocated and the interface attached to the function. Lambda can take up to 10 seconds to complete this process. 

##  How to Manage Lambda Cold Starts
While you cannot completely eliminate the chance of cold starts when using Lambda you can decrease the impact. When configuring your functions, consider the following tips. 

### 1. Measure current performance
Measuring the current performance of your configurations can help you identify where you need to make changes and can help you anticipate latency. In particular, you should evaluate how frequently your functions are being invoked, how many invocations occur at once, and how long invocations take. You can then use these values to determine how many dedicated instances you need.

Performance can be measured directly using metrics sent to AWS CloudWatch or you can use third-party tools. The former works well for individual functions but can only provide limited information and is not easily searchable. The latter enables you to invoke your functions many times, can provide visualizations of the results, and enables you to more easily evaluate aggregate data.

### 2. Keep your functions warm
Once your instances are initialized, you can keep them active to avoid the majority of your cold starts. Keeping functions warm can be done by either invoking the function or using warming logic with handler functions. Warmer logic pings functions to check their status, keeping the instance alive even if it isn’t fully invoked. 

To accomplish this, you can either manually configure your logic or you can use tooling to automate the process for many instances. Manual setup involves inserting logic into your handler functions and triggering that logic with CloudWatch Events and cron jobs. Or, with tooling, you can reuse the same logic for concurrent instances. 

### 3. Choose the right memory settings
When using Lambda, your memory and CPU resources are directly tied. The more memory you provision, the more processing power your functions can access, and the faster initialization can occur. While you may be tempted to keep memory resources low to save costs, doing so can increase your cold start and runtimes times and end up costing you more regardless. 

To avoid higher costs due to insufficient resources, you need to find the balance point between resources and latency. This requires understanding how frequently your functions are invoked, the revenue dependent on those functions, and the latency during cold start and warm invocations.

### 4. Store dependencies external to your function
With Lambda, you can load dependencies into your function container external to your function. This enables you to prep dependencies for invocations and prevents functions from needing to load dependencies each time the instance is called. 

While this process won’t reduce your cold start time, you can use it to reduce your runtimes and offset initial latency. When you use this method in combination with function warming, you can significantly reduce your function runtimes. 

### 5. Keep your function small and single-purpose
Keeping your functions small and single-purpose helps ensure that functions execute quickly and reduces the chances of timeout. It can also reduce the total number of instances you need, thus reducing the chance of cold starts. 

When function invocations finish quickly, that instance is sent back to your available pool. The more available instances in your pool at any given point, the lower the chance that you need to create a new instance to answer an invocation request. Ensuring that functions execute efficiently is a way of “increasing” your pool without requiring more instances. 

## Conclusion

A Lambda cold start occurs when function instances are not available to respond to invocations. There are several factors contributing to this issue. The language you use, for example, impacts the length of time it can take to cold start an instance. If you are using function chains, the order of the functions can cause timeouts. If you are planning on setting up your Lambda on VPC, you need to be aware that the process of initializing Lambda functions on VPCs can take up to 10 seconds. 

Unfortunately, you can’t completely eliminate cold starts, but you can significantly reduce the impact this issue may cause. You can do that by measuring current performance and keeping your functions warm, small, and single-purposed. You can also store dependencies externally, and make an effort to choose the right memory settings for your project.
