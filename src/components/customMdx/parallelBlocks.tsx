import * as React from 'react'
import styled from 'styled-components'

type CodeBlockProps = React.ReactNode

const ParallelBlocks = ({ children }: CodeBlockProps) => {
  const blockContent =
    children && children.filter((child: any) => child.props && child.props.originalType === 'block')
  return (
    <Wrapper>
      {blockContent.map((block: any, i: number) => (
        <Block key={i}>
          <div className="blockHeading">{block.props.content}</div>
          <div className="blockContent">{block.props.children}</div>
        </Block>
      ))}
    </Wrapper>
  )
}

export default ParallelBlocks

const Block = styled.div`
  flex: 1 1 0px;
  margin-right: 0.5rem;
  &:last-of-type {
    margin: 0;
  }
  .blockHeading {
    font-weight: 600;
    font-size: ${p => p.theme.fontSizes[14]};
    svg {
      margin-right: ${p => p.theme.space[8]};
    }
  }

  .blockContent {
    height: calc(100% - 2em);

    .pre-highlight,
    pre {
      height: 100%;
    }
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) and (min-width: 0px) {
    .pre-highlight {
      margin: 0;
    }
    &:first-of-type .pre-highlight {
      margin-right: 0;
      margin-left: -${p => p.theme.space[24]};
    }
    &:last-of-type .pre-highlight {
      margin-left: 0;
      margin-right: -${p => p.theme.space[24]};
    }
  }
`
const Wrapper = styled.div`
  display: flex;
  margin-top: ${p => p.theme.space[32]};
`
