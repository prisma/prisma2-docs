import styled from 'styled-components'
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import * as React from 'react'
import { theme } from '@prisma/lens/dist/web'

const fontSizeForSize = (size?: ButtonSize) => {
  switch (size) {
    case ButtonSize.SMALL:
      return '14px'
    case ButtonSize.LARGE:
      return '20px'
    default:
      return '1 rem'
  }
}
const paddingForSize = (size?: ButtonSize) => {
  switch (size) {
    case ButtonSize.SMALL:
      return '6px 12px'
    case ButtonSize.LARGE:
      return '12px 16px'
    default:
      return '8px 16px'
  }
}
const radiusForSize = (size?: ButtonSize) => {
  switch (size) {
    case ButtonSize.LARGE:
      return theme.radii.medium
    default:
      return theme.radii.small
  }
}

const Base = styled.a<{ size?: ButtonSize }>`
  font-size: ${p => fontSizeForSize(p.size)};
  font-weight: 600;
  padding: ${p => paddingForSize(p.size)};
  display: inline-block;
  border: none;
  text-align: left;
  border-radius: ${p => radiusForSize(p.size)};
  line-height: 1.5;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  color: ${theme.colors.text};
  background: ${theme.colors.gray300};
  transition: 0.2s ease-out;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    transform: scale(0.99);
    background: ${theme.colors.gray200};
  }
  &:active {
    transform: scale(0.98);
  }
`
const VisuallyHidden = styled.span`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`
export enum ButtonSize {
  SMALL = 'SMALL',
  REGULAR = 'REGULAR',
  LARGE = 'LARGE',
}

export interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode
  icon?: ReactNode
  hiddenLabel?: boolean
  size?: ButtonSize
}

export const IconWrapper = styled.span`
  display: inline-block;
  margin-top: -3px;
  vertical-align: middle;
  height: 24px;
  margin-right: 4px;
`
const Button = React.forwardRef((props: ButtonProps, ref?: React.Ref<HTMLAnchorElement>) => {
  return (
    <Base ref={ref} {...props}>
      {props.hiddenLabel ? <VisuallyHidden>{props.children}</VisuallyHidden> : props.children}
      {props.icon && (
        <IconWrapper
          style={{
            marginLeft: props.children && !props.hiddenLabel ? '6px' : '0',
          }}
        >
          {props.icon}
        </IconWrapper>
      )}
    </Base>
  )
})

export default Button
