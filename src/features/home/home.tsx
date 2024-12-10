"use client";

import React, { useState, useEffect } from "react";
import { generateAuthUrl, exchangeCodeForToken } from "./utils/actions";

export const Home: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("BTC");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const storedState = localStorage.getItem("oauth_state");

    if (code && state && state === storedState) {
      exchangeCodeForToken(code)
        .then((data) => {
          setAccessToken(data.access_token);
          localStorage.setItem("access_token", data.access_token);
        })
        .catch((error) =>
          console.error("Error exchanging code for token:", error),
        );
    } else {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  const handleAuth = async () => {
    const authUrl = generateAuthUrl(["trade.create", "trade.read"]);
    window.location.href = await authUrl;
  };

  const handleTrade = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      const response = await fetch("https://api.noones.com/p2p/trade/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          // Add other necessary parameters for creating a trade
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create trade");
      }

      const data = await response.json();
      console.log("Trade created:", data);
      // Handle successful trade creation (e.g., show success message, update UI)
    } catch (error) {
      console.error("Error creating trade:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="w-[350px]">
      <div>
        <h1>P2P Trading</h1>
        <p>Create a new P2P trade on NoOnes</p>
      </div>
      <div>
        {!accessToken ? (
          <button onClick={handleAuth}>Authorize with NoOnes</button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="currency">Currency</label>
              <input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="Enter currency (e.g., BTC)"
              />
            </div>
          </div>
        )}
      </div>
      <div>
        {accessToken && <button onClick={handleTrade}>Create Trade</button>}
      </div>
    </div>
  );
};
