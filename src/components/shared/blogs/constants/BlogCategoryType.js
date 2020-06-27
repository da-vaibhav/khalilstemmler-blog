
import typeScriptIcon from '../../../../images/blogs/icons/typescript.svg';
import typeScriptBanner from '../../../../images/blogs/banners/typescript-blog-banner.png';

import dddIcon from '../../../../images/blogs/icons/ddd.svg';
import dddBanner from '../../../../images/blogs/banners/ddd-blog-banner.png';

import mysteryIcon from '../../../../images/icons/mystery-icon.svg'
import mysteryBanner from '../../../../images/blogs/banners/misc-banner.png';

import graphQLIcon from '../../../../images/blogs/icons/graphql.svg';
import graphQLBanner from '../../../../images/blogs/banners/graphql-banner.png';

import sequelizeIcon from '../../../../images/blogs/icons/sequelize.png';
import sequelizeBanner from '../../../../images/blogs/banners/sequelize-banner.png';

import toolingIcon from '../../../../images/blogs/icons/tooling-icon.png';
import toolingBanner from '../../../../images/blogs/banners/tooling-banner.png'

import serverlessIcon from '../../../../images/blogs/icons/serverless-icon.png';
import serverlessBanner from '../../../../images/blogs/banners/serverless-banner.png'

export const BlogCategoryType = {
  'TypeScript': {
    icon: typeScriptIcon,
    banner: typeScriptBanner
  },
  'Domain-Driven Design': {
    icon: dddIcon,
    banner: dddBanner
  },
  'Sequelize': {
    icon: sequelizeIcon,
    banner: sequelizeBanner
  },
  'GraphQL': {
    icon: graphQLIcon,
    banner: graphQLBanner
  },
  'Tooling': {
    icon: toolingIcon,
    banner: toolingBanner,
  },
  'Serverless': {
    icon: serverlessIcon,
    banner: serverlessBanner,
  },
  Fallback: {
    icon: mysteryIcon,
    banner: mysteryBanner
  }
}