# Moderator publishing policy

Approved moderators publish content directly from Sveltia CMS to `main`. Each save creates a normal Git commit and triggers the GitHub Pages deployment.

## Access boundary

GitHub does not provide folder-only Write permission. A moderator who can publish through Sveltia also has GitHub Write access to the entire CMS repository. Only explicitly approved moderators should be invited, and they must not receive access to the admin portal or backend repositories.

The OAuth Worker must additionally find the moderator's immutable numeric GitHub user ID in D1 before releasing a token.

## Owner recovery

If an incorrect or unauthorized change is published:

1. Identify the last known-good commit in the GitHub history.
2. Revert the offending commit with a new revert commit; do not force-push or rewrite history.
3. Confirm the GitHub Pages deployment succeeds.
4. Remove the moderator from D1 and the CMS repository if access may be compromised.
5. Review the GitHub and application audit history and rotate credentials if exposure is suspected.

Force pushes and deletion of `main` remain disabled so recovery history is preserved.
