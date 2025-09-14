defmodule Anomeme.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :wallet_address, :string, null: false
      add :email, :string
      add :risk_profile, :map, default: %{}
      add :settings, :map, default: %{}
      add :last_active, :utc_datetime
      add :is_active, :boolean, default: true

      timestamps(type: :utc_datetime)
    end

    create unique_index(:users, [:wallet_address])
    create index(:users, [:is_active])
  end
end
