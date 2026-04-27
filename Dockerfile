FROM php:8.3-fpm-alpine

WORKDIR /var/www

RUN apk add --no-cache curl git unzip \
	&& docker-php-ext-install opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json /var/www/composer.json

RUN composer install --no-interaction --no-progress --prefer-dist --optimize-autoloader

COPY . /var/www

CMD ["php-fpm"]
