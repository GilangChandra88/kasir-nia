import { Flashlight, FlashlightOff } from 'lucide-react'
import { useState } from 'react'

import { IconButton } from '@/components/ui/IconButton'
import type { TorchControl } from '@/lib/camera'

type TorchButtonProps = {
  torch: TorchControl
}

/** Senter untuk warung yang redup. Hanya tampil bila kamera HP mendukung. */
export function TorchButton({ torch }: TorchButtonProps) {
  const [on, setOn] = useState(false)

  return (
    <IconButton
      icon={on ? FlashlightOff : Flashlight}
      label={on ? 'Matikan senter' : 'Nyalakan senter'}
      tone="light"
      onClick={() => {
        const next = !on
        torch.set(next).then(
          () => {
            setOn(next)
          },
          () => undefined,
        )
      }}
    />
  )
}
