import { useState } from 'react'

import { cn } from '@/lib/cn'
import { initials } from '@/lib/names'

const SIZES = {
  md: 'size-11 text-base',
  lg: 'size-14 text-lg',
} as const

type AvatarProps = {
  name: string
  photoURL: string | null
  size?: keyof typeof SIZES
}

export function Avatar({ name, photoURL, size = 'lg' }: AvatarProps) {
  const [failedURL, setFailedURL] = useState<string | null>(null)
  const showPhoto = photoURL !== null && failedURL !== photoURL

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-full bg-navy-100 font-bold text-navy-800',
        SIZES[size],
      )}
    >
      {showPhoto ? (
        // `no-referrer` karena foto Google kadang menolak permintaan dari domain lain.
        <img
          src={photoURL}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => {
            setFailedURL(photoURL)
          }}
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
}
