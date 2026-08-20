# JanSamvad CMS deployment checklist

The repository now contains the frontend redesign, admin UI, D1 schema and Pages Function API.

Cloudflare setup required for live CMS operation:
- Connect `vk-reg/jansamvad-beyond-politics` to Cloudflare Pages.
- Production branch: `main`.
- Build command: `exit 0`.
- Output directory: `.`.
- Create D1 database: `jansamvad-db`.
- Apply `schema.sql`.
- Bind D1 as `DB`.
- Add secret `ADMIN_KEY`.
- Redeploy.

After that, open `/admin/` to publish updates without editing GitHub files.
