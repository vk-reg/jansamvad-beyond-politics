# Admin panel

Open `/admin/` after the site is deployed on Cloudflare Pages and the D1 binding is configured.

The panel publishes title, category, district, image, article body, YouTube URL and official source. It sends content to `/api/posts` using the `X-Admin-Key` header.

Do not put the admin key in source code. Configure it as a Cloudflare secret named `ADMIN_KEY` and enter it only in the admin form.
