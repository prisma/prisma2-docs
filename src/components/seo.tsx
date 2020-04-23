import * as React from 'react'
import { Helmet } from 'react-helmet'
import favicon from '../images/favicon-32x32.png'
import { useStaticQuery, graphql } from 'gatsby'
import { urlGenerator } from '../utils/urlGenerator'
import { useLocation } from '@reach/router'

type SEOProps = {
  title?: string
  description?: string
  keywords?: string
  slug?: string
}

const SEO = ({ title, description, keywords, slug }: SEOProps) => {
  const location = useLocation()
  const [pathTechParams] = location.pathname.split('/').splice(-1)
  const { site, allSitePage } = useStaticQuery(query)
  const {
    siteMetadata: {
      pathPrefix,
      siteUrl,
      twitter: { site: tSite, creator: tCreator, image: tUrl },
      og: {
        site_name: oSite,
        type: oType,
        image: { alt: oImgAlt, url: oUrl, type: oImgType, width: oImgWidth, height: oImgHeight },
      },
    },
  } = site

  const currentPage = allSitePage.edges.find(
    (page: any) => page.node.path.split('/').splice(-1)[0] === pathTechParams
  )

  const seoTitle =
    currentPage && currentPage.node.context ? currentPage.node.context.seoTitle : title

  let canonicalUrl = pathPrefix ? siteUrl + pathPrefix : siteUrl
  canonicalUrl = slug ? canonicalUrl + urlGenerator(slug) : canonicalUrl

  return (
    <Helmet>
      {/* <meta charSet="utf-8" /> */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
      <title>{seoTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={tSite} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={tCreator} />
      <meta name="twitter:image" content={`${siteUrl + pathPrefix}${tUrl}`} />
      {/* Open Graph */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={oSite} />
      <meta property="og:type" content={oType} />
      <meta property="og:image" content={`${siteUrl + pathPrefix}${oUrl}`} />
      <meta property="og:image:alt" content={oImgAlt} />
      <meta property="og:image:type" content={oImgType} />
      <meta property="og:image:width" content={oImgWidth} />
      <meta property="og:image:height" content={oImgHeight} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href={favicon} />
    </Helmet>
  )
}

export default SEO

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        pathPrefix
        siteUrl
        twitter {
          site
          creator
          image
        }
        og {
          site_name
          type
          image {
            url
            alt
            type
            height
            width
          }
        }
      }
    }
    allSitePage {
      edges {
        node {
          context {
            seoTitle
          }
          path
        }
      }
    }
  }
`
