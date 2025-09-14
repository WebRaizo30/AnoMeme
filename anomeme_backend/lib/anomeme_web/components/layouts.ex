defmodule AnomemeWeb.Layouts do
  @moduledoc """
  This module holds different layouts used by your application.
  """

  # Simple root layout
  def root(assigns) do
    """
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>ANOMEME Backend</title>
      </head>
      <body>
        #{assigns[:inner_content] || ""}
      </body>
    </html>
    """
  end

  # Simple app layout  
  def app(assigns) do
    """
    <main>
      #{assigns[:inner_content] || ""}
    </main>
    """
  end
end
