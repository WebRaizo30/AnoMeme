defmodule AnomemeWeb.PageHTML do
  @moduledoc """
  This module contains pages rendered by PageController.
  """

  # Simple home page render
  def home(_assigns) do
    """
    <html>
      <head><title>ANOMEME Backend</title></head>
      <body>
        <h1>ANOMEME API Backend</h1>
        <p>Phoenix Backend Running Successfully!</p>
        <p>API Endpoints:</p>
        <ul>
          <li>GET /api/health - Health check</li>
          <li>GET /api/social/signals - Social signals</li>
          <li>POST /api/intents - Create intent</li>
        </ul>
      </body>
    </html>
    """
  end
end
