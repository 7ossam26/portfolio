# Studio Dark — Design and UX Specification

Status: approved visual direction, with production implementation still to follow.

## Reference and fidelity

Approved review: https://ahmed-hossam-portfolio-directions.amedoss17.chatgpt.site

Approved source snapshot: `c416bfae87ebfec8ec282961b23c805984cd46fd` from the existing design Site. A separate `Studio_Dark_Reference.zip` accompanies this plan. Extract it to the new repository root so that `design-reference/studio-dark/index.html` exists.

The review URL is private. A future Codex environment may be unable to open it. Use the exported HTML/CSS/JS as the concrete visual reference; do not scrape an authentication page or infer that the reference is empty. The source export intentionally excludes hosting identity and Git metadata. It is a reference, not the new project's deployment configuration.

Carry forward the layout hierarchy, typography contrast, graphite/copper identity, restrained surfaces, and project ordering. The implementation may improve specific accessibility or responsive defects with evidence. It must not reinterpret the request as permission to select a new template.

## Visual thesis

An engineer's personal portfolio presented with the clarity of a considered studio site. Personality comes from the typography, composition, and detailed project evidence. The interface gives the work room to speak.

### Tokens from the approved source

| Token | Value | Use |
| --- | --- | --- |
| Background | `#111516` | Page and deep inset surfaces |
| Surface | `#191e20` | Featured project and dialogs |
| Raised surface | `#202729` | Modest interaction feedback |
| Primary text | `#f0f1ed` | Titles and important copy |
| Supporting text | `#b0b9b9` | Body descriptions |
| Quiet text | `#909b9c` | Secondary metadata |
| Structural line | `#343d3f` | Decorative dividers |
| Control boundary | `#667477` | Outlined interactive controls |
| Accent | `#e8b09a` | Primary action and selective emphasis |
| Accent text | `#241b18` | Text on the accent button |
| Primary hover | `#f4c4b2` | Filled-button hover |
| Default button radius | `0.375rem` | Buttons and small surfaces |
| Featured surface radius | `0.5rem` | Featured project |
| Desktop dialog radius | `0.75rem` | Demo and project overlays |
| Transition | `160ms` | Color/background/border feedback |
| Maximum content width | `1440px` | Outer site container |
| Horizontal padding | `clamp(1.25rem, 4.5vw, 4.5rem)` | Outer page gutters |

The existing CSS is authoritative where it contains more detail than this summary. Dark UI needs a clear relationship between surfaces; avoid making every card, border, and background the same shade.

### Typography

- Sans stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif`.
- Serif accent: `Georgia, Times New Roman, serif`, used for the selected hero emphasis and restrained related headings.
- Monospace metadata: `SFMono-Regular, Consolas, Liberation Mono, monospace`.
- Main body copy: at least 16px with approximately 1.7–1.8 line-height.
- Regular labels and buttons: at least 14px. Reserve 12–13px for secondary metadata.
- Scale type using rem/clamp and allow wrapping. Check actual text at 200% enlargement; negative letter-spacing is not permission for overlapping characters.
- Do not introduce external font requests in the initial implementation. A later typography change needs an explicit design decision and a measured asset cost.
- Preserve original Arabic fonts inside demos where required; self-host needed font files and scope them to their application.

## Page composition

### Homepage

1. Identity: `ah.` mark, Ahmed Hossam, Software engineer. Desktop navigation has Selected work and Get in touch.
2. Introduction: large headline left; concise business-software context and actions right. Stack these naturally on small screens.
3. Primary introduction action: Explore my work. Secondary: Download CV.
4. Work divider, then a single dominant Vertex feature. Keep the title, operating context, short evidence rows, and actions readable together.
5. Feature imagery: use a real selected original-UI capture once available. A labeled production workflow diagram may remain supporting material; never relabel it as a screenshot.
6. AutoZain, Roya, and Ramex as substantial rows, each containing domain, name, a specific capability, and a details link.
7. Contact footer: clear email access and GitHub, with restrained identity/location metadata.

The new case-study routes replace the prototype's short project-details dialogs as the primary details destination. Reuse its content and visual vocabulary. Use a real anchor for navigation so open-in-new-tab, sharing, and keyboard behavior remain normal. Keep demo actions separate from case-study links; never nest interactive controls.

### Case-study pages

Use the same container, type scale, buttons, colors, and footer. Start with an ordinary Back to work link, project name/domain, concise summary, and demo action when ready. Follow with original-UI evidence, a short problem/contribution section, selected capabilities, and engineering decisions. Avoid long walls of text, repeated card grids, and decorative metrics.

Screenshots need a fixed aspect ratio or explicit dimensions and a descriptive caption. Small interface text should not be the only way to learn what a capability does. Use compact annotations in adjacent prose, not overlaid invented UI labels.

## Interaction rules

| Element | Required behavior |
| --- | --- |
| Explore my work | Scroll to work with reduced-motion respected |
| Download CV | Download/open the supplied PDF through a stable local link |
| Project row/details | Navigate to a shareable case-study route |
| Try demo | Open the ready original-UI demo; show immediate loading feedback |
| Demo close | Return focus to the trigger and preserve portfolio scroll position |
| Demo reset | Restore the exact sample seed and restart the guided scenario |
| Email | Normal `mailto:` link with a visible email alternative |
| Repository | Normal GitHub link; new tabs have the appropriate relationship attributes |

Use a filled primary action and outlined or text secondary action in each local context. Keep actionable labels specific. Buttons need normal, hover, focus-visible, pressed, disabled/loading, and recovery states where applicable. Aim for at least 44×44 CSS-pixel touch targets; text links can use padding to achieve usable hit areas.

No automatic demo opening, automatic audio, background video, mouse-following cursor, scroll hijacking, delayed entrance that hides essential content, infinite ornamental animation, or hover-only access to important actions.

## Mobile and keyboard behavior

- Check 360px, 390px, 768px, 1024px, and 1440px viewports, plus 200% enlargement. These are test points, not exclusive CSS breakpoints.
- Keep every main content region within the viewport. Scroll wide tables inside their own demo region where reflow is impractical.
- The demo becomes a full-viewport dialog on small screens. Keep Close and Reset available without burying them below the application's scrollable content.
- Preserve a visible keyboard focus indicator. Test through the iframe boundary, not only on the portfolio page.
- The user's reduced-motion preference disables optional movement and smooth scrolling.
- Use sufficient text and control contrast; decorative dividers do not substitute for control boundaries.
- Test Arabic demo direction independently from English host direction. Do not apply portfolio CSS globally inside frames.

## Practical anti-template review

Before declaring the UI phase done, ask:

1. Can the first screen explain Ahmed's work without a generic motivational tagline?
2. Does each project show a different operational problem and a concrete capability?
3. Is the featured material from the actual application or explicitly labeled as a diagram?
4. Are decisions visible in typography, spacing, and alignment rather than ornamental effects?
5. Does the visitor always know what a button will do?
6. Would removing an element make the experience clearer? If so, remove that element.

Do not add skill percentage bars, invented client logos/testimonials, unverified impact statistics, a giant technology-logo wall, placeholder dashboards, or generic startup feature sections. This is an execution constraint, not a guarantee of aesthetic originality; compare the actual rendered result with the approved reference during implementation.
