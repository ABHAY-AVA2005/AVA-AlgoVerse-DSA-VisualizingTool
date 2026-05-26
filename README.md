# 🌌 AlgoVerse — DSA Visualizer

### *Visualise and Customise Data Structures & Algorithms on Your Own Terms*

**AlgoVerse** is a high-precision, interactive neo-futuristic platform designed to bridge the gap between **abstract data structures** and **human visual intuition**. It allows students and developers to dynamically manipulate structures, run real-time execution steps, hear algorithm syntheses, and analyze time complexities inside an immersive command-center UI.

### 🔗 Live Deployment Link
* **Production Deployment:** [https://ava-algo-verse-dsa-visualizing-tool.vercel.app/](https://ava-algo-verse-dsa-visualizing-tool.vercel.app/)

---

## 📌 Features & Modules (What They Do)

### 1. 🚀 Neo-Futuristic Homepage & 3D DSA Carousel
* **3D Rotating Carousel:** A stunning 3D projection ring of modular DSA cards (Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hashing) rotates infinitely in virtual space on the homepage.
* **Core Mission Callout:** Declares a loud, explicit commitment to empowering learners to master data structures and algorithms completely on their own terms.
* **Creator Portal:** A sleek, circular floating avatar stacked beautifully on the bottom-right corner of the homepage (directly above the AI Assistant button) that triggers a fully detailed profile containing profile links and social handles.

### 2. 💻 Context-Aware Resizable Code Panels
* **Dynamic Code Syncing:** Displays precise, step-by-step Java code snippets running side-by-side with active algorithm animations.
* **Precision Drag-Protection:** The panel can be dragged freely within its designated visualization section but is bound mathematically so it can never be lost or dragged off-screen.
* **Draggable Header Grips:** Dragging triggers exclusively on the top title bar to prevent accidental shifts when resizing or interacting.
* **Double-Axis Resizing:** Users can scale both width and height dynamically using a native resize handle at the bottom-right corner.
* **Toggles & Collapse Safety:** The panel is protected from deletion; clicking the colored control dots collapses the code window into a compact header without losing position.

### 3. 🎨 Immersive Visualization Engines
* **Arrays (Static & Dynamic):** Add, delete, and modify items on contiguous indices with glowing active indicators.
* **Linked Lists (Singly, Doubly, & Circular):** Track node allocations, dynamic pointer relocations, and linear list traversals.
* **Stacks & Queues:** Watch First-In-First-Out (FIFO) queue buffers and Last-In-First-Out (LIFO) stack pushes/pops.
* **Self-Balancing AVL Trees:** Fully animated binary search trees showcasing recursive insertions, balance factor calculations, and real-time Left-Left, Left-Right, Right-Right, and Right-Left rotations.
* **Graphs & Pathfinding:** Plot node networks and visualize Breadth-First Search (BFS), Depth-First Search (DFS), and Dijkstra's Shortest Path algorithms with dynamic state highlighting.
* **Collision-Handling Hashing:** Interactive chaining arrays and linear probing tables demonstrating key-value hashing logic.
* **CPU Scheduling Simulator:** Dynamic Gantt charts displaying Round Robin, FCFS, SJF, and Priority OS-level processes.

### 4. 🎹 Audio Gamification Engine
* **Synthesized Audio Cues:** Leverages the browser's Web Audio API to map numerical values directly into sound frequencies. Elements sing in real-time as they are compared, swapped, accessed, or successfully inserted.

### 5. ⚡ Granular Speed & Step Playback Controls
* **Granular Speed Bar:** A master speed divider allowing you to fast-forward execution or slow it down into smooth micro-animations.
* **Interactive Step Mode:** Toggle manual step-by-step mode to control transitions line-by-line using a dedicated control dock.

---

## 🖥️ Tech Stack

* **Core & Logic:** React (18+) + TypeScript
* **Build Tooling:** Vite (v7.3) for rapid client compiles
* **Styling & Layouts:** Vanilla CSS + Tailwind CSS utilities
* **Animations:** Framer Motion (for physics-based UI transitions & 3D carousel)
* **Sound Design:** Web Audio API (custom sound wave oscillators)
* **Icons:** Lucide React
* **Deployment:** Vercel (CI/CD pipeline synced with `main` branch)

---

## 📂 Project Structure

```text
AVA-ALGOVERSE-DSA-Visualizer-main
├── public/                     # Static icons and assets
└── src/
    ├── assets/                 # Profile images and JPG resources
    ├── components/
    │   ├── core/               # AIAssistant & CreatorBadge widgets
    │   ├── layouts/            # Navigation sidebar and footer
    │   ├── sections/           # Modular DSA viz pages (Array, Hash, Sched, LL...)
    │   └── ui/                 # Reusable premium HUDs, Select, Inputs, Panels
    ├── lib/
    │   ├── utils.ts            # Timing, calculation, and delay helpers
    │   └── SoundEngine.ts      # Oscillator audio gamification engine
    ├── App.tsx                 # Core section controller
    ├── main.tsx                # Application bootstrap
    └── index.css               # Global styling directives
```

---

## ⚙️ Installation & Run Guide

Follow these steps to spin up the development workspace locally:

1. **Clone the Repo:**
   ```sh
   git clone https://github.com/ABHAY-AVA2005/AVA-AlgoVerse-DSA-Visualizer.git
   cd AVA-AlgoVerse-DSA-Visualizer
   ```

2. **Install Workspace Packages:**
   ```sh
   npm install
   ```

3. **Launch Dev Server:**
   ```sh
   npm run dev
   ```

4. **Access in Browser:**
   Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🤝 Contributing

We welcome structural additions and clean feature proposals:
1. Fork this project.
2. Create a clean feature branch: `git checkout -b feature/CoolAlgorithm`.
3. Commit with a meaningful, descriptive message.
4. Open a Pull Request for review.

---

## 👨‍💻 Creator & Maintainer

**Abhay Varshit Aripirala**  
*Computer Science & Engineering*  
St. Peter’s Engineering College  

* **GitHub:** [@ABHAY-AVA2005](https://github.com/ABHAY-AVA2005)
* **LinkedIn:** [Abhay Varshit Aripirala](https://www.linkedin.com/in/abhay-varshit-ava-9242a1286/)

---

🌌 *AlgoVerse — Where Abstract Algorithms Come Alive.*
