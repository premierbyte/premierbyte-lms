FROM php:8.4-fpm-alpine AS base

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pdo_mysql \
        zip \
        gd \
        bcmath \
        opcache \
        mbstring \
        xml

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Development stage
FROM base AS development
USER www-data
CMD ["php-fpm"]

# Production stage
FROM base AS production
COPY . /var/www
RUN composer install --no-dev --optimize-autoloader
USER www-data
CMD ["php-fpm"]
