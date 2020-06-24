import React, { useEffect, useState } from 'react'
import "../styles/ArticleAnchors.sass"

function ArticleAnchors (props) {
  const [scrollPercent, setScrollPercent] = useState(0)
  const { message, toc } = props;

  useEffect(() => {
    const onScroll = () => {
        var h = document.documentElement, 
            b = document.getElementById('html-wrapper'),
            st = 'scrollTop',
            sh = 'scrollHeight';

        
        var docElementScrollTop = h[st];

        var htmlScrollHeight = b[sh];

        setScrollPercent(
          (docElementScrollTop - h.clientHeight) / htmlScrollHeight * 100
        );
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);

  }, [scrollPercent]);
  
  return (
    <div style={{ opacity: toc && toc.length === 0 ? 0 : 1}} 
      className="article-anchors">
      <div 
        className="message" 
        dangerouslySetInnerHTML={{ __html: message}}></div>
      { toc && toc.map((content, i) => (
        <a className="anchor-link" href={`#${content.id}`} key={i}>{content.name}</a>
      ))}
      <div className="read-status">
        <div style={{ width: `${scrollPercent}%` }} className="read-status-progress"></div>
      </div>
    </div>
  )
}

export default ArticleAnchors;