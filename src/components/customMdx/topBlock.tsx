import * as React from 'react'
import styled from 'styled-components'

type TopBlockProps = React.ReactNode

const TopBlock = ({ children, ...props }: TopBlockProps) => {
  return <TopBlockWrapper {...props}>{children}</TopBlockWrapper>
}

export default TopBlock

const TopBlockWrapper = styled.section`
  /* padding: ${p => p.theme.space[4]} ${p => p.theme.space[40]}; */
`
