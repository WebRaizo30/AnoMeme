defmodule AnomemeWeb.IntentController do
  use AnomemeWeb, :controller

  def index(conn, _params) do
    # Mock intents data
    intents = [
      %{
        id: "1",
        user_address: "0x1234...5678",
        trigger_conditions: %{type: "social_signal", source: "@elonmusk", keyword: "DOGE"},
        trading_action: %{type: "buy", amount: "$100", token: "DOGE"},
        status: "active",
        created_at: DateTime.utc_now()
      }
    ]
    
    json(conn, %{intents: intents})
  end

  def show(conn, %{"id" => id}) do
    # Mock single intent
    intent = %{
      id: id,
      user_address: "0x1234...5678",
      trigger_conditions: %{type: "social_signal", source: "@elonmusk", keyword: "DOGE"},
      trading_action: %{type: "buy", amount: "$100", token: "DOGE"},
      risk_parameters: %{stop_loss: "20%", take_profit: "50%"},
      status: "active",
      anoma_intent_id: "anoma_#{id}",
      execution_count: 0,
      created_at: DateTime.utc_now()
    }
    
    json(conn, intent)
  end

  def create(conn, params) do
    # Mock intent creation
    intent = %{
      id: :crypto.strong_rand_bytes(8) |> Base.encode16(),
      user_address: params["user_address"],
      trigger_conditions: params["trigger_conditions"],
      trading_action: params["trading_action"],
      risk_parameters: params["risk_parameters"],
      status: "active",
      anoma_intent_id: "anoma_" <> (:crypto.strong_rand_bytes(8) |> Base.encode16()),
      execution_count: 0,
      created_at: DateTime.utc_now()
    }
    
    json(conn, %{
      message: "Intent created successfully",
      intent: intent
    })
  end
end
