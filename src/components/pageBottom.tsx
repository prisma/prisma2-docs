import React, { useState, useCallback, MouseEvent } from 'react'
import styled from 'styled-components'
import Up from '../icons/Up'
import Down from '../icons/Down'
import Link from './link'
import config from '../../config'
import { ButtonWrapper } from './customMdx/button'
import Twitter from '../icons/Twitter'
import { useLocation } from '@reach/router'
import { X } from 'react-feather'
import { theme } from '@prisma/lens/dist/web'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const sentiments: any = {
  unhappy: 'Unhappy',
  happy: 'Happy',
}

const twitterShareUrl = `https://twitter.com/intent/tweet?text=I%27ve%20found%20this%20%40prisma%20docs%20page%20helpful%21%20`

const ToastForm = ({ sentiment, fbId, fbSubmitted }: any) => {
  const currentDocsPageURL = encodeURIComponent(location ? location.href : '/')

  const [feedback, setFeedback] = useState('')
  const handleFeedbackChange = (e: any) => setFeedback(e.target.value)

  const closeForm = (e: any) => toast.dismiss()
  // Optional callback to add textual feedback
  const sendFeedback = async (e: any) => {
    e.preventDefault()
    await fetch(config.feedback.feedbackUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ id: fbId, feedback }),
    })
    fbSubmitted(true)
  }
  return (
    <>
      <Title>
        <p>
          {sentiment !== 'Happy'
            ? `Thank you for letting us know. Any more details about what we could improve?`
            : `Thank you for letting us know! Was there anything you particularly enjoyed?`}
        </p>
        <a onClick={closeForm}>
          <X color={theme.colors.blue300} />
        </a>
      </Title>
      <form>
        <input
          type="text"
          name="feedback"
          placeholder="Type your feedback to the Prisma team"
          onChange={handleFeedbackChange}
          value={feedback}
        />
        <ButtonRow>
          <button onClick={sendFeedback} type="submit">
            Send
          </button>
          {sentiment !== 'Happy' ? (
            <a className="git-link" href={`https://github.com/prisma/docs/issues/new/choose`}>
              Open a Github Issue Instead
            </a>
          ) : (
            <Button type="primary" href={`${twitterShareUrl}${currentDocsPageURL}`}>
              <Twitter /> Tweet about Prisma
            </Button>
          )}
        </ButtonRow>
      </form>
    </>
  )
}

const PageBottom = ({ editDocsPath }: any) => {
  const [submittedFeedback, setSubmittedFeedback] = useState(false)
  const [, setFeedbackId] = useState(null)
  const [submittedSentiment, setSubmittedSentiment] = useState(false)
  const [sentiment, setSentiment] = useState(sentiments['happy'])
  let location = useLocation()
  const pageUrl = location ? location.pathname : '/'
  const closeForm = (e: any) => toast.dismiss()

  const fbSumitted = (state: boolean) => {
    setSubmittedFeedback(state)
    toast.dismiss()
    toast(
      <SuccessToast>
        <span>🎉 </span>
        <p>Message sent! Thank you for making Prisma better for the community.</p>
        <a onClick={closeForm}>
          <X color={theme.colors.blue300} />
        </a>
      </SuccessToast>
    )
  }

  // Send the initial sentiment
  const sendSentiment = useCallback(
    async (sentiment) => {
      const createdSetiment = await fetch(config.feedback.sentimentUrl, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ pageUrl, sentiment }),
      }).then((response) => response.json())

      toast(<ToastForm sentiment={sentiment} fbId={createdSetiment.id} fbSubmitted={fbSumitted} />)

      setFeedbackId(createdSetiment.id)
      setSubmittedSentiment(true)
    },
    [pageUrl, sentiment]
  )

  const handleSentiment = (e: MouseEvent<HTMLButtonElement>) => {
    const selectedSentiment = e.currentTarget.id
    setSentiment(() => {
      const newSentiment = sentiments[selectedSentiment]
      sendSentiment(newSentiment)
      return newSentiment
    })
  }

  return (
    <PageBottomWrapper>
      <Feedback>
        <h4>Was this helpful?</h4>
        <div className="sentiments">
          <button
            id="happy"
            onClick={handleSentiment}
            className={submittedSentiment && sentiment === 'Happy' ? 'active' : ''}
            disabled={submittedSentiment}
          >
            <Up />
          </button>
          <button
            id="unhappy"
            onClick={handleSentiment}
            className={submittedSentiment && sentiment === 'Unhappy' ? 'active' : ''}
            disabled={submittedSentiment}
          >
            <Down />
          </button>
        </div>
      </Feedback>
      <Wrapper>
        <Content>
          {submittedFeedback ? (
            <>
              <ToastContainer
                autoClose={false}
                closeOnClick={false}
                closeButton={false}
                hideProgressBar
                className="yay-container"
                toastClassName="yay-toast"
                position="bottom-right"
                bodyClassName="yay-body"
                limit={1}
              />
            </>
          ) : (
            <ToastContainer
              autoClose={false}
              closeOnClick={false}
              closeButton={false}
              hideProgressBar
              className="feedback-container"
              toastClassName="feedback-toast"
              position="bottom-right"
              bodyClassName="feedback-body"
              limit={1}
            />
          )}
        </Content>
      </Wrapper>
      {editDocsPath && (
        <Link className="edit-git" to={`${editDocsPath}`}>
          Edit this page on GitHub
        </Link>
      )}
    </PageBottomWrapper>
  )
}

