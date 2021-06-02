import * as React from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'
import styled from 'styled-components'
import SearchPic from '../../icons/Search'
import Clear from '../../icons/Clear'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import SearchSlash from '../../icons/SearchSlash'
import loadable from '@loadable/component'

// react-keyboard-event-handler uses the window object under the hood so we need to dynamically import it
const KeyboardEventHandler = loadable(() => import('react-keyboard-event-handler'))

const SearchBoxDiv = styled.div`
  width: 250px;
  display: flex;

  & > span {
    width: 100%;
  }

  form {
    width: 250px;
    position: relative;
  }

  &.opened {
    position: relative;
    z-index: 100001;
    max-width: 1200px;
    width: 100%;
    height: 77px;
    background: ${p => p.theme.colors.white};
    padding: ${p => p.theme.space[20]};
    border-bottom: 1px solid ${p => p.theme.colors.gray300};
    border-radius: ${p => p.theme.radii.small};

    form {
      width: 100%;
      input {
        color: ${p => p.theme.colors.gray700};
      }
    }

    .clear {
      background: ${p => p.theme.colors.gray300};
      border-radius: 6px;
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg path {
        stroke: ${p => p.theme.colors.gray700};
      }
    }
  }
  @media (max-width: ${p => p.theme.breakpoints.phone}) {
    width: auto;
    flex: 1;
    form {
      width: 100%;
    }
  }

  .clear {
    display: none;
  }

  form {
    display: flex;
    align-items: center;

    button.ais-SearchBox-submit {
      display: none;
    }
    button.ais-SearchBox-reset {
      background: transparent;
      border: transparent;
      outline: none;
    }

    input {
      width: 100%;
      background: transparent;
      outline: none;
      padding: 0rem ${p => p.theme.space[32]};
      font-family: ${p => p.theme.fonts.text};
      font-style: normal;
      font-weight: normal;
      font-size: ${p => p.theme.fontSizes[16]};
      line-height: 100%;
      border-width: 0;
      &::placeholder {
        content: 'Search Documentation...';
        color: ${p => p.theme.colors.gray500};
        opacity: 1; /* Firefox */
      }
    }

    input[type='search']::-webkit-search-decoration,
    input[type='search']::-webkit-search-cancel-button,
    input[type='search']::-webkit-search-results-button,
    input[type='search']::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }
  }

  .slash {
    border: 1px solid ${p => p.theme.colors.gray400};
    border-radius: 4px;
    color: ${p => p.theme.colors.gray400};
    min-width: 18px;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 0px) and (max-width: ${p => p.theme.breakpoints.tablet}) {
    .slash {
      display: none;
    }
  }
`

const SearchIcon = styled(SearchPic)`
  min-width: 1em;
  pointer-events: none;
  z-index: 100001;
  position: absolute;
`

const SearchSlashIcon = styled(SearchSlash)`
  pointer-events: none;
  z-index: 100001;
  position: absolute;
  right: 0;
`

const ClearIcon = styled(Clear)`
  cursor: pointer;
`

const DEBOUNCE_DELAY = 500

interface SearchBoxProps {
  refine: (value: string) => void
  onFocus: () => void
  isOpened: boolean
  closeSearch: () => void
  currentRefinement: any
}

const SearchBox = ({
  refine,
  onFocus,
  currentRefinement,
  isOpened,
  closeSearch,
  ...rest
}: SearchBoxProps) => {
  const [value, setValue] = React.useState(currentRefinement)

  const timeoutId = React.useRef<number | null>(null)
  const inputEl = React.useRef<HTMLInputElement | null>(null)
  const { width } = useWindowDimensions()
  const [placeholderText, setPlaceholderText] = React.useState('Search Documentation...')

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value: newValue } = e.currentTarget

    // After the user manually cleared the input, call `refine` without waiting so that the search
    // closes instantly.
    if (newValue === '') {
      return clearInput()
    }

    // Otherwise, debounce the search to avoid triggering many queries at once, which could also
    // make the UI freeze.
    window.clearTimeout(timeoutId.current as number)
    timeoutId.current = window.setTimeout(() => refine(newValue), DEBOUNCE_DELAY)
    setValue(newValue)

    inputEl.current?.blur()
    inputEl.current?.focus()
  }

  const clearInput = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current)
      setValue('')
      refine('')
    }
  }

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    inputEl.current?.blur()
    return false
  }

  React.useEffect(() => {
    if (width > 640) {
      setPlaceholderText('Search Documentation...')
    }
  }, [])

  return (
      <SearchBoxDiv className={isOpened ? 'opened' : ''}>
        <KeyboardEventHandler handleKeys={['40', '38', '27', '191']}>
        <form onSubmit={onSubmit}>
          <SearchIcon />
          <input
            ref={inputEl}
            type="text"
            placeholder={placeholderText}
            aria-label="Search Documentation..."
            onChange={onChange}
            onFocus={onFocus}
            value={value}
            {...rest}
          />

          {value !== '' && isOpened && (
            <span className="clear">
              <ClearIcon onClick={clearInput} />
            </span>
          )}
          {!isOpened && <SearchSlashIcon />}
        </form>
        </KeyboardEventHandler>
      </SearchBoxDiv>
  )
}

const CustomSearchBox = connectSearchBox(SearchBox)
export default CustomSearchBox
