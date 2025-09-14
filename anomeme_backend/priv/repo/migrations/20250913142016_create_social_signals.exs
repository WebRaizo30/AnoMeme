defmodule Anomeme.Repo.Migrations.CreateSocialSignals do
  use Ecto.Migration

  def change do
    create table(:social_signals, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :platform, :string, null: false
      add :user_handle, :string, null: false
      add :content, :text, null: false
      add :sentiment, :string, null: false
      add :confidence, :float, null: false
      add :tokens_mentioned, {:array, :string}, default: []
      add :raw_data, :map, default: %{}
      add :processed_at, :utc_datetime
      add :is_processed, :boolean, default: false

      timestamps(type: :utc_datetime)
    end

    create index(:social_signals, [:platform])
    create index(:social_signals, [:user_handle])
    create index(:social_signals, [:sentiment])
    create index(:social_signals, [:is_processed])
    create index(:social_signals, [:inserted_at])
  end
end
