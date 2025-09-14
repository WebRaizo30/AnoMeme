defmodule Anomeme.Repo.Migrations.CreateIntents do
  use Ecto.Migration

  def change do
    create table(:intents, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      add :anoma_intent_id, :string
      add :trigger_conditions, :map, null: false
      add :trading_action, :map, null: false
      add :risk_parameters, :map, null: false
      add :status, :string, default: "active"
      add :execution_count, :integer, default: 0
      add :executions, :map, default: %{}
      add :anoma_metadata, :map, default: %{}

      timestamps(type: :utc_datetime)
    end

    create index(:intents, [:user_id])
    create index(:intents, [:status])
    create unique_index(:intents, [:anoma_intent_id])
  end
end
