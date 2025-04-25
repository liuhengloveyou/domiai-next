pnpm run build

scp -r .next out package.json next.config.ts public/* ubuntu@111.231.11.139:/opt/domiai.net/domiai-next/

# pnpm install --production
# pnpm run start
# pnpm install -g pm2
# pm2 start pnpm --name "domiai-next" -- start