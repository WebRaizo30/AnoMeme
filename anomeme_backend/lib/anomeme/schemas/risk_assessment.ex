defmodule Anomeme.Schemas.RiskAssessment do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "risk_assessments" do
    field :token_address, :string
    field :chain, :string
    field :risk_score, :integer
    field :risk_level, :string
    field :risk_factors, :map
    field :recommendations, {:array, :string}, default: []
    field :assessment_data, :map, default: %{}
    field :is_valid, :boolean, default: true
    field :expires_at, :utc_datetime

    timestamps(type: :utc_datetime)
  end

  def changeset(assessment, attrs) do
    assessment
    |> cast(attrs, [:token_address, :chain, :risk_score, :risk_level, :risk_factors, :recommendations, :assessment_data, :is_valid, :expires_at])
    |> validate_required([:token_address, :chain, :risk_score, :risk_level, :risk_factors])
    |> validate_inclusion(:chain, ["ethereum", "polygon", "bsc", "arbitrum", "optimism"])
    |> validate_inclusion(:risk_level, ["low", "medium", "high", "critical"])
    |> validate_number(:risk_score, greater_than_or_equal_to: 0, less_than_or_equal_to: 100)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end

  def expire_changeset(assessment) do
    assessment
    |> cast(%{is_valid: false}, [:is_valid])
  end
end
