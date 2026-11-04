# Stage 1: Compile Tailwind CSS and TypeScript
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Stage 2: PHP production runtime
FROM dunglas/frankenphp:1-php8.4-alpine AS runtime

WORKDIR /app

# Enable production PHP configuration
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy PHP application files
COPY --from=frontend /app/*.php ./

# Copy application dependencies and resources
COPY --from=frontend /app/includes ./includes
COPY --from=frontend /app/assets ./assets
COPY --from=frontend /app/storage ./storage

# SEO files
COPY --from=frontend /app/robots.txt ./robots.txt
COPY --from=frontend /app/sitemap.xml ./sitemap.xml

# Configure Caddy
COPY Caddyfile /etc/caddy/Caddyfile

ENV PORT=80

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
