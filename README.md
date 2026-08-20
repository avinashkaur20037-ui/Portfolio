# Avinash Kaur — Portfolio Site

## Files
- `index.html` — all page content and structure
- `style.css` — all styling (colors, fonts, layout, animations, responsiveness)
- `script.js` — nav behavior, scroll animations, skills tabs, stat counter, contact form
- `assets/resume/resume.pdf` — **placeholder**, replace with your real résumé
- `assets/images/` — put your photos and project screenshots here
- `assets/certificates/` — put your certificate images here

## Images to add (same filenames = zero code changes needed)
| Placeholder | File to add |
|---|---|
| Internship photo | `assets/images/internship.jpg` |
| HR project (training) photo | `assets/images/hr-project.jpg` |
| Golden Oak dashboard screenshot | `assets/images/golden-oak.jpg` |
| Dastaan project photos | `assets/images/dastaan.jpg` |
| Pitch Perfect 2.0 photo | `assets/images/pitch-perfect.jpg` |
| Acting & Mime photo | `assets/images/mime.jpg` |
| Power BI / analytics screenshot | `assets/images/powerbi.jpg` |
| Certificates | `assets/certificates/certificate1.jpg`, `certificate2.jpg`, `certificate3.jpg` |

To actually show an image instead of the dashed placeholder box, open `index.html`, find the
`<figure class="img-placeholder" data-img="...">` block for that item, and replace its inner
`<span>` contents with an `<img src="assets/images/yourfile.jpg" alt="...">` tag. Each placeholder
has an HTML comment right above it telling you exactly which file to swap in.

## Resume
Upload your real PDF as `assets/resume/resume.pdf`, replacing the placeholder file — the
"Download Resume" buttons already point there, so no code changes are needed.

## Deploying to GitHub Pages
See the chat response for full step-by-step instructions.
