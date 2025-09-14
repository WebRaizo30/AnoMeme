defmodule AnomemeWeb.SocialController do
  use AnomemeWeb, :controller

  def signals(conn, _params) do
    # Mock social signals
    signals = [
      %{
        id: "1",
        user: "@elonmusk",
        content: "DOGE to the moon! 🚀",
        timestamp: DateTime.utc_now(),
        sentiment: "positive",
        confidence: 0.92,
        tokens_mentioned: ["DOGE"]
      },
      %{
        id: "2", 
        user: "@whale_alert",
        content: "🚨 50M USDC moved to Binance",
        timestamp: DateTime.add(DateTime.utc_now(), -15, :second),
        sentiment: "neutral",
        confidence: 0.85,
        tokens_mentioned: ["USDC"]
      },
      %{
        id: "3",
        user: "@VitalikButerin",
        content: "Ethereum scaling progress is amazing",
        timestamp: DateTime.add(DateTime.utc_now(), -60, :second),
        sentiment: "positive",
        confidence: 0.78,
        tokens_mentioned: ["ETH"]
      }
    ]
    
    json(conn, %{signals: signals})
  end

  def sources(conn, _params) do
    # Mock social sources
    sources = [
      %{
        id: "1",
        type: "x",
        handle: "@elonmusk",
        active: true,
        followers: "150M",
        weight: 1.0
      },
      %{
        id: "2",
        type: "x", 
        handle: "@whale_alert",
        active: true,
        followers: "2.1M",
        weight: 0.8
      },
      %{
        id: "3",
        type: "x",
        handle: "@VitalikButerin", 
        active: true,
        followers: "5.2M",
        weight: 0.9
      }
    ]
    
    json(conn, %{sources: sources})
  end
end
