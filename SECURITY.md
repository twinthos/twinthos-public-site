# Twinthos website security

This is a public, static GitHub Pages website, not the same codebase as the commercial AI agent deployment. No repository scan proves security of cloud computers, email, phone or client integrations.

## Report a problem privately
Please email **twinthos@agentmail.to** with affected URL, a minimal reproduction, and expected versus actual behaviour. Do not post customer records, credentials, tokens, private logs or live exploits in public issues.

## Controls in this repository
- Static pages; no first-party server-side account system or payment processing.
- Client-side enquiry form uses a third-party provider (FormSubmit); the provider enforces server-side anti-spam behaviour, not Twinthos JavaScript.
- Exposed source, generated HTML, stylesheets and GitHub Actions should be treated as public. Nothing secret belongs in this repository or its history.
- User-controlled URL parameters are restricted to an explicit set of known booking categories before use.
- CI builds the site, performs browser navigation tests and runs a public-content regression check.
- Public Sentinel security work is linked on /security/ with its limitations, not presented as a certification of this website.

## Remaining responsibilities
1. Verify the domain is controlled and enforce HTTPS in GitHub Pages settings. Keep DNS records correct to avoid domain takeover.
2. If custom HTTP security headers are required, use a deployment platform or proxy that can issue CSP, HSTS, frame/permissions and referrer headers. Adding a _headers file here would **not** configure GitHub Pages.
3. Exercise the full enquiry journey with the form provider in a browser, including CAPTCHA, delivery and failure paths. Confirm provider terms and retention.
4. Review repository and deployment access, require MFA and minimal write permissions, protect the publishing branch, and review third-party GitHub Actions.
5. Rotate any exposed secret immediately; deleting a file from the current branch does not erase Git history, mirrors or caches.
6. Run an authorised external penetration/security assessment before claiming independent assurance.

Updated: 2026-11-02.
