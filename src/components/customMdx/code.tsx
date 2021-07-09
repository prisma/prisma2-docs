import * as React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import rangeParser from 'parse-numeric-range'
// import theme from 'prism-react-renderer/themes/github'
import CopyButton from './copy'
import Copy from '../../icons/Copy'
import { stringify } from '../../utils/stringify'
import styled from 'styled-components'
import './prism/index.css'
import FileWithIcon from './fileWithIcon'
require('./prism/prism-prisma')

interface CodeProps {
  copy?: boolean
}

type PreCodeProps = CodeProps & React.ReactNode

const diffBgColorMap: any = {
  '+': 'var(--code-added-bg-color)',
  '-': 'var(--code-deleted-bg-color)',
  '|': 'var(--code-highlight-bg-color)',
  '✎': 'var(--code-edit-bg-color)',
}

const symColorMap: any = {
  '+': 'var(--code-added-color)',
  '-': 'var(--code-deleted-color)',
  '|': 'var(--code-highlight-color)',
  '✎': 'var(--code-highlight-color)',
}

const symbols: any = {
  normal: '|',
  add: '+',
  delete: '-',
  edit: '✎',
}

function cleanTokens(tokens: any[]) {
  const tokensLength = tokens.length
  if (tokensLength === 0) {
    return tokens
  }
  const lastToken = tokens[tokensLength - 1]

  if (lastToken.length === 1 && lastToken[0].empty) {
    return tokens.slice(0, tokensLength - 1)
  }
  return tokens
}

const propList = ['copy', 'bash-symbol', 'terminal', 'no-lines']

const Code = ({ children, className, ...props }: PreCodeProps) => {
  let language = className && className.replace(/language-/, '')
  let breakWords = false

  let diffArray: any = []

  if (props && props.metastring && props.metastring.includes('highlight')) {
    const parts = props.highlight.split('|')
    parts.forEach((part: any) => {
      diffArray = [part.split(';'), ...diffArray]
    })
  }

  if (propList.includes(language)) {
    breakWords = true
  }

  const code = stringify(children)

  const hasCopy = props['copy'] || language === 'copy'
  let hasNoLine = true
  const isTerminal = props['terminal'] || language === 'terminal'
  const hasTerminalSymbol = props['bash-symbol'] || language === 'bash-symbol' || isTerminal
  const fileName = props['file'] || language === 'file'

  if (!fileName) {
    hasNoLine = true
  } else {
    hasNoLine = props['no-lines'] || language === 'no-lines'
  }

  const tokenCopyClass = `${hasCopy ? 'has-copy-button' : ''} ${breakWords ? 'break-words' : ''}`

  return (
    <CodeWrapper className="codeWrapperDiv">
      {fileName && (
        <div className="file">
          <FileWithIcon text={fileName} icon="file" />
        </div>
      )}
      <div className="gatsby-highlight pre-highlight">
        <Highlight {...defaultProps} code={code} language={language}>
          {({ className: blockClassName, style, tokens, getLineProps, getTokenProps }) => (
            <Pre className={`${blockClassName} ${isTerminal ? 'is-terminal' : ''}`} style={style}>
              {(props['copy'] || language === 'copy') && (
                <AbsoluteCopyButton className="copy-button">
                  <CopyButton text={code}>
                    <Copy />
                  </CopyButton>
                </AbsoluteCopyButton>
              )}
              <code>
                {cleanTokens(tokens).map((line: any, i: number) => {
                  let lineClass = {
                    backgroundColor: '',
                    symbColor: '',
                  }

                  let isDiff = false
                  let diffSymbol = ''

                  if (
                    (line[0] &&
                      line[0].content.length &&
                      (line[0].content[0] === '+' ||
                        line[0].content[0] === '-' ||
                        line[0].content[0] === '|' ||
                        line[0].content[0] === '✎')) ||
                    (line[0] &&
                      line[0].content === '' &&
                      line[1] &&
                      (line[1].content === '+' ||
                        line[1].content === '-' ||
                        line[1].content === '|' ||
                        line[1].content === '✎'))
                  ) {
                    diffSymbol =
                      line[0] && line[0].content.length ? line[0].content[0] : line[1].content
                    lineClass = {
                      backgroundColor: diffBgColorMap[diffSymbol],
                      symbColor: symColorMap[diffSymbol],
                    }
                    isDiff = true
                  }

                  if (diffArray.length !== 0) {
                    diffArray.forEach((arr: any) => {
                      if (rangeParser(arr[0]).includes(i + 1)) {
                        diffSymbol = symbols[arr[1]]
                        lineClass = {
                          backgroundColor: diffBgColorMap[diffSymbol],
                          symbColor: symColorMap[diffSymbol],
                        }
                        isDiff = true
                      }
                    })
                  }

                  const lineProps = getLineProps({ line, key: i })

                  lineProps.style = { ...lineClass }

                  return (
                    <Line key={line + i} {...lineProps}>
                      {hasTerminalSymbol && !isDiff && <LineNo className="line-no">$</LineNo>}
                      {!hasTerminalSymbol && !isDiff && !hasNoLine && (
                        <LineNo className="line-no">{i + 1}</LineNo>
                      )}
                      {isDiff && !hasNoLine && (
                        <LineNo className="line-no" style={{ color: lineClass.symbColor }}>
                          {['+', '-', '✎'].includes(diffSymbol) ? diffSymbol : i + 1}
                        </LineNo>
                      )}
                      <LineContent className={`${tokenCopyClass}`}>
                        {line.map((token: any, key: any) => {
                          if (isDiff) {
                            if (
                              (key === 0 || key === 1) &&
                              (token.content.charAt(0) === '+' ||
                                token.content.charAt(0) === '-' ||
                                token.content.charAt(0) === '|' ||
                                token.content.charAt(0) === '✎')
                            ) {
                              return (
                                <span
                                  {...getTokenProps({
                                    token: {
                                      ...token,
                                      content: token.content.slice(1),
                                    },
                                    key,
                                  })}
                                />
                              )
                            }
                          }
                          return <span {...getTokenProps({ token, key })} />
                        })}
                      </LineContent>
                    </Line>
                  )
                })}
              </code>
            </Pre>
          )}
        </Highlight>
      </div>
    </CodeWrapper>
  )
}

