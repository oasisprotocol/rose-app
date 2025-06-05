import { FC } from 'react'

export const UIFooter: FC = () => {
  return (
    <footer className="flex items-center justify-between border-t border-border px-3 md:px-6 py-3 w-full">
      <p className="text-xs text-muted-foreground">Copyright @ OASIS {new Date().getFullYear()}</p>

      <div className="flex items-center gap-2.5">
        <p className="text-xs text-muted-foreground">
          <a href={`${GITHUB_REPOSITORY_URL}tree/${BUILD_COMMIT}`} rel="noopener noreferrer" target="_blank">
            Version {APP_VERSION}
          </a>
        </p>
        <span className="text-xs text-muted-foreground">|</span>
        <a
          className="text-xs text-muted-foreground"
          href={PRIVACY_POLICY_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
