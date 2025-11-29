# Frontend Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Auto-Deploy Enabled)

**Status:** ✅ Already configured and auto-deploying!

**Current Setup:**

- Auto-deploy on push to main/master
- Preview deployments for PRs
- CI/CD runs independently for validation

**Manual Deploy:**

```bash
npm install -g vercel
cd mars-frontend
vercel
```

**Environment Variables:**

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

**Configure in Vercel:**

- Dashboard → Project → Settings → Environment Variables
- Add variables for Production, Preview, and Development

### Option 2: Netlify

**Deploy:**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Build Settings:**

- Build command: `pnpm build`
- Publish directory: `dist`
- Node version: 20

### Option 3: Static Hosting

**Build:**

```bash
pnpm build
```

**Deploy `dist/` folder to:**

- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- GitHub Pages
- Firebase Hosting

**Example with S3:**

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Docker with Nginx

**Using docker-compose from mars-infra:**

```bash
cd ../mars-infra
docker compose up -d frontend
```

**Or standalone:**

```bash
docker build -t mars-frontend .
docker run -d -p 80:80 mars-frontend
```

## 🔧 Configuration

### Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.your-domain.com/api
VITE_SOCKET_URL=https://api.your-domain.com
```

### Build Optimization

**Vite automatically:**

- Minifies JavaScript and CSS
- Tree-shakes unused code
- Optimizes images
- Generates source maps
- Code splits by route

## 🐳 CI/CD with GitHub Actions

### Automated Testing

- Runs Vitest tests on every push/PR
- ESLint code quality checks
- Production build verification
- Test coverage upload

### Workflow File

See `.github/workflows/ci.yml` for full configuration

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel dashboard for:

- Page load times
- Core Web Vitals
- Real user metrics

### Custom Monitoring

Add error tracking:

```bash
pnpm add @sentry/react
```

## 🚦 Post-Deployment Checklist

- [ ] Environment variables set
- [ ] API connection working
- [ ] Socket.IO connecting
- [ ] All routes accessible
- [ ] Mobile responsive
- [ ] SSL/HTTPS enabled
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] SEO metadata complete

## 🎨 Custom Domain

### Vercel

1. Go to Project → Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate

### Netlify

1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS records
4. Auto-SSL enabled

## 🔒 Security Headers

**Nginx (if self-hosting):**

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'";
```

**Vercel/Netlify:**
Configure in `vercel.json` or `netlify.toml`

## 🐛 Troubleshooting

**Blank page after deployment:**

- Check browser console for errors
- Verify API URL is correct
- Check CORS configuration on backend

**API calls failing:**

- Verify `VITE_API_URL` environment variable
- Check network tab for failed requests
- Ensure backend is accessible

**Build fails:**

- Check Node.js version
- Verify all dependencies installed
- Review build logs

## 📚 Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [React Router](https://reactrouter.com/)
