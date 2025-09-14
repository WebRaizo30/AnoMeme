defmodule AnomemeWeb.HealthController do
  use AnomemeWeb, :controller

  def check(conn, _params) do
    json(conn, %{
      status: "ok",
      message: "ANOMEME Backend is running",
      timestamp: DateTime.utc_now(),
      version: "0.1.0",
      services: %{
        database: "connected",
        phoenix: "1.7.17",
        elixir: System.version()
      }
    })
  end
end
