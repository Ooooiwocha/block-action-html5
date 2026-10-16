# GitHub export

Source: https://block-action.ooooiwocha.chatgpt.site/
Source commit: `0665334cdeef9a78dda117cef1ec3895e6aa2a61`

This snapshot includes the site source, game assets, and database schema/migrations. It does not include live submitted stages, comments, rankings, notification subscriptions, local prototypes, runtime secrets, or original Git history.

The original Sites project ID was removed from `.openai/hosting.json` to avoid accidentally targeting the existing live site. Configure your own hosting and database bindings before deployment. Runtime variables and administrator password hashes must be configured separately; no secrets are included. This export does not change the live site.

The application uses Vinext/React and Cloudflare D1. GitHub Pages alone does not provide the server/database features. See `package.json`, `scripts/`, and `drizzle/` for the runtime/build and database migration setup.
