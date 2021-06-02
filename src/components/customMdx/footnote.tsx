import * as React from 'react'
import styled from 'styled-components'

type FootNoteProps = React.ReactNode

const FootNote = ({ children, ...props }: FootNoteProps) => {
  return <FootNoteWrapper {...props}>{children}</FootNoteWrapper>
}

export default FootNote

const FootNoteWrapper = styled.div`
  * {
    font-size: 0.9em;
    font-style: italic;
  }
`
