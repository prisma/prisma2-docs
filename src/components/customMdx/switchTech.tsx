import * as React from 'react'
import styled from 'styled-components'

interface CodeProps {
  technologies?: string[]
}

type CodeBlockProps = CodeProps & React.ReactNode

const SwitchTech = ({ technologies, children }: CodeBlockProps) => {
  return <SwitchWrapper id={`techswitch-${technologies.join('-')}`}>{children}</SwitchWrapper>
}

export default SwitchTech

const SwitchWrapper = styled.section`
  display: none;
  position: relative;
  &.show {
    display: block;
  }
`
