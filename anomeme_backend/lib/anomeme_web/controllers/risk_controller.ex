defmodule AnomemeWeb.RiskController do
  use AnomemeWeb, :controller

  def assess(conn, %{"token_address" => token_address} = params) do
    chain = params["chain"] || "ethereum"
    
    # Mock risk assessment
    risk_factors = %{
      contract_verified: :rand.uniform() > 0.3,
      liquidity_locked: :rand.uniform() > 0.2,
      holder_distribution: :rand.uniform(),
      honeypot_detected: :rand.uniform() < 0.1,
      rug_probability: :rand.uniform() * 0.3
    }
    
    risk_score = calculate_risk_score(risk_factors)
    
    assessment = %{
      token_address: token_address,
      chain: chain,
      risk_score: risk_score,
      risk_level: risk_level(risk_score),
      risk_factors: risk_factors,
      assessment_timestamp: DateTime.utc_now(),
      recommendations: get_recommendations(risk_score)
    }
    
    json(conn, assessment)
  end

  defp calculate_risk_score(factors) do
    score = 0
    
    score = if factors.contract_verified, do: score, else: score + 25
    score = if factors.liquidity_locked, do: score, else: score + 30
    score = if factors.honeypot_detected, do: score + 40, else: score
    score = score + round(factors.rug_probability * 100)
    
    min(score, 100)
  end

  defp risk_level(score) when score < 20, do: "low"
  defp risk_level(score) when score < 50, do: "medium" 
  defp risk_level(score) when score < 80, do: "high"
  defp risk_level(_), do: "critical"

  defp get_recommendations(score) when score < 20 do
    ["Safe to trade", "Low risk detected", "Proceed with normal position sizing"]
  end
  defp get_recommendations(score) when score < 50 do
    ["Medium risk detected", "Use smaller position sizes", "Monitor closely"]
  end
  defp get_recommendations(score) when score < 80 do
    ["High risk detected", "Trade with caution", "Use tight stop losses"]
  end
  defp get_recommendations(_) do
    ["CRITICAL RISK", "Do not trade", "High probability of rug pull"]
  end
end
