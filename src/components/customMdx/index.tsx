import * as React from 'react'
import SwitchTech from './switchTech'
import CodeBlock from './codeBlock'
import TabbedContent from './tabbedContent'
import ParallelBlocks from './parallelBlocks'
import CodeWithResult from './codeWithResult'
// import Code from './code'
import CollapseBox from './collapsible'
import Table from './table'
import ButtonLink from './button'
import FileWithIcon from './fileWithIcon'
import Subsections from './subSections'
import TopBlock from './topBlock'
import FootNote from './footnote'
import Admonition from './admonition'
import Quiz from './quiz'
import Tip from './tip'
import NavigationLinksContainer from './navigationLinksContainer'

export default {
  h1: () => <h1 style={{ display: 'none' }} />,
  h2: ({ id, ...props }: any) => <h2 id={id.replace(/inlinecode/g, '')} {...props} />,
  h3: ({ id, ...props }: any) => <h3 id={id.replace(/inlinecode/g, '')} {...props} />,
  h4: ({ id, ...props }: any) => <h4 id={id.replace(/inlinecode/g, '')} {...props} />,
  a: ({ href, ...props }: any) => (
    <a href={href ? href.replace(/inlinecode/g, '') : ''} {...props} />
  ),
  p: (props: any) => <p className="paragraph" {...props} />,
  ul: (props: any) => <ul className="list" {...props} />,
  ol: (props: any) => <ol className="o-list" {...props} />,
  CodeBlock,
  TabbedContent,
  ParallelBlocks,
  CodeWithResult,
  SwitchTech,
  FileWithIcon,
  inlineCode: (props: any) => <code className="inline-code" {...props} />,
  // code: Code,
  details: CollapseBox,
  table: Table,
  ButtonLink,
  Subsections,
  TopBlock,
  FootNote,
  Admonition,
  img: (props: any) => (
    <a href={props.src} target="_blank">
      <img {...props} />
    </a>
  ),
  AlgoliaTerm: () => <span style={{ display: 'none' }} />,
  Quiz,
  Tip: (props: any) => <Tip>{props.children}</Tip>,
  NavigationLinksContainer: (props: any) => (
    <NavigationLinksContainer {...props}>{props.children}</NavigationLinksContainer>
  ),
}
