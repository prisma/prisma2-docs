import * as React from 'react'
import styled from 'styled-components'

interface ExpandedProps {
  expanded?: boolean
}

interface ShowHideProps {
  showText?: string
  hideText?: string
}

type CodeWithResultProps = React.ReactNode & ExpandedProps & ShowHideProps

const CodeWithResult = ({ children, expanded, showText, hideText }: CodeWithResultProps) => {
  const [showResult, setShowResult] = React.useState(expanded)
  const cmd =
    children && children.filter((child: any) => child.props && child.props.mdxType === 'cmd')
  const result =
    children && children.filter((child: any) => child.props && child.props.mdxType === 'cmdResult')

  const toggleResult = () => setShowResult(!showResult)
  const toggleShowText = showText ? showText : 'Show CLI results'
  const toggleHideText = hideText ? hideText : 'Hide CLI results'

  return (
    <Wrapper>
      <div className="cmd">{cmd}</div>
      <div className="result">
        <div onClick={toggleResult} className="show-btn">
          {showResult ? toggleHideText : toggleShowText}
        </div>
        {showResult && <div className="result-code">{result}</div>}
      </div>
    </Wrapper>
  )
}

export default CodeWithResult

const Wrapper = styled.div`
  margin-top: 2rem;
  .cmd .pre-highlight pre {
    border-radius: 8px 8px 0px 0px;
  }

  code {
    padding-bottom: 1em;
  }

  .codeWrapperDiv {
    margin-top: 0;
  }

  .result {
    background-color: var(--main-font-color) !important;
    color: var(--code-inline-bgd-color) !important;
    border-radius: 0px 0px 8px 8px;
    margin-top: -24px;

    pre {
      background-color: var(--main-font-color) !important;
      color: var(--code-inline-bgd-color) !important;

      .token.plain {
        color: var(--code-inline-bgd-color) !important;
      }

      .token.punctuation {
        color: ${p => p.theme.colors.gray500} !important;
      }

      border-radius: 0px 0px 8px 8px;
      margin-top: 0;
    }

    .show-btn {
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 100%;
      letter-spacing: 0.01em;
      color: var(--code-inner-color);
      height: 24px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 1rem;
    }
  }

  @media (min-width: 0px) and (max-width: 767px) {
    margin-left: -24px;
    margin-right: -24px;
    .pre-highlight {
      margin-right: 0;
      margin-left: 0;
    }
  }
`
