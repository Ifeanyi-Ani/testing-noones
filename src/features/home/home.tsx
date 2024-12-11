"use client";

import React, { useState, useEffect } from "react";

export const Home: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
      }
    };
    checkAuth();
  }, []);

  const handleAuth = async () => {
    window.location.href = "/api/auth/login";
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
