import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2 } from "lucide-react";

export function Home() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate("/builder", { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#20202380_1px,transparent_1px),linear-gradient(to_bottom,#20202380_1px,transparent_1px)] bg-[size:14px_14px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#3B82F620,transparent)]" />
      </div>

      <div className="max-w-2xl w-full relative">
        <div className="text-center space-y-8">
          <div className="inline-flex">
            <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-lg relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
              <Wand2 className="w-12 h-12 text-cyan-500 relative z-10" />
            </div>
          </div>

          <div className="space-y-4 relative">
            <h1 className="text-6xl font-bold text-white tracking-tight [text-shadow:0_0_20px_#3B82F640]">
              Shirox AI
            </h1>
            <p className="text-zinc-400 text-lg">
              Describe your dream website, and we'll help you build it step by
              step
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="p-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />

            <div className="relative bg-zinc-900/90 rounded-xl p-8 space-y-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build..."
                className="w-full h-40 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 p-4 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
              />

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg py-4 px-6 font-medium hover:opacity-90 transition-opacity"
              >
                Generate Website Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
