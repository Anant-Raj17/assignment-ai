import React from "react";
import EssayGenerator from "../components/EssayGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          AI Essay Generator
        </h1>
        <EssayGenerator />
      </main>
    </div>
  );
}
