const config = require('./config')
require('dotenv').config()

const gatsbyRemarkPlugins = [
  'gatsby-remark-sectionize',
  {
    resolve: `gatsby-remark-autolink-headers`,
    options: {
      icon: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 6.33337H15.5" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 11.6666H15.5" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.75 1L5 17" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 1L10.25 17" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`,
      className: `title-link`,
      enableCustomId: true,
    },
  },
  {
    resolve: `gatsby-remark-images`,
    options: {
      disableBgImageOnAlpha: true,
    },
  },
  {
    resolve: require.resolve('./plugins/gatsby-remark-to-absoluteurl'),
    options: {
      redirects: config.redirects,
    },
  },
  {
    resolve: require.resolve('./plugins/gatsby-remark-check-links-numberless'),
  },
  {
    resolve: 'gatsby-remark-copy-linked-files',
    options: {
      destinationDir: 'static',
    },
  },
  {
    resolve: 'gatsby-remark-shiki-twoslash',
    options: {
      theme: 'slack-theme-ochin',
    },
  },
]
const algoliaPlugin = {
  resolve: `gatsby-plugin-algolia`,
  options: require(`./src/utils/algolia`),
}

let plugins = [
  'gatsby-plugin-react-helmet',
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  'gatsby-plugin-typescript',
  'gatsby-image',
  'gatsby-plugin-styled-components',
  'gatsby-plugin-smoothscroll',
  'gatsby-plugin-catch-links',
  // {
  //   resolve: `gatsby-plugin-layout`,
  //   options: {
  //     component: require.resolve(`./src/layouts/articleLayout.tsx`),
  //   },
  // },
  {
    resolve: `gatsby-plugin-sitemap`,
    options: {
      sitemapSize: 5000,
      exclude: [
        // Remove these from sitemap for SEO purposes as they're redirected
        `/getting-started/quickstart`,
        `/getting-started/setup-prisma/add-to-existing-project`,
        `/getting-started/setup-prisma/start-from-scratch-prisma-migrate`,
        `/getting-started/setup-prisma/start-from-scratch-sql`,
      ],
    },
  },
  {
    resolve: 'gatsby-plugin-robots-txt',
    options: {
      policy: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    },
  },
  // 'gatsby-plugin-offline', // it causes infinite loop issue with workbox
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      defaultLayouts: {
        default: require.resolve('./src/layouts/articleLayout.tsx'),
      },
      extensions: ['.mdx', '.md'],
      gatsbyRemarkPlugins,
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'docs',
      path: `${__dirname}/content`,
      ignore: ['**/.tsx*'],
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: `${__dirname}/src/images`,
    },
  },
  'gatsby-plugin-remove-trailing-slashes',
  'gatsby-plugin-meta-redirect',
  'gatsby-plugin-page-list',
  {
    resolve: 'gatsby-plugin-google-tagmanager',
    options: {
      id: 'GTM-KCGZPWB',
      includeInDevelopment: false,
      defaultDataLayer: { website: 'docs' },
    },
  },
]

//if (process.env.INDEX_ALGOLIA === 'true') {
plugins = [...plugins, algoliaPlugin]
//}

module.exports = {
  // The line below has been disabled so that both PR previews and production use the same paths
  // pathPrefix: process.env.ADD_PREFIX === 'true' ? config.gatsby.pathPrefix : '/',
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    pathPrefix: config.gatsby.pathPrefix,
    title: config.siteMetadata.title,
    titlePrefix: config.gatsby.titlePrefix,
    titleSuffix: config.gatsby.titleSuffix,
    description: config.siteMetadata.description,
    keywords: config.siteMetadata.keywords,
    twitter: config.siteMetadata.twitter,
    og: config.siteMetadata.og,
    header: config.header,
    siteUrl: config.gatsby.siteUrl,
    footer: config.footer,
    docsLocation: config.siteMetadata.docsLocation,
    redirects: config.redirects,
    homepage: config.homepage,
  },
  plugins,
}