export default PageBottom

const PageBottomWrapper = styled.div`
  display: flex;
  font-size: ${(p) => p.theme.fontSizes[14]};
  flex-direction: row;
  justify-content: space-between;
  padding: ${(p) => p.theme.space[16]} ${(p) => p.theme.space[40]};
  align-items: center;
  button svg {
    cursor: pointer;
    transition: width 2s linear 1s;
  }
  .edit-git,
  .message {
    color: ${(p) => p.theme.colors.gray600} !important;
  }

  button {
    color: ${(p) => p.theme.colors.white} !important;
  }
  @media (min-width: 0px) and (max-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding: ${(p) => p.theme.space[16]};
    flex-direction: column;
    align-items: flex-start;
    .edit-git {
      order: 1;
    }
  }
`

const Feedback = styled.div`
  h4 {
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: ${(p) => p.theme.colors.gray500} !important;
  }
  .sentiments {
    button {
      background: transparent;
      border: 0;
      &.active {
        border-color: ${(p) => p.theme.colors.blue500};
        svg {
          circle,
          path {
            stroke: ${(p) => p.theme.colors.blue500};
          }
        }
      }
      &:hover svg {
        border-radius: 50%;
        background: rgba(204, 217, 223, 0.5);
      }
      &:disabled svg {
        cursor: not-allowed;
      }
    }
  }
  @media (min-width: 0px) and (max-width: 767px) {
    order: 2;
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: flex-start;
  cursor: default;
`

const Content = styled.div`
  flex: 1;
  .feedback-container,
  .yay-container {
    width: 360px;
  }
  .feedback-toast {
    background: #ffffff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25), 0px 2px 12px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    position: relative;
    width: 360px;
    height: 225px;
    padding: 0;

    .feedback-body {
      padding: 0;
    }

    margin-top: ${(p) => p.theme.space[24]};
    align-items: center;
    input {
      width: 100%;
      border: 0;
      padding: ${(p) => p.theme.space[12]} 20px;
      font-size: 100%;
      font-weight: normal;
      margin-bottom: 20px;

      &::placeholder {
        color: ${(p) => p.theme.colors.gray500};
      }
    }
    button {
      background: ${(p) => p.theme.colors.green500};
      border-radius: 6px;
      padding: 8px;
      font-size: 1rem;
      font-weight: 600;
      border-color: transparent;
      &:hover {
        background: ${(p) => p.theme.colors.green600};
      }
    }
  }
  .yay-toast {
    background: ${(p) => p.theme.colors.blue100};
    font-size: 14px;
    color: ${(p) => p.theme.colors.blue600};
    min-width: 360px;
  }
`

const Title = styled.div`
  background: ${(p) => p.theme.colors.blue100};
  display: flex;
  padding: 20px;
  p {
    color: ${(p) => p.theme.colors.blue600};
    font-size: ${(p) => p.theme.fontSizes[14]};
    margin: 0;
  }

  a {
    cursor: pointer;
  }
`

const Button = styled(ButtonWrapper)`
  display: inline-flex !important;
  overflow: hidden;
  text-transform: capitalize;
  font-size: 1rem;
  svg {
    margin-right: 10px;
    height: 1rem;
    width: 1rem;
    path {
      stroke: ${(p) => p.theme.colors.blue300};
    }
  }
  background: ${(p) => p.theme.colors.blue500} !important;
  margin: 0;
  margin-left: 20px;
  @media (min-width: 0px) and (max-width: 767px) {
    font-size: ${(p) => p.theme.fontSizes[12]};
    text-transform: none;
    svg {
      width: 14px;
    }
  }
`

const ButtonRow = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  .git-link {
    text-decoration: underline;
    margin-left: 20px;
    color: ${(p) => p.theme.colors.gray700} !important;
    font-weight: 600;
    font-size: 14px;
  }
`

const SuccessToast = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    font-size: 14px;
  }
  span {
    font-size: 24px;
    margin-right: 0.5rem;
  }
  a {
    cursor: pointer;
  }
`
