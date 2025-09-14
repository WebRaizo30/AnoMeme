defmodule AnomemeWeb.ErrorHTML do
  @moduledoc """
  This module is invoked by your endpoint in case of errors on HTML requests.
  """
  
  # Simple error handling for API-focused backend
  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end
