# Since we are not running a full rails new, we will just simulate a Rack app 
# that behaves like a Rails app for this initial check.
# In a real scenario, we would run 'rails new .' inside the container.

require 'rack'
require 'rack/handler/puma'

app = Proc.new do |env|
  ['200', {'Content-Type' => 'text/html'}, ['OmniLogistics Vendor Portal is Running! [Ruby]']]
end

Rack::Handler::Puma.run app, Port: 3000, Host: '0.0.0.0'
