defmodule Anomeme.Schemas.SocialSignal do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "social_signals" do
    field :platform, :string
    field :user_handle, :string
    field :content, :string
    field :sentiment, :string
    field :confidence, :float
    field :tokens_mentioned, {:array, :string}, default: []
    field :raw_data, :map, default: %{}
    field :processed_at, :utc_datetime
    field :is_processed, :boolean, default: false

    timestamps(type: :utc_datetime)
  end

  def changeset(signal, attrs) do
    signal
    |> cast(attrs, [:platform, :user_handle, :content, :sentiment, :confidence, :tokens_mentioned, :raw_data, :processed_at, :is_processed])
    |> validate_required([:platform, :user_handle, :content, :sentiment, :confidence])
    |> validate_inclusion(:platform, ["x", "telegram", "discord", "reddit"])
    |> validate_inclusion(:sentiment, ["positive", "negative", "neutral"])
    |> validate_number(:confidence, greater_than_or_equal_to: 0.0, less_than_or_equal_to: 1.0)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end

  def mark_processed_changeset(signal) do
    signal
    |> cast(%{is_processed: true, processed_at: DateTime.utc_now()}, [:is_processed, :processed_at])
  end
end
