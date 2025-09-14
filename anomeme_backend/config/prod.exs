import Config

# Do not print debug messages in production
config :logger, level: :info

# Runtime configuration
config :anomeme, AnomemeWeb.Endpoint,
  url: [host: System.get_env("PHX_HOST") || "example.com", port: 80],
  http: [
    ip: {0, 0, 0, 0, 0, 0, 0, 0},
    port: String.to_integer(System.get_env("PORT") || "4000")
  ],
  secret_key_base: System.get_env("SECRET_KEY_BASE")

# Database configuration
config :anomeme, Anomeme.Repo,
  url: System.get_env("DATABASE_URL") || "postgresql://postgres:postgres@localhost:5432/anomeme_prod",
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

# CORS configuration for production
config :anomeme, AnomemeWeb.Endpoint,
  check_origin: [System.get_env("CORS_ORIGIN") || "https://yourdomain.com"]

# Anoma configuration
config :anomeme, :anoma,
  rpc_url: System.get_env("ANOMA_RPC_URL"),
  solver_endpoints: String.split(System.get_env("ANOMA_SOLVER_ENDPOINTS") || "", ",")

# Social media APIs
config :anomeme, :social,
  twitter_api_key: System.get_env("TWITTER_API_KEY"),
  telegram_bot_token: System.get_env("TELEGRAM_BOT_TOKEN")

# Mailer configuration
config :anomeme, Anomeme.Mailer,
  adapter: Swoosh.Adapters.Sendgrid,
  api_key: System.get_env("SENDGRID_API_KEY")