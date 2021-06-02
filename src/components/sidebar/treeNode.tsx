import * as React from 'react'
import styled from 'styled-components'
import ArrowRight from '../../icons/ArrowRight'
import ArrowDown from '../../icons/ArrowDown'
import Link from '../link'
import { urlGenerator } from '../../utils/urlGenerator'
import { useLocation } from '@reach/router'
import { withPrefix } from 'gatsby'

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${p => p.theme.space[12]} 0 ${p => p.theme.space[24]};
  &.has-border {
    border-left: 2px solid ${p => p.theme.colors.gray300};
    margin-left: -${p => p.theme.space[12]};
  }
`

const ListItem = styled.li`
  font-size: ${p => p.theme.fontSizes[14]};
  line-height: 1.25;
  margin-bottom: ${p => p.theme.space[12]};
  position: relative;
  a {
    transition: color 150ms ease 0s;
    color: ${p => p.theme.colors.gray600} !important;
    text-decoration: none;
    vertical-align: middle;
    &:hover {
      color: ${p => p.theme.colors.gray900} !important;
    }

    .tag {
      position: absolute;
      right: 0;
      color: ${p => p.theme.colors.gray500};
      font-size: ${p => p.theme.fontSizes[14]};
      font-style: normal;
      font-weight: 600;
      background: ${p => p.theme.colors.gray200};
      border-radius: ${p => p.theme.radii.small};
      padding: 2px 5px;
      &.small {
        font-size: 13px;
      }
    }

    .item-collapser {
      background: transparent;
      position: absolute;
      left: -15px;
      top: 7px;
      padding: 0;
      border: 0;

      &.more-left {
        left: 10px;
      }

      .right,
      .down {
        transition: opacity 0.5s linear;
      }

      .right.open,
      .down.close {
        display: none;
        opacity: 0;
      }

      .right.close,
      .down.open {
        display: block;
        opacity: 1;
      }

      .down.open {
        margin-top: 2px;
      }

      &:hover,
      &:focus,
      &:active {
        outline: none;
      }
    }
  }
  .active-item {
    color: ${p => p.theme.colors.blue600} !important;
    font-weight: 700;
  }
  &.top-level {
    margin-top: ${p => p.theme.space[32]};
    > a {
      font-size: 1.125rem;
      color: ${p => p.theme.colors.gray900} !important;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    > ul {
      margin-top: ${p => p.theme.space[12]};
    }
  }
  &.bottom-level {
    margin-left: ${p => p.theme.space[20]};
  }
  &.static-link {
    margin-top: ${p => p.theme.space[20]};
  }
  &.static-link > a {
    color: ${p => p.theme.colors.gray900} !important;
    text-transform: uppercase;
    font-weight: bold;
    font-size: ${p => p.theme.fontSizes[12]};
    line-height: ${p => p.theme.space[14]};
    letter-spacing: 0.02em;
    &:hover {
      color: ${p => p.theme.colors.gray900} !important;
    }
  }
  &.last-level {
    padding-left: ${p => p.theme.space[24]};

    // .last-level {
    //   /*this one is last for real*/
    //   padding-left: ${p => p.theme.space[16]};
    // }
  }
  .collapse-title {
    cursor: pointer;
    svg {
      transition: transform 0.2s ease;
    }
  }
`

const TreeNode = ({
  className = '',
  setCollapsed,
  collapsed,
  url,
  slug,
  title,
  navTitle,
  items,
  label,
  topLevel,
  staticLink,
  duration,
  experimental,
  preview,
  earlyaccess,
  lastLevel,
  hidePage,
  codeStyle,
  parents,
}: any) => {
  const isCollapsed = collapsed[label]
  const collapse = () => {
    Object.keys(collapsed).map(lbl => {
      if ((lbl !== label && !parents) || (lbl !== label && parents && !parents.includes(lbl))) {
        collapsed[lbl] = collapsed[lbl] == false ? (collapsed[lbl] = true) : collapsed[lbl]
      }
    })
    setCollapsed(label, false, parents)
  }
  const location = useLocation()

  const justExpand = (e: any) => {
    setCollapsed(label, true)
    e.preventDefault()
    e.stopPropagation()
  }

  const hasChildren = items.length !== 0
  const level = slug ? slug.split('/').indexOf(label) : ''

  const calculatedClassName = `${className || ''} ${topLevel ? 'top-level' : ''} ${
    staticLink ? 'static-link' : ''
  } ${lastLevel ? 'last-level' : ''} ${level > 2 ? 'more-padding' : ''}`

  items.sort((a: any, b: any) => {
    if (a.label < b.label) {
      return -1
    }
    if (a.label > b.label) {
      return 1
    }
    return 0
  })

  const hasExpandButton = title && hasChildren && !staticLink && !topLevel
  let hasBorder: boolean = false
  if (hasExpandButton) {
    items.map((item: any) => (item.lastLevel = true))
    hasBorder = true
  }

  // Fix for issue https://github.com/prisma/prisma2-docs/issues/161
  const [isOpen, setIsOpen] = React.useState('close')
  React.useEffect(() => {
    let mounted = true

    if (mounted) {
      setIsOpen(isCollapsed ? 'close' : 'open')
    }

    return function cleanup() {
      mounted = false
    }
  }, [isCollapsed])

  const isCurrent = location && slug && location.pathname.includes(urlGenerator(slug))

  return url === '/' ? null : (
    <ListItem className={calculatedClassName}>
      {title && label !== 'index' && !hidePage && (
        <Link
          to={staticLink || topLevel ? null : url}
          activeClassName="active-item"
          className={isCurrent ? 'active-item' : 'non-active'}
          id={withPrefix(url)}
        >
          {hasExpandButton ? (
            <span className="collapse-title" onClick={collapse}>
              <button
                aria-label="collapse"
                className={`item-collapser ${level > 3 ? 'more-left' : ''}`}
                onClick={justExpand}
              >
                {/* Fix for issue https://github.com/prisma/prisma2-docs/issues/161 */}
                <ArrowRight className={`right ${isOpen}`} />
                <ArrowDown className={`down ${isOpen}`} />
              </button>
              <span className={`${codeStyle ? 'inline-code' : ''}`}>{navTitle || title}</span>
            </span>
          ) : (
            <span className={`${codeStyle ? 'inline-code' : ''}`} onClick={collapse}>
              {navTitle || title}
            </span>
          )}
          {duration && <span className="tag">{duration}</span>}
          {experimental && <span className="tag small">Experimental</span>}
          {preview && <span className="tag small">Preview</span>}
          {earlyaccess && <span className="tag small">Early Access</span>}
        </Link>
      )}

      {!isCollapsed && hasChildren ? (
        <List className={`${hasBorder ? 'has-border' : ''}`}>
          {items.map((item: any, index: number) => (
            <TreeNode
              key={item.url + index.toString()}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              {...item}
            />
          ))}
        </List>
      ) : null}
    </ListItem>
  )
}
export default TreeNode
