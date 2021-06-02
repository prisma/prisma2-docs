import * as React from 'react'
import styled from 'styled-components'
import { stringify } from '../utils/stringify'

const ChapterTitle = styled.div`
  font-family: ${p => p.theme.fonts.text};
  font-style: normal;
  font-weight: bold;
  font-size: ${p => p.theme.fontSizes[14]};
  line-height: 100%;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.gray900} !important;
  margin: ${p => p.theme.space[16]} 0 0;
`

const TOCList = styled.ul`
  padding: 0 0 1em;
  list-style-type: none;
  margin: 0;
  li {
    font-size: ${p => p.theme.fontSizes[14]};
    padding: ${p => p.theme.space[16]} 0 0;
    line-height: 19px;

    ul {
      margin-left: ${p => p.theme.space[12]};
    }
    a {
      text-decoration: none;
      color: ${p => p.theme.colors.gray600} !important;
      &:hover {
        color: ${p => p.theme.colors.gray900} !important;
      }
    }
  }
`

const TOCContainer = styled.div`
  position: sticky;
  top: 10px;
`

const TOC = ({ headings, tocDepth }: any) => {
  const navItems = (headings: any[], depth: number) => {
    return (
      <TOCList>
        {headings &&
          headings.map((heading: any, index: number) => (
            <li key={index}>
              <a
                href={heading.url.replace(/inlinecode/g, '')}
                dangerouslySetInnerHTML={{ __html: stringify(heading.title) }}
              />
              {heading.items &&
                heading.items.length > 0 &&
                depth > 1 &&
                navItems(heading.items, depth - 1)}
            </li>
          ))}
      </TOCList>
    )
  }
  return navItems && navItems.length ? (
    <TOCContainer>
      <ChapterTitle>CONTENT</ChapterTitle>
      {navItems(headings, tocDepth || 1)}
    </TOCContainer>
  ) : null
}

export default TOC
