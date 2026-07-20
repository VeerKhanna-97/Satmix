# Satmix Website Rules

> [!IMPORTANT]
> **OFFLINE MODE**: As per the user's instructions, this project is strictly offline for now. Do NOT ask the user to push to GitHub or Vercel, and do not attempt to trigger any live deployments until told otherwise.

When working on the Satmix Website, always ensure the following git commands are executed (or provided to the user) when finalizing changes:

```bash
git config user.name "Veer"
git config user.email "veer.khanna@bbafmah.christuniversity.in"
git commit --allow-empty -m "Trigger final build"
```

## Vercel Deployment & Remotes (CURRENTLY PAUSED)
- **GitHub Remotes:**
  - `origin` points to `VeerKhanna-97/Satmix` (college repository).
  - `origin2` points to `veerkhanna/satmix` (personal repository linked to Vercel).
- **Triggers:** Pushing to `origin2` (`git push origin2 main`) triggers the live Vercel deployments. Pushing to `origin` does not.
- **Git Push Handling:** The background agent shell cannot push to `origin2` because it hangs on Git's interactive credential helper/account selection prompt. Always instruct the user to run the push manually in their PowerShell terminal:
  ```bash
  git push origin2 main
  ```
- **Local Deployment Bypass:** If the GitHub webhook is not triggering or if you need to bypass GitHub entirely, use the Vercel CLI from PowerShell. Since the local network has SSL certificate verification limitations, prefix the command with `NODE_OPTIONS` to use the system CA:
  ```powershell
  $env:NODE_OPTIONS="--use-system-ca"; npx vercel --prod
  ```
