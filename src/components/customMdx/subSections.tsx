import Link from '../link'
import * as React from 'react'
import { calculateTreeData } from '../../utils/treeData'
import { AllArticles } from '../../interfaces/AllArticles.interface'
import { useAllArticlesQuery } from '../../hooks/useAllArticlesQuery'
import { useLocation } from '@reach/router'
import styled from 'styled-components'
import { withPrefix } from 'gatsby'

interface SubsecProps {
  depth?: number
  rootPath?: string
}

const SubsectionWrapper = styled.div`
  margin: 1.5rem 0;
`

const Subsections = ({ depth, rootPath }: SubsecProps) => {
  const { allMdx }: AllArticles = useAllArticlesQuery()
  const location = useLocation()
  const treeData = calculateTreeData(allMdx.edges, null, null)
  let subSecs: any[] = []

  const getSubSecs = (currentPath: string, treeItems: any[]): any => {
    for (let i = 0; i < treeItems.length; i++) {
      const tree = treeItems[i]
      if (
        !(
          withPrefix(tree.url) ===
            `${currentPath.substr(-1) === '/' ? currentPath.slice(0, -1) : currentPath}` &&
          tree.label !== 'index'
        )
      ) {
        getSubSecs(currentPath, tree.items)
      } else {
        subSecs = tree.items
        return
      }
    }
  }

  getSubSecs(rootPath ? rootPath : location.pathname, treeData.items)

  const list = (subsecs: any, dep: number) => {
    const titleHasNumber = /\d./

    const sortOnTitleNumbers = (a: any, b: any) => {
      if (a.title < b.title) {
        return -1
      }
      if (a.title > b.title) {
        return 1
      }
      return 0
    }

    const sortOnLabel = (a: any, b: any) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    }

    const subs = subsecs.filter((t: any) => t.label !== 'index' && !t.hidePage).sort(sortOnLabel)

    // If the first title has a number (1.) then we can assume the rest to do.
    if (subs && subs[0] && titleHasNumber.test(subs[0].title)) {
      subs.sort(sortOnTitleNumbers)
    }
    return (
      <ul className="list">
        {subs.map((sec: any, index: number) => (
          <li key={index}>
            <Link to={sec.url}>
              <span className={`${sec.codeStyle ? 'inline-code' : ''}`}>{sec.title}</span>
            </Link>
            {dep > 1 && sec.items.length > 0 && list(sec.items, dep - 1)}
          </li>
        ))}
      </ul>
    )
  }

  return <SubsectionWrapper>{list(subSecs, depth || 1)}</SubsectionWrapper>
}

export default Subsections
