import { Link, type LinkProps } from 'react-router'

import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

/** Tautan antarhalaman yang tampil seperti tombol. */
export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, fullWidth, className })} {...props} />
}
