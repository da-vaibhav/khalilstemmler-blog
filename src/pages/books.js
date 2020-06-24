import React from 'react'
import Layout from "../components/shared/layout"
import solidBook from '../images/book/book-logo.png'
import { ResourceItem } from '../components/resources';
import { SmallSubscribeForm } from '../components/subscribe'

const resourceItems = [
  { 
    name: 'SOLID', 
    description: `The Software Design & Architecture (with TypeScript / Node.js) Handbook`,
    url: 'https://solidbook.io',
    img: solidBook,
    contentType: 'Available for presale'
  }
]

export default function Books () {
  return (
    <Layout 
      title="Books"
      seo={{
        title: 'Books',
        keywords: ['nodejs', 'javascript', 'typescript', 'resources']
      }}
      component={(
        <>
          <p>Catalog of books and guides written for my developer friends!</p>
          <div className="desktop-subscribe-form-container">
            <SmallSubscribeForm/>
          </div>
        </>
      )}>
      
      { resourceItems.map((resource, i) => (
        <ResourceItem 
          key={i}
          name={resource.name}
          description={resource.description}
          url={resource.url}
          image={resource.img}
          contentType={resource.contentType}
        />
      ))}

    </Layout>
  )
}