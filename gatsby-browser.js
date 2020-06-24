require("./src/assets/styles/global.sass");
require('rodal/lib/rodal.css')
const React = require("react")
const bugsnag = require('@bugsnag/js')
const bugsnagReact = require('@bugsnag/plugin-react')

const ReactGA = require('react-ga')

require('./static/scripts/amplitude')
const domain = 'khalilstemmler.com'
let id = 'NOPE'

const isProd = document.location.hostname.indexOf(domain) !== -1;

if (isProd) {
  id = 'UA-75700925-1'
  console.log('[Site]: Google Analytics started in prod.')
  require('./static/scripts/hotjar')
} else {
  console.log('[Site]: Google Analytics not started.')
}

ReactGA.initialize(id)

exports.onRouteUpdate = ({ location, prevLocation }) => {
  ReactGA.pageview(location.pathname + location.search + location.hash)
}

function loadScript (src) {
  return new Promise(function(resolve, reject){
    var script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function () {
      resolve();
    });
    script.addEventListener('error', function (e) {
      reject(e);
    });
    document.body.appendChild(script);
  })
};
// Promise Interface can ensure load the script only once.
loadScript('https://platform.twitter.com/widgets.js');


const bugsnagClient = bugsnag('6ebb797b32abf0914738a154bea1971b')
bugsnagClient.use(bugsnagReact, React)

// wrap your entire app tree in the ErrorBoundary provided
const ErrorBoundary = bugsnagClient.getPlugin('react')

function showQuizAnswer (id) {
  try {
    document.getElementById(id).style.display = 'block';
  } catch (err) {
    console.log(err);
  }
}

window.showQuizAnswer = showQuizAnswer;

exports.wrapRootElement = ({ element }) => (
  <ErrorBoundary>
    {element}
  </ErrorBoundary>
);


function toggleExpandableSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const isVisible = el.classList.contains('visible');

    if (isVisible) {
      el.classList.remove('visible');
    } else {
      el.classList.add('visible');
    }
  }
}

// exports.onInitialClientRender = (_, pluginOptions) => { 
//   let offsetY = 0;
  
//   console.log(pluginOptions)
//   if (pluginOptions.offsetY) { 
//     debugger;
//     offsetY = pluginOptions.offsetY 
//   } 

//   const getTargetOffset = hash => {
//     const id = window.decodeURI(hash.replace(`#`, ``))
//     if (id !== ``) {
//       const element = document.getElementById(id)
//       if (element) {
//         let scrollTop =
//           window.pageYOffset ||
//           document.documentElement.scrollTop ||
//           document.body.scrollTop
//         let clientTop =
//           document.documentElement.clientTop || document.body.clientTop || 0
//         let computedStyles = window.getComputedStyle(element)
//         let scrollMarginTop =
//           computedStyles.getPropertyValue(`scroll-margin-top`) ||
//           computedStyles.getPropertyValue(`scroll-snap-margin-top`) ||
//           `0px`
  
//         return (
//           element.getBoundingClientRect().top +
//           scrollTop -
//           parseInt(scrollMarginTop, 10) -
//           clientTop -
//           offsetY
//         )
//       }
//     }
//     return null
//   }
 
//   requestAnimationFrame(() => { 
//     const offset = getTargetOffset(window.location.hash) 
//     if (offset !== null) { 
//       window.scrollTo(0, offset) 
//     } 
//   }) 
// } 

window.toggleExpandableSection = toggleExpandableSection;

window.onhashchange = function () {
  let hashElements = window.location.hash.split("#");

  if (hashElements.length >= 2) {
    
     let element = document.getElementById(hashElements[1]);

      if (element) {
        window.scrollTo(0, element.offsetTop - 120)
      }
  }  
}
