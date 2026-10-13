Your Free Masterclass — application site
====================================

Original build. Plain HTML, CSS and JavaScript with no frameworks, no
inline styles and no inline scripts. Only external dependency is the
EverWebinar registration embed on the final screen.

FILES
  index.html              Application page (contact form -> 7 questions -> registration)
  about.html, contact.html, privacy-policy.html, terms.html,
  earnings-disclaimer.html, cookie-policy.html
                          Standalone pages, linked from every footer
  assets/styles.css       Shared styles
  assets/pages.css        Extra styles for the information pages
  assets/app.js           Application logic

DEPLOY
  Upload the whole folder so the relative paths (assets/..., about.html)
  resolve. Serve over HTTPS. Test the final screen on the live domain:
  the EverWebinar form only renders from a real origin.

NOTES
  - Progress is a ring in the header (CSS conic-gradient, --p set by app.js).
  - Options answer on click or keys A–E. Back keeps answers.
  - The EverWebinar wrapper lives in a hidden div so its script runs on
    page load, then app.js moves it into the final screen and passes
    first_name / last_name / email / phone on the iframe URL. Keep exactly
    one WebinarJam snippet on the page.
  - Answers are exposed as window.APPLICATION on the final screen for
    GHL webhooks or tagging.
  - Colour: change --green and --green-tint in styles.css and
    formAccentColor in the embed URL (URL-encoded hex).
  - Remaining [BRACKETED] text in privacy-policy.html and cookie-policy.html
    is the vendor list to confirm or delete.
