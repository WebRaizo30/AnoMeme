# ANOMEME Backend

Phoenix/Elixir backend API for ANOMEME - Social Intent Terminal for Memecoin Trading.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
mix setup

# Start Phoenix server
mix phx.server
```

Visit [`localhost:4000`](http://localhost:4000) from your browser.

### Production
```bash
# Production setup
MIX_ENV=prod mix deps.get
MIX_ENV=prod mix compile
MIX_ENV=prod mix assets.deploy
MIX_ENV=prod mix phx.server
```

## 🌐 Production Environment

- **API URL:** https://anomeme.fun/api
- **VPS:** 157.180.46.198:4000
- **Database:** PostgreSQL
- **Environment:** Production

## 📡 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/connect-wallet` - Wallet connection
- `POST /api/auth/verify-signature` - Signature verification
- `GET /api/intents` - List intents
- `POST /api/intents` - Create intent
- `GET /api/social/signals` - Social signals
- `POST /api/risk/assess` - Risk assessment

## 🔧 Configuration

Environment variables required:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY_BASE` - Phoenix secret key
- `PHX_HOST` - Host domain (anomeme.fun)
- `CORS_ORIGIN` - Allowed CORS origin

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
