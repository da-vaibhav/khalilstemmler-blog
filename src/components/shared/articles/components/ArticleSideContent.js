import React from 'react'
import "../styles/ArticleSideContent.sass"
import trendingIcon from '../../../../images/icons/trending.svg'
import { Link } from 'gatsby';
import ArticleSideSubscribe from './ArticleSideSubscribe'
import { CarbonAd } from '../../ads';

const content = [
  {
    title: 'How to Learn Software Design and Architecture | The Full-stack Software Design & Architecture Map',
    link: '/articles/software-design-architecture/full-stack-software-design/',
    description: `Software Design and Architecture is pretty much its own field of study within the realm of computing, like DevOps or UX Design. Here's a map describing the breadth of software design and architecture, from clean code to microkernels.`
  },
  { 
    title: '[Series] Domain-Driven Design w/ TypeScript and Node.js',
    link: '/articles/categories/domain-driven-design/',
    description: `Learn how to use DDD and object-oriented programming 
    concepts to model complex Node.js backends.`
  }
]

const TrendingContent = () => (
  <div className="article-trending-content">
    <p className="trending"><img src={trendingIcon}/> Trending Content</p>
    {content.map((item, i) => (
      <div className="trending-content-item" key={i}>
        <Link to={item.link}>{item.title}</Link>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
)

const ArticleSideContent = () => (
  <div className="article-side-content">
    <TrendingContent/>
    <CarbonAd/>
    <ArticleSideSubscribe/>
  </div>
)

export default ArticleSideContent;