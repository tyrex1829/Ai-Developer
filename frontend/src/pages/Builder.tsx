import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StepsList } from "../components/StepsList";
import { FileExplorer } from "../components/FileExplorer";
import { TabView } from "../components/TabView";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import { Step, FileItem, StepType } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseXml } from "../steps";
import { useWebContainer } from "../hooks/useWebContainer";
// import { FileNode } from "@webcontainer/api";
// import { Loader } from "../components/Loader";
import { Wand2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// const MOCK_FILE_CONTENT = `// This is a sample file content
// import React from 'react';

// function Component() {
//   return <div>Hello World</div>;
// }

// export default Component;`;

export function Builder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  const handleLogoClick = () => {
    navigate("/");
  };

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          const finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            const currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              const file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              const folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim(),
    });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;

    setSteps(
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending",
      }))
    );

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      })),
    });

    setLoading(false);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      }))
    );

    setLlmMessages((x) => [
      ...x,
      { role: "assistant", content: stepsResponse.data.response },
    ]);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Tech grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#20202380_1px,transparent_1px),linear-gradient(to_bottom,#20202380_1px,transparent_1px)] bg-[size:14px_14px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#3B82F620,transparent)]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-zinc-800/80 bg-zinc-950/50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#20202380_1px,transparent_1px),linear-gradient(to_bottom,#20202380_1px,transparent_1px)] bg-[size:14px_14px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#3B82F620,transparent)]" />
        </div>

        <div className="relative px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-zinc-900/80 border border-zinc-800/80 rounded-lg relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
              <Wand2 className="w-6 h-6 text-cyan-500 relative z-10" />
            </div>
            <div onClick={handleLogoClick} className="cursor-pointer group">
              <h1 className="text-xl font-bold text-white tracking-tight [text-shadow:0_0_20px_#3B82F640]">
                Shirox AI
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <p className="text-sm text-zinc-400">
                  Prompt: <span className="text-zinc-300">{prompt}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          {/* Steps Panel */}
          <div className="col-span-1 h-[calc(100vh-8rem)]">
            <div className="p-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/90 rounded-xl p-4 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 pr-2">
                  <StepsList
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                  />
                </div>

                <div className="flex-shrink-0">
                  {loading || !templateSet ? (
                    <Loader2 className="w-6 h-6 text-cyan-500 animate-spin mx-auto" />
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full h-20 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 p-3 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                      />
                      <button
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            content: userPrompt,
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(
                            `${BACKEND_URL}/chat`,
                            {
                              messages: [...llmMessages, newMessage],
                            }
                          );
                          setLoading(false);

                          setLlmMessages((x) => [...x, newMessage]);
                          setLlmMessages((x) => [
                            ...x,
                            {
                              role: "assistant",
                              content: stepsResponse.data.response,
                            },
                          ]);

                          setSteps((s) => [
                            ...s,
                            ...parseXml(stepsResponse.data.response).map(
                              (x) => ({
                                ...x,
                                status: "pending" as "pending",
                              })
                            ),
                          ]);
                        }}
                        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg py-2 px-4 font-medium hover:opacity-90 transition-opacity"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* File Explorer */}
          <div className="col-span-1 h-[calc(100vh-8rem)]">
            <div className="p-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/90 rounded-xl p-4 h-full">
                <FileExplorer files={files} onFileSelect={setSelectedFile} />
              </div>
            </div>
          </div>

          {/* Code/Preview Panel */}
          <div className="col-span-2 h-[calc(100vh-8rem)]">
            <div className="p-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/90 rounded-xl p-4 h-full">
                <TabView activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="h-[calc(100%-4rem)]">
                  {activeTab === "code" ? (
                    <CodeEditor file={selectedFile} />
                  ) : (
                    <PreviewFrame webContainer={webcontainer} files={files} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
