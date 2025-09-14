defmodule AnomemeWeb.AuthController do
  use AnomemeWeb, :controller
  
  # Generate a simple UUID-like string for demo
  defp generate_id do
    :crypto.strong_rand_bytes(16) |> Base.encode16() |> String.downcase()
  end

  def connect_wallet(conn, %{"address" => address, "signature" => _signature, "message" => _message} = params) do
    # TODO: Implement signature verification
    # For now, we'll simulate a successful connection
    
    chain = Map.get(params, "chain", "anoma")
    
    # Create or find user
    user = %{
      id: generate_id(),
      wallet_address: address,
      created_at: DateTime.utc_now() |> DateTime.to_iso8601(),
      last_active: DateTime.utc_now() |> DateTime.to_iso8601(),
      risk_profile: %{
        level: "moderate",
        max_investment_percentage: 25,
        stop_loss_default: 10
      },
      settings: %{
        notifications: true,
        auto_execute: false,
        preferred_chains: [chain]
      }
    }
    
    conn
    |> put_status(:ok)
    |> json(%{
      success: true,
      user: user,
      message: "Wallet connected successfully"
    })
  end

  def verify_signature(conn, %{"address" => address, "signature" => signature, "message" => _message}) do
    # TODO: Implement actual signature verification
    # For development, we'll accept any signature
    
    if String.length(signature) > 10 and String.length(address) > 10 do
      user = %{
        id: generate_id(),
        wallet_address: address,
        created_at: DateTime.utc_now() |> DateTime.to_iso8601(),
        last_active: DateTime.utc_now() |> DateTime.to_iso8601()
      }
      
      conn
      |> put_status(:ok)
      |> json(%{
        success: true,
        user: user,
        message: "Signature verified"
      })
    else
      conn
      |> put_status(:unauthorized)
      |> json(%{
        success: false,
        error: "Invalid signature",
        message: "Wallet signature could not be verified"
      })
    end
  end

  def get_user(conn, %{"address" => address}) do
    # TODO: Get user from database
    # For now, return a mock user
    
    user = %{
      id: generate_id(),
      wallet_address: address,
      email: nil,
      created_at: DateTime.utc_now() |> DateTime.to_iso8601(),
      last_active: DateTime.utc_now() |> DateTime.to_iso8601(),
      risk_profile: %{
        level: "moderate",
        max_investment_percentage: 25,
        stop_loss_default: 10
      },
      settings: %{
        notifications: true,
        auto_execute: false,
        preferred_chains: ["anoma"]
      }
    }
    
    conn
    |> put_status(:ok)
    |> json(user)
  end
end
