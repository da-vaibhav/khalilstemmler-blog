
import React from 'react'
import PropTypes from 'prop-types'
import "../styles/Article.sass"
import HTMLContent from '../../../shared/HTMLContent'
import { kebabCase } from 'lodash'
import { Link } from 'gatsby'
import AboutTheAuthor from './AboutTheAuthor'
import AuthorCredit from './AuthorCredit'
import Authors from '../constants/AuthorConstants'
import { Tags } from '../../tags'
import ArticleDescription from './ArticleDescription'
import SimilarArticles from './SimilarArticles'
import { SubscribeForm } from '../../../subscribe';
import ArticleCategory from './ArticleCategory'
import { ShareButtons } from '../../share-buttons';
import ArticleAnchors from './ArticleAnchors';
import { getCategoryIconAndBanner } from '../../../../utils/blog';
import { Comments } from '../../../comments';

class Article extends React.Component {
  constructor (props) {
    super(props);
    this.getUniquePageIdentifier = this.getUniquePageIdentifier.bind(this);
    this.state = {
      anchors: []
    }
  }

  componentWillUnmount () {
    if (typeof window !== 'undefined') {
      try {
        document.querySelector('.article-anchors').remove()
      } catch (err) {
      }
    }
  }

  getUniquePageIdentifier() {
    return typeof window !== 'undefined' && window.location.href
      ? typeof window !== 'undefined' && window.location.href
      : 'https://khalilstemmler.com'
  }

  getAnchors () {
    let anchors = [];
    if (typeof window !== 'undefined') {
      const nodeList = document.querySelectorAll('a[name]');
      if (nodeList.length !== 0) {
        nodeList.forEach((node) => {
          anchors.push(node);
        })
      }
    }
    return anchors;
  }

  hasAnchors () {
    return !!this.getAnchors() && this.getAnchors().length !== 0;
  }

  mountAnchors () {
    setTimeout(() => {
      if (this.hasAnchors()) {
        try {
          document.querySelector('.article-anchors').style.opacity = "1";
        } catch (err) {
          console.log('Couldnt show article anchors', err)
        }
        this.setState({ 
          ...this.state, 
          anchors: this.getAnchors() 
        })
      }
    }, 3000)
  }

  componentDidMount () {
    this.mountAnchors();
  }

  isBlogPost () {
    return this.props.templateKey === "blog-post";
  }

  getImage () {
    if (this.isBlogPost()) {
      const iconAndBanner = getCategoryIconAndBanner(this.props.category)
      return iconAndBanner.banner;
    } else {
      return this.props.image;
    }
  }
  
  render () {
    const props = this.props;
    const { 
      title, 
      html, 
      date, 
      category, 
      readingTime, 
      tags, 
      description, 
      slug, 
      anchormessage,
      comments,
      tableOfContents
    } = props;
    const fullUrl = `https://khalilstemmler.com${slug}`;
    const anchors = this.hasAnchors() ? this.getAnchors() : [];
    const image = this.getImage();
    
    return (
      <section className="article-container">
        <h1 className="article-title">{title}</h1>
        <ArticleAnchors 
          toc={tableOfContents} 
          message={anchormessage} 
          anchors={anchors}
        />
        <ArticleCategory category={category}/>
        <ArticleDescription 
          description={description}/>
        <Tags 
          tags={tags}/>
        {/* <AuthorCredit 
          author={Authors.khalil}/> */}
        
        <br/>
        <img src={image}/>
        <div id="html-wrapper">
          <HTMLContent content={html}/>
        </div>

        <hr/>
        <br/>

        <h3>Discussion</h3>
        <p>Liked this? Sing it loud and proud 👨‍🎤.</p>
        <ShareButtons
          url={fullUrl}
          title={title}
        />
        <br/>

        <Comments comments={comments}/>
        <br/>

        <h3>Stay in touch!</h3>
        <SubscribeForm/>
        <br/>
        <br/>
        <AboutTheAuthor {...Authors.khalil}/>
        
        <p>View more in <Link to={`/articles/categories/${kebabCase(category)}`}>{category}</Link></p>
        
        <br/>
        <a href="https://solidbook.io">
          <img src="/img/resources/solid-book/book-banner.png"/>
        </a>
        <hr/>
        <h2>You may also enjoy...</h2>
        <p>A few more related articles</p>
        <SimilarArticles category={category} tags={tags} currentArticleSlug={slug}/>

        {/* <HorizonalAd/> */}
      </section>
    )
  }
}

export default Article;

Article.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  date: PropTypes.string.isRequired,
  category: PropTypes.string,
  description: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  html: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.any)
}