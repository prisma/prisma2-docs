import * as React from 'react'
import styled from 'styled-components'

interface CodeProps {
  tabs?: any[]
}

type CodeBlockProps = CodeProps & React.ReactNode

const TabbedContent = ({ tabs, children }: CodeBlockProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const tabContent =
    children &&
    children.filter((child: any) => child.props && child.props.originalType === 'tab')[activeIndex]
  return (
    <Wrapper>
      {tabs && Array.isArray(tabs) && (
        <Tabs>
          {tabs.map((tab: any, index: number) => {
            const setCurrentActive = () => setActiveIndex(index)
            return (
              <div
                className={`tabHeading ${index === activeIndex ? 'active' : ''}`}
                key={index}
                data-index={`${index}`}
                onClick={setCurrentActive}
              >
                {tab}
              </div>
            )
          })}
        </Tabs>
      )}
      {tabContent}
    </Wrapper>
  )
}

export default TabbedContent

const Tabs = styled.div`
  display: flex;
  .tabHeading {
    margin-right: 10px;
    font-weight: 600;
    color: ${p => p.theme.colors.gray600};
    cursor: pointer;
    font-size: ${p => p.theme.fontSizes[14]};
    display: flex;
    align-items: center;
    padding: 3px 5px;
    svg {
      margin-right: ${p => p.theme.space[8]};
    }
  }

  .tabHeading.active {
    color: ${p => p.theme.colors.gray900};
    background: ${p => p.theme.colors.gray100};
    border-radius: ${p => p.theme.radii.small};
    svg path {
      stroke: ${p => p.theme.colors.gray600};
    }
  }
`
const Wrapper = styled.div`
  margin-top: ${p => p.theme.space[24]};
  position: relative;
  font-size: ${p => p.theme.fontSizes[14]};

  tab pre > * {
    margin-top: 0.5em;
  }
`
