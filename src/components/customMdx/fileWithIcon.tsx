import * as React from 'react'
import styled from 'styled-components'
import File from '../../icons/File'
import Display from '../../icons/Display'
import Code from '../../icons/Code'
import Database from '../../icons/Database'
import Prisma from '../../icons/Prisma'

interface FileWithIconProps {
  text: string[]
  icon: keyof typeof icons
}

const icons = {
  file: <File />,
  database: <Database />,
  display: <Display />,
  code: <Code />,
  prisma: <Prisma />,
}
const FileNameWrapper = styled.span`
  color: inherit;
  display: inline-flex;
  align-items: center;
  svg {
    margin-right: ${p => p.theme.space[8]};
  }
  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    font-size: ${p => p.theme.fontSizes[14]};
  }
`

const FileWithIcon = ({ icon, text }: FileWithIconProps) => (
  <FileNameWrapper>
    {icons[icon]}
    {text}
  </FileNameWrapper>
)

export default FileWithIcon
