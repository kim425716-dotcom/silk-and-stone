# Silk & Stone — Luxury Interior Design Studio

Silk & Stone Interiors is a luxury interior architecture and interior design studio based in Nairobi, Kenya. The brand balances tactile organic materiality with architectural restraint, blending the quiet elegance of raw textures and warm stone with bespoke craftsmanship.

## Highlights
- **Curated Portfolios**: High-end residential villas, commercial lounges, bespoke joinery, and wellness sanctuaries.
- **Responsive Web Design**: Pure HTML, CSS design tokens, and modular vanilla JavaScript.
- **Interactive Experience**: Architectural project showcases, interactive service inquiries, and luxury visual storytelling.

## Project Structure
```text
silk and stone/
├── index.html                   # Root entry point & automatic redirect
├── README.md
├── .gitignore
└── silk-stone-interiors/        # Main website application
    ├── index.html               # Home page
    ├── about.html               # Studio philosophy, awards, and story
    ├── services.html            # Design services & bespoke offerings
    ├── portfolio.html           # Completed architecture & interior projects
    ├── contact.html             # Studio contact & consultation booking
    ├── styles/                  # Design tokens and modular styling
    ├── scripts/                 # Interactive navigation and UI behaviors
    └── ...                      # Project imagery & architectural media
```

## Getting Started

1. Open `index.html` directly in any modern browser, or serve locally with any static web server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js / npx
   npx serve .
   ```
2. Navigate to `http://localhost:8000` to explore the experience.

## cPanel Deployment (Hosting as Second Website)

Silk & Stone can be hosted on your cPanel account as an **Addon Domain**, **Subdomain**, or **Subfolder** alongside your primary website.

### Option 1: Direct Upload via cPanel File Manager (Fastest)

1. Open your cPanel dashboard and go to **Domains** (or **Addon Domains** / **Subdomains**):
   - Create your second domain (e.g. `silkandstone.ke` or subdomain `interiors.logictech.co.ke`).
   - Note the **Document Root** directory (e.g., `/public_html/silk-and-stone/`).
2. Open **cPanel > File Manager** and navigate into that Document Root directory.
3. Click **Upload** and select the bundle generated in this workspace:
   `silk-and-stone-cpanel.zip`
4. Right-click the uploaded zip in File Manager and select **Extract**.
5. Your website is immediately live with optimized `.htaccess` caching, compression, and clean URLs!

*(To rebuild the zip bundle at any time, run: `powershell -ExecutionPolicy Bypass -File .\scripts\build-cpanel-bundle.ps1`)*

---

### Option 2: Automated Continuous Deployment via GitHub Actions

Every time you commit and push to `main`, GitHub Actions can automatically upload changes to your cPanel host via FTP:

1. Run the interactive setup script in PowerShell:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\setup-cpanel-deploy.ps1
   ```
2. Enter your cPanel FTP credentials and target folder (`/public_html/silk-and-stone/`).
3. Commit and push:
   ```bash
   git push origin main
   ```
4. GitHub Actions will automatically synchronize your files to cPanel!

## License
MIT License
