import { Button } from '@/components/ui/Button'

type GoogleSignInButtonProps = {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function GoogleSignInButton({ onClick, loading, disabled }: GoogleSignInButtonProps) {
  return (
    <Button
      variant="secondary"
      size="lg"
      fullWidth
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    >
      {!loading && <img src="/google-g.svg" alt="" className="size-5" />}
      Masuk dengan Google
    </Button>
  )
}
