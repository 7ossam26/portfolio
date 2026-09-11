# Technical references checked during planning

Checked on 10 September 2026. These sources support platform behavior; the project architecture, scope, budgets, phase boundaries, and proposed demo scenarios are planning decisions. Recheck version-specific details when implementation begins.

| Source | Used for |
| --- | --- |
| [Astro configuration](https://docs.astro.build/en/reference/configuration-reference/) | Static output and configuration choices |
| [Astro routing](https://docs.astro.build/en/guides/routing/) | Static, directly addressable content routes |
| [Vite production build](https://vite.dev/guide/build.html) | Independent builds and nested public asset bases |
| [Vite static deployment](https://vite.dev/guide/static-deploy.html) | Deployable static output |
| [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | Native modal behavior and accessibility considerations |
| [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe) | Embedded documents and sandbox limitations |
| [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) | Exact-origin/window validation for frame communication |
| [MDN frame-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-src) | Parent restrictions on loaded frames |
| [MDN frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors) | Child restrictions on its embedding ancestors |
| [Google Web Vitals](https://web.dev/articles/vitals) | Current field targets and distinction between lab and field measurements |

Project-specific evidence and observed repository revisions are recorded in `content-and-evidence.md`. The supplied CV is the identity/contribution source where indicated. No benchmark result, customer outcome, or source extraction success is inferred from these documentation links.
