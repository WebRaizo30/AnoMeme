defmodule Anomeme.Repo do
  use Ecto.Repo,
    otp_app: :anomeme,
    adapter: Ecto.Adapters.Postgres
end
