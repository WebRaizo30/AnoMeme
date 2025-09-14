defmodule Anomeme.Repo.Migrations.CreateRiskAssessments do
  use Ecto.Migration

  def change do
    create table(:risk_assessments, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :token_address, :string, null: false
      add :chain, :string, null: false
      add :risk_score, :integer, null: false
      add :risk_level, :string, null: false
      add :risk_factors, :map, null: false
      add :recommendations, {:array, :string}, default: []
      add :assessment_data, :map, default: %{}
      add :is_valid, :boolean, default: true
      add :expires_at, :utc_datetime

      timestamps(type: :utc_datetime)
    end

    create index(:risk_assessments, [:token_address])
    create index(:risk_assessments, [:chain])
    create index(:risk_assessments, [:risk_level])
    create index(:risk_assessments, [:is_valid])
    create index(:risk_assessments, [:expires_at])
  end
end
