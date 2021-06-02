import * as React from 'react'
import { Snippet } from 'react-instantsearch-dom'
import Link from '../link'
import styled from 'styled-components'
import ParentTitle from '../parentTitleComp'

const HitComp = styled.div`
  padding: ${p => p.theme.space[24]} ${p => p.theme.space[40]} !important;
  font-family: ${p => p.theme.fonts.text};
  font-style: normal;
  font-weight: normal;
  font-size: ${p => p.theme.fontSizes[16]};
  line-height: ${p => p.theme.space[24]};
  border-bottom: 1px solid ${p => p.theme.colors.gray300};
  // max-height: 150px;
  &:last-item {
    border: 0;
  }
  a {
    color: ${p => p.theme.colors.gray900} !important;
    display: block;
  }
  h4 {
    font-weight: normal;
  }
  h3 {
    font-weight: 600;
    line-height: 28px;
    letter-spacing: -0.01em;
    margin: 10px 0;
  }
  &:hover,
  &:focus {
    background: ${p => p.theme.colors.gray100};
  }
  mark {
    color: ${p => p.theme.colors.blue600} !important;
    background: #ebf8ff;
    padding: 2px;
    font-weight: bold;
  }

  .more {
    color: ${p => p.theme.colors.blue600};
    font-size: ${p => p.theme.fontSizes[14]};
    width: fit-content;
    margin: 10px 0 0;
  }

  @media (min-width: 0px) and (max-width: ${p => p.theme.breakpoints.tablet}) {
    max-height: fit-content;
    padding: ${p => p.theme.space[24]} !important;
  }
`

const DocHit = ({ hit, selected }: any) =>
  hit._distinctSeqID == 0 ? (
    <HitComp style={{ background: selected ? '#F7FAFC' : 'white' }}>
      <Link style={{ boxShadow: `none`, textDecoration: 'none' }} to={hit.path}>
        <ParentTitle slug={hit.slug} nonLink={true} />
        <h3>
          <Snippet hit={hit} attribute="title" tagName="mark" /> /{' '}
          <span style={{ color: 'var(--code-inner-color)' }}>
            <Snippet hit={hit} attribute="heading" tagName="mark" />
          </span>
        </h3>
        <Snippet hit={hit} attribute="content" tagName="mark" />
        {hit.moreCount > 1 && <p className="more">... More results on this page</p>}
      </Link>
    </HitComp>
  ) : null

export default DocHit
