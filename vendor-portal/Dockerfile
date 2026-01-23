FROM ruby:3.2
WORKDIR /app
COPY Gemfile ./
# Install gems (this might take a while on first build)
RUN bundle install
COPY . .
EXPOSE 3000
CMD ["bundle", "exec", "ruby", "config.ru"]
