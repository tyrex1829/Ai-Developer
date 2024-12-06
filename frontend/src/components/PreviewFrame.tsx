import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer | undefined;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  async function main() {
    if (!webContainer) {
      console.error("webContainer is undefined");
      return; // Exit the function if webContainer is not defined
    }

    const installProcess = await webContainer.spawn("npm", ["install"]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    await webContainer.spawn("npm", ["run", "dev"]);

    // Wait for `server-ready` event
    webContainer.on("server-ready", (port, url) => {
      // ...
      console.log(url);
      console.log(port);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);
  return (
    <div className="h-full flex items-center justify-center text-zinc-400 bg-zinc-950/50 rounded-lg">
      {!url && (
        <div className="text-center space-y-2">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-lg relative group inline-block">
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
            <Loader2 className="w-6 h-6 text-cyan-500 animate-spin relative z-10" />
          </div>
          <p className="text-zinc-400">Loading preview...</p>
        </div>
      )}
      {url && (
        <iframe
          width={"100%"}
          height={"100%"}
          src={url}
          className="rounded-lg border border-zinc-800/80"
        />
      )}
    </div>
  );
}
