import { useState } from 'react'

import { cn } from '@/lib/cn'
import { initials } from '@/lib/names'

type AvatarProps = {
  name: string
  photoURL: string | null
  className?: string
}

export function Avatar({ name, photoURL, className }: AvatarProps) {
  const [failedURL, setFailedURL] = useState<string | null>(null)
  const showPhoto = photoURL !== null && failedURL !== photoURL

  return (
    <span
      className={cn(
        'grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-navy-100 text-lg font-bold text-navy-800',
        className,
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
