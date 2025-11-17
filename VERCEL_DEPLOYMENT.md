# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel

## Setup Instructions

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Get Vercel Credentials

#### Get VERCEL_TOKEN:
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Copy the token value

#### Get VERCEL_ORG_ID and VERCEL_PROJECT_ID:
```bash
# Run in your project directory
vercel link
```
This will create a `.vercel/project.json` file with your org and project IDs.

Or manually:
- **VERCEL_ORG_ID**: Go to your Vercel dashboard → Settings → General (Team ID)
- **VERCEL_PROJECT_ID**: Go to your project → Settings → General (Project ID)

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these three secrets:
   - `VERCEL_TOKEN`: Your Vercel token
   - `VERCEL_ORG_ID`: Your Vercel organization/team ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 4. Deploy

#### Automatic Deployment (Recommended):
- Push to `main` branch
- GitHub Actions will automatically build and deploy to Vercel

#### Manual Deployment:
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Configuration

### vercel.json
The `vercel.json` file configures:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing (all routes redirect to index.html)

### GitHub Actions Workflow
The `.github/workflows/vercel-deploy.yml` file:
- Triggers on push to `main` branch
- Installs dependencies
- Builds the project
- Deploys to Vercel

## Troubleshooting

### Build Fails
- Check that `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Node.js version matches (20.x)

### Deployment Fails
- Verify all three secrets are correctly set
- Check GitHub Actions logs for detailed error messages
- Ensure Vercel project is linked to the repository

## Environment Variables

If your app needs environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add your variables (e.g., `VITE_API_URL`)
3. Redeploy the project

## URLs

After successful deployment:
- **Production**: `https://your-project.vercel.app`
- **Preview**: Unique URL for each pull request

## Support

- Vercel Documentation: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/actions
