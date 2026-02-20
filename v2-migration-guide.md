# Migration Guide: Merging v2 to Main OpenClawMac Repository

This guide outlines the steps to seamlessly replace the old v1 codebase with the new v2 codebase within your main GitHub repository (`Wikiup/openclawmac.com`) and deploy it to your primary Cloudflare Pages project (`openclawmac`).

## Important Context

Currently, the new site exists in a separate repository (`openclawmac-v2`) and gets deployed to a separate Cloudflare project (`openclawmac-v2`). The goal is to move the v2 code into the main repo so the primary Cloudflare project builds and serves the new site on the main domain.

### Step 1: Add Secrets to the Main Cloudflare Project
The new v2 codebase relies on the TidyCal API to handle bookings. Before deploying it to the main project, you must add the TidyCal API key to the main Cloudflare project (`openclawmac`).

1. Log in to the Cloudflare Dashboard.
2. Go to **Workers & Pages** -> **openclawmac** (the main project, not v2).
3. Go to **Settings** -> **Variables and Secrets**.
4. Click **Add** under "Variables and Secrets".
5. Set the Variable Name to `TIDYCAL_API_KEY`.
6. Paste your TidyCal API key (the same one we used on the v2 project) as the value.
7. Click **Encrypt** to protect the value.
8. Click **Save**.

### Step 2: Prepare the Main Repository
We will replace the contents of the main branch in `Wikiup/openclawmac.com` with the new v2 codebase.

> [!WARNING]
> This process will completely overwrite the existing v1 code in the main branch. Ensure you have a backup or a dedicated branch pointing to the old v1 code if you wish to reference it later.

1. Open a terminal and clone your main repository (if you haven't already):
   ```bash
   git clone https://github.com/Wikiup/openclawmac.com.git
   cd openclawmac.com
   ```
2. Make sure you are on the main branch:
   ```bash
   git checkout main
   ```
3. Remove all tracked files in the repository to create a blank slate (this removes files from Git tracking but doesn't delete the `.git` folder):
   ```bash
   git rm -rf .
   ```

### Step 3: Copy the v2 Codebase
Now, copy the entire v2 folder contents into the main repository folder.

1. Locate your `openclawmac-v2` folder on your computer.
2. Copy all files and folders (including the new `functions` folder for the API proxies, `index.html`, `index.css`, `index.js`, `images`, etc.) from `openclawmac-v2`.
3. Paste them into the main `openclawmac.com` repository folder you just cleared.
   > **Note:** Do NOT copy the `.git` folder from `openclawmac-v2`. We only want the source files.

### Step 4: Commit and Push
Commit the new v2 files to the main repository and push them to GitHub.

1. In the `openclawmac.com` terminal, add the new files:
   ```bash
   git add .
   ```
2. Commit the changes:
   ```bash
   git commit -m "feat: migrate v2 codebase"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```

### Step 5: Cloudflare Automatic Deployment
Once you push to the `main` branch, Cloudflare Pages will automatically detect the changes and trigger a new build for the `openclawmac` project.

Because the new codebase is statically generated (HTML/CSS/JS) and uses Cloudflare Pages Functions (in the `functions` folder), Cloudflare will automatically build and deploy it without any special build commands, just like the v2 project.

Once the deployment finishes, your primary domain (`openclawmac.com`) will serve the new v2 website with full TidyCal booking functionality!
