require('dotenv').config({
  path: `.env`,
})

const flat = (array) => {
  var result = []
  array.forEach(function (a) {
    result.push(a)
    if (Array.isArray(a.items)) {
      result = result.concat(flat(a.items))
    }
  })
  return result
}

const removeInlineCode = (heading, path) =>
  path
    ? heading.replace(/inlinecode/g, '')
    : heading.replace('<inlinecode>', '').replace('</inlinecode>', '')

const isApiTerm = (term) => term.includes('AlgoliaTerm') && term.split('"')[1] === 'apiReference'
const getApiVal = (term) => term.split('"')[3]

const handleRawBody = (node) => {
  const { rawBody, ...rest } = node
  const rawBodyWithoutFrontmatter = rawBody.split('---').slice(2).join('---')
  const blocks = rawBodyWithoutFrontmatter.split(/#{2,}/i)
  const headingWithcontent = blocks
    .filter((block) => block !== '\n\n')
    .map((block) => {
      const parts = block.split('\n\n')
      return { heading: parts[0].trim(), content: parts.splice(1).join('\n\n') }
    })
  let finalSections = []
  headingWithcontent.map((fSec) => {
    const sections = fSec.content.split('\n\n')
    const filteredSections = sections.filter(
      (section) =>
        section !== ' ' &&
        section !== '' &&
        !section.includes('details>') &&
        !section.includes('TopBlock>') &&
        !section.includes('<ButtonLink') &&
        !section.includes('SwitchTech>') &&
        !section.includes('TabbedContent') &&
        !section.includes('FileWithIcon') &&
        !section.includes('ParallelBlocks>') &&
        !section.includes('CodeWithResult>') &&
        !section.includes('CodeBlock') &&
        !section.includes('tab>') &&
        !section.includes('block>') &&
        !section.includes('ParallelBlocks>') &&
        !section.includes('cmdResult>') &&
        !section.includes('<Subsections') &&
        !section.includes('cmd>') &&
        !section.includes('<!-- prettier-ignore -->')
    )
    filteredSections.map(
      (para) =>
        (para !== '\n' || para !== '\n\n' || para !== '' || para !== ' ') &&
        finalSections.push({ para, heading: fSec.heading })
    )
  })

  const getTitlePath = (fSection) => {
    const tocItem =
      rest.tableOfContents &&
      rest.tableOfContents.items &&
      flat(rest.tableOfContents.items).find((t) => t.title === fSection.heading.replace(/`/g, ''))
    return tocItem ? removeInlineCode(tocItem.url, true) : ''
  }

  const techParams = `${
    rest.langSwitcher ? `${rest.langSwitcher[0]}${rest.dbSwitcher ? '-' : ''}` : ''
  }${rest.dbSwitcher ? `${rest.dbSwitcher[0]}` : ''}`

  const records = finalSections.map((fSection, index) => ({
    id: index,
    objectID: rest.objectID,
    title: rest.title,
    slug: rest.modSlug,
    apiReference: isApiTerm(fSection.para) ? getApiVal(fSection.para) : null,
    heading: removeInlineCode(fSection.heading),
    content: isApiTerm(fSection.para)
      ? finalSections[index + 1].para
      : fSection.para.replace(/\s+[\/\n/{\}\|\/|:\<\>\[\]]+/g, ' ').trim(),
    path: `${rest.modSlug.replace(/\d{2,}-/g, '')}${
      techParams ? '-' + techParams : ''
    }${getTitlePath(fSection)}`,
  }))

  return records
}

const unnestFrontmatter = (node) => {
  const { fields, frontmatter, ...rest } = node

  return {
    ...fields,
    ...frontmatter,
    ...rest,
  }
}

const settings = {
  searchableAttributes: ['apiReference', 'title', 'heading', 'content'],
  attributesToHighlight: ['title', 'heading', 'content'],
  attributesToSnippet: ['title:20', 'heading:20', 'content:25'],
  hitsPerPage: 20,
  attributeForDistinct: 'slug',
  distinct: 2,
  separatorsToIndex: '!#()[]{}*+-_一,:;<>?@/^|%&~£¥$§€†‡',
}

const queries = [
  {
    query: `
        {
          allMdx {
            edges {
              node {
                rawBody
                id
                fields {
                  slug
                  modSlug
                }
                frontmatter {
                  title
                  langSwitcher
                  dbSwitcher
                }
                tableOfContents
              }
            }
          }
        }
      `,
    transformer: ({ data }) =>
      data.allMdx.edges
        .map((edge) => edge.node)
        .map(unnestFrontmatter)
        .map(handleRawBody)
        .reduce((acc, cur) => [...acc, ...cur], []),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    settings,
  },
]

module.exports = {
  appId: process.env.GATSBY_ALGOLIA_APP_ID,
  apiKey: process.env.GATSBY_ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
  queries,
}
