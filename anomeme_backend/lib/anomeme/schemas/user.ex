defmodule Anomeme.Schemas.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :wallet_address, :string
    field :email, :string
    field :risk_profile, :map, default: %{}
    field :settings, :map, default: %{}
    field :last_active, :utc_datetime
    field :is_active, :boolean, default: true

    has_many :intents, Anomeme.Schemas.Intent

    timestamps(type: :utc_datetime)
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:wallet_address, :email, :risk_profile, :settings, :last_active, :is_active])
    |> validate_required([:wallet_address])
    |> validate_format(:wallet_address, ~r/^0x[a-fA-F0-9]{40}$|^anoma[a-zA-Z0-9]+$/, message: "must be a valid wallet address")
    |> unique_constraint(:wallet_address)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end
end
