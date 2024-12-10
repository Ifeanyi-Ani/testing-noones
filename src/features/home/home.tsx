"use client";

import React, { useState, useEffect } from "react";
import { generateAuthUrl, exchangeCodeForToken } from "./utils/actions";

export const Home: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
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

  return (
    <div className="w-[350px]">
      <div>
        <h1>P2P Trading</h1>
        <p>Create a new P2P trade on NoOnes</p>
      </div>
      <div>
        {!accessToken ? (
          <button
            onClick={handleAuth}
            className="bg-black text-white p-2 rounded-full"
          >
            Authorize with NoOnes
          </button>
        ) : (
          <div>You are logged in</div>
        )}
      </div>
      <div>{accessToken && <button> Logout</button>}</div>
    </div>
  );
};
