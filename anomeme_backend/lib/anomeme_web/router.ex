defmodule AnomemeWeb.Router do
  use AnomemeWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :put_root_layout, html: {AnomemeWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", AnomemeWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # API Routes for ANOMEME
  scope "/api", AnomemeWeb do
    pipe_through :api
    
    # Health check
    get "/health", HealthController, :check
    
    # Authentication
    post "/auth/connect-wallet", AuthController, :connect_wallet
    post "/auth/verify-signature", AuthController, :verify_signature
    get "/auth/user/:address", AuthController, :get_user
    
    # Intent Management
    post "/intents", IntentController, :create
    get "/intents", IntentController, :index
    get "/intents/:id", IntentController, :show
    
    # Social Signals
    get "/social/signals", SocialController, :signals
    get "/social/sources", SocialController, :sources
    
    # Risk Assessment
    post "/risk/assess", RiskController, :assess
    
    # Anoma Intent Management
    post "/anoma/intents", AnomaController, :create_intent
    get "/anoma/intents/:intent_id", AnomaController, :get_intent_status
    get "/anoma/intents/user/:user_address", AnomaController, :list_user_intents
  end

  # Development routes
  if Application.compile_env(:anomeme, :dev_routes) do
    scope "/dev" do
      pipe_through :browser
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
