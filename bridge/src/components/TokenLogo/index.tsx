import { FC } from 'react'
import { Token } from '../../types/tokens'
import { useNitroSwapAPI } from '../../hooks/useNitroSwapAPI'

interface ChainTokenLogoProps {
  chainId?: string
  token?: Token
}

export const TokenLogo: FC<ChainTokenLogoProps> = ({ chainId, token }) => {
  const {
    state: { nativeTokens },
  } = useNitroSwapAPI()

  const displayToken = token || (chainId ? nativeTokens?.find(t => t.chainId === chainId) : undefined)

  return (
    <div className="w-4 h-4">
      {displayToken?.logoURI ? (
        <img
          src={displayToken.logoURI}
          alt={displayToken.symbol}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="currentColor" />
        </svg>
      )}
    </div>
  )
}
