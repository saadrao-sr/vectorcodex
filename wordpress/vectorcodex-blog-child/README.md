# VectorCodex Blog (child theme)

Classic Editor formatting via the native TinyMCE **Styles** dropdown only, plus a per-post **Blog FAQs** metabox.

## Parent

`hostinger-ai-theme` (active Hostinger AI theme)

## Formats

| Styles menu label | Element | Class |
| --- | --- | --- |
| CTA Block | `div` wrapper | `vc-editorial-cta` |
| CTA Button | `a` (then set URL via Insert/Edit Link) | `vc-editorial-cta__btn` |
| Pro Tip | `div` wrapper | `vc-pro-tip` |
| Citation | `span` inline | `vc-inline-citation` |
| Key Statistics | `div` wrapper | `vc-statistics` |

### CTA with URL

1. Select the callout paragraphs → **Styles → CTA Block**.
2. On a new line inside the block, type the button label (e.g. `Get a free audit`).
3. Select that label → **Styles → CTA Button**.
4. With the button still selected, use the toolbar **Insert/edit link** (or Ctrl+K) and paste the URL.
5. Update/save the post.

## Blog FAQs

1. Edit a post → scroll to the **Blog FAQs** box (below the editor).
2. Add question/answer rows with **Add FAQ**. Remove unused rows.
3. Update/save the post.
4. FAQs are exposed on REST as `vc_faqs` and rendered on the Astro article page after the content, above Share.

## Install

1. Upload `vectorcodex-blog-child.zip` under **Appearance → Themes → Add New → Upload**.
2. Activate **VectorCodex Blog**.
3. Edit a post with Classic Editor → second toolbar → **Formats / Styles**.
4. Select content, then apply a format. Apply again to remove when TinyMCE toggles it off.
5. Use **Blog FAQs** on the same post screen to manage article FAQs.

No custom toolbar buttons, dialogs, or plugins.
