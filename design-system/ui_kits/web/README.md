# Kibo · Web UI kit

An interactive recreation of Kibo's **public web surface** — the marketing landing, the auth
cards (register / login), and the *"Configura tu Personaje"* onboarding — recreated from the real
`apps/web` (Next.js) screens and **reconciled to the canonical design tokens**.

> **Reconcile note.** The live code ships shadcn defaults (turquoise `#40E0D0`, Geist fonts, an
> indigo→purple gradient onboarding). This kit shows the **canonical** target instead: teal
> `#1CA4A0`, Plus Jakarta Sans / Inter, soft radii, no blue-purple gradients. Copy, casing, OAuth
> providers, the password-strength meter, and the onboarding fields are kept faithful to the real
> screens.

## Run
Open `index.html`. React + Babel (in-browser); Lucide via CDN; reuses the app kit's `icons.jsx`.

## Interactions (click-through)
- **Landing → Crear cuenta / Entrar** route to the auth cards.
- **Register:** live password-strength meter (3 checks), Microsoft/Google OAuth, "Crear cuenta"
  advances to onboarding.
- **Login:** credentials + OAuth, links to register.
- **Onboarding:** the character-creation form (avatar slot, name, gender select, birth date,
  mission textarea) with the 33% step-1 progress bar; "¡Listo, vamos! 🚀" returns to landing.

## Component map
| File | Exports | What |
|---|---|---|
| `web.css` | — | Marketing + auth + onboarding styles on top of the tokens |
| `Web.jsx` | `Nav`, `Footer`, `Landing`, `Register`, `Login`, `Onboarding` | All screens (+ Google/Microsoft marks) |
| `App.jsx` | — | Router; shows the nav only on landing/auth |
| `../app/icons.jsx` | `Icon` | Shared Lucide wrapper |

## Notes
- The hero "dashboard preview" is a lightweight stat strip — the full product lives in `../app/`.
- The single playful emoji (`🚀`) on the onboarding success CTA is intentional and on-brand; emoji
  is not used as system iconography.
