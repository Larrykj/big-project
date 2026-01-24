FROM ruby:3.2-slim

# Install build dependencies for native gem extensions
# ruby-dev for Ruby headers, build-essential for gcc/make, default-libmysqlclient-dev for mysql2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ruby-dev \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY Gemfile ./
# Install gems (this might take a while on first build)
RUN bundle install
COPY . .
EXPOSE 3000
CMD ["bundle", "exec", "ruby", "config.ru"]