export default Code

const CodeWrapper = styled.div`
  margin-top: ${(p) => p.theme.space[24]};
  margin-bottom: ${(p) => p.theme.space[24]};
  .file {
    font-weight: 600;
    color: ${(p) => p.theme.colors.gray600};
    font-size: ${(p) => p.theme.fontSizes[14]};
    font-family: ${(p) => p.theme.fonts.text};
    margin-bottom: 0.5rem;
  }

  overflow: auto;
`

const AbsoluteCopyButton = styled.div`
  transition: opacity 100ms ease;
  position: absolute;
  top: 20px;
  right: 16px;
  z-index: 2;

  > div {
    right: -${(p) => p.theme.space[8]};
    top: -6px;
  }
`

const Pre = styled.pre`
  margin-top: ${(p) => p.theme.space[32]};
  text-align: left;
  margin: 0 0 16px 0;
  padding: 2rem 1rem 1rem 1rem;
  overflow: auto;
  webkit-overflow-scrolling: touch;

  &.shiki {
    overflow: initial;
  }

  &.twoslash {
    border-color: #719af4;
  }
`
const Line = styled.div`
  display: block;
`

const LineNo = styled.span`
  font-weight: 500;
  line-height: ${(p) => p.theme.space[24]};
  color: ${(p) => p.theme.colors.gray400};
  display: inline-block;
  text-align: right;
  user-select: none;
  width: 24px;
`

const LineContent = styled.span`
  padding: 0 ${(p) => p.theme.space[16]};
  &.break-words {
    display: inline-table;
    white-space: break-spaces;
    width: 95%;
  }

  &.token-line {
    line-height: 1.3rem;
    height: 1.3rem;
  }
`
