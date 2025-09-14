defmodule Anomeme.Schemas.Intent do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "intents" do
    field :anoma_intent_id, :string
    field :trigger_conditions, :map
    field :trading_action, :map
    field :risk_parameters, :map
    field :status, :string, default: "active"
    field :execution_count, :integer, default: 0
    field :executions, :map, default: %{}
    field :anoma_metadata, :map, default: %{}

    belongs_to :user, Anomeme.Schemas.User

    timestamps(type: :utc_datetime)
  end

  def changeset(intent, attrs) do
    intent
    |> cast(attrs, [:anoma_intent_id, :trigger_conditions, :trading_action, :risk_parameters, :status, :execution_count, :executions, :anoma_metadata, :user_id])
    |> validate_required([:trigger_conditions, :trading_action, :risk_parameters, :user_id])
    |> validate_inclusion(:status, ["active", "paused", "completed", "failed", "cancelled"])
    |> unique_constraint(:anoma_intent_id)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end

  def update_status_changeset(intent, status) do
    intent
    |> cast(%{status: status}, [:status])
    |> validate_inclusion(:status, ["active", "paused", "completed", "failed", "cancelled"])
  end
end
