import * as React from 'react'
import Tree from './tree'
import styled from 'styled-components'
import { useAllArticlesQuery } from '../../hooks/useAllArticlesQuery'
import { AllArticles } from '../../interfaces/AllArticles.interface'
import config from '../../../config'

const SidebarContainer = styled.aside`
  width: 272px;
  height: 100%;
  margin: 0px ${p => p.theme.space[16]} 0 -${p => p.theme.space[16]};
`

const Sidebar = styled.div`
  margin: 0;
  overflow: auto;
  height: auto;

  /* .tablet-only {
    display: none;
    background: ${p => p.theme.colors.gray100};
    justify-content: space-between;
    padding: ${p => p.theme.space[48]} ${p => p.theme.space[64]};

    > ul {
      width: 50%;
      margin-right: 50px;

      &:last-of-type {
        padding-left: ${p => p.theme.space[40]};
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      display: flex;
    }
  } */

  .mobile-only {
    display: none;
    background: ${p => p.theme.colors.gray100};
    padding: ${p => p.theme.space[32]};
    @media only screen and (max-width: 1024px) {
      display: flex;
      > ul {
        width: 100%;
      }
    }
  }
`

const List = styled.ul`
  list-style: none;
  padding: 0 7px 0 ${p => p.theme.space[16]};
  margin: -${p => p.theme.space[20]} 0 0;
`

const SidebarLayout = ({ isMobile, location, slug }: any) => {
  const { allMdx }: AllArticles = useAllArticlesQuery()
  const bucketName =
    location && location.state && location.state.bucketName ? location.state.bucketName : '/'
  let bucketEdges = allMdx.edges?.filter(edge => edge.node.fields.slug.includes(bucketName))

  const bucketNames = config.header.secondLevelHeaderMenuItems.map((item: any) => item.bucketName)

  if (slug) {
    const slugBucketPart = `/${slug.split('/')[1]}`
    const selectedBucket = bucketNames.filter((bn: any) => bn === slugBucketPart)[0]
    if (selectedBucket) {
      bucketEdges = allMdx.edges?.filter(edge => edge.node.fields.slug.includes(selectedBucket))
    }
  }

  if (!isMobile && slug === '/') {
    bucketEdges = []
  }
  return !isMobile ? (
    <SidebarContainer>
      <Sidebar id="sidebar-container">
        <List>
          <Tree edges={bucketEdges} />
        </List>
      </Sidebar>
    </SidebarContainer>
  ) : (
    <Sidebar>
      <div className="mobile-only">
        <List>
          <Tree edges={bucketEdges} />
        </List>
      </div>
    </Sidebar>
  )
}

export default SidebarLayout
