import React from "react";
import { Hero } from "./components/Hero";
import { ProjectPair } from "./components/ProjectPair";
import { AIChat } from "./components/AIChat";
import { PROJECTS } from "./data";

const App = () => {
  // Group projects into pairs for the split layout
  const projectPairs = [];
  for (let i = 0; i < PROJECTS.length; i += 2) {
    projectPairs.push({
      left: PROJECTS[i],
      right: PROJECTS[i + 1] || undefined
    });
  }

  return (
    <main className="w-full relative bg-stone-50 min-h-screen">
      <Hero />
      
      <div className="flex flex-col">
        {projectPairs.map((pair, index) => (
          <ProjectPair 
            key={index} 
            projectLeft={pair.left} 
            projectRight={pair.right} 
          />
        ))}
      </div>

      {/* Footer / Contact Hint */}
      <footer className="py-20 text-center bg-stone-50">
         <p className="text-stone-400 font-serif text-sm tracking-widest uppercase">
           Designed & Built with Gemini
         </p>
      </footer>

      <AIChat />
    </main>
  );
};

export default App;
