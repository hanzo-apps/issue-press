import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner } from '@hanzo/gui'
import { Callback } from './auth/callback'
import { SignedOut } from './views/signed-out'
import { Shell } from './views/shell'
import { paper, red } from './press'

/**
 * Top-level route + auth gate — no router dependency (one static SPA):
 *   /auth/callback  → finish the PKCE exchange, then land on the newsstand
 *   signed out      → the cover
 *   signed in       → the magazine (newsstand → issue → article)
 */
export function App() {
  const { isAuthenticated, isLoading } = useIam()

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    return <Callback />
  }
  if (isLoading) {
    return (
      <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" backgroundColor={paper}>
        <Spinner size="large" color={red} />
      </YStack>
    )
  }
  return isAuthenticated ? <Shell /> : <SignedOut />
}
