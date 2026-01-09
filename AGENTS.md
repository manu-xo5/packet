# Packet - Project Context

## Tech Stack
*   **Runtime:** Electron (v37+)
*   **Frontend:** React (v19), Vite, TailwindCSS, Shadcn UI
*   **Language:** TypeScript
*   **State Management:** Zustand, Preact Signals
*   **Data Persistence:** JSON-based state (`packet-state`) and file-based cookie storage.

## Architecture

The project follows a standard Electron Main/Renderer process model with some specific architectural choices:

### 1. Renderer Process (`app/`)
*   **Entry Point:** `app/renderer.tsx`
*   **UI Structure:** `app/components/dashboard.tsx` is the main layout, orchestrating the `Sidebar`, `RequestBox` (headers, body, cookies), and `ResponseBox`.
*   **State:** Uses `app/store/fetcher.tsx` (likely via `CProvider`) to manage the current request/response state.

### 2. Main Process (`lib/main/`)
*   **Entry Point:** `lib/main/main.ts`
*   **Networking:** HTTP requests are executed in the **Main process** to avoid CORS issues and leverage full Node.js networking capabilities.
    *   A `fetcher` is created using `lib/fetch-class.ts` and exposed via IPC (`ipcMain.handle('fetcher', ...)`).
    *   Cookies are persisted to `~/packet-cookie` using `SimpleFileCookieStore`.
*   **IPC:** Direct IPC handlers are registered for specific features (Dialogs, File System, Context Menu) via `register*Ipc` functions.

### 3. Native Window (`lib/native-window/`)
*   Contains C++ (`addon.mm`), Objective-C, and Swift code (`window.swift`) to create a custom native window experience on macOS.
*   Configured via `binding.gyp`.

### 4. Data Storage
*   **`packet-state`**: A JSON file in the project root that stores the user's workspace (saved requests, collections, current state).
*   **`~/packet-cookie`**: Stores cookies in the user's home directory.

## Key Directories

| Directory | Description |
| :--- | :--- |
| **`app/`** | **Renderer Code.** Contains all React components, styles, and frontend logic. |
| **`lib/main/`** | **Main Process Code.** Electron startup, IPC handlers, and system integration. |
| **`lib/native-window/`** | **Native Module.** Source code for the custom macOS window addon. |
| **`lib/`** | **Shared/Utility Code.** Helper functions, types, and the shared fetcher logic. |
| **`resources/`** | **Static Assets.** Icons and build resources. |

## Building and Running

### Prerequisites
*   Node.js (LTS recommended)
*   pnpm (suggested by `pnpm-lock.yaml`)
*   **macOS (for native window):** Xcode command line tools are likely required to build the native addon.

### Commands

*   **Install Dependencies:**
    ```bash
    pnpm install
    ```

*   **Development Server:**
    ```bash
    pnpm run dev
    ```
    *Starts the Vite dev server and launches Electron.*

*   **Build Native Module:**
    ```bash
    pnpm run build:native-window
    ```
    *Compiles the C++/Swift addon. Required if the native module needs rebuilding.*

*   **Production Build:**
    ```bash
    pnpm run build:mac   # Build for macOS
    pnpm run build:win   # Build for Windows
    pnpm run build:linux # Build for Linux
    ```

## Development Conventions
*   **Path Aliases:**
    *   `@/` -> `app/`
    *   `@/lib/` -> `lib/`
    *   `@/resources/` -> `resources/`
*   **Styling:** TailwindCSS is used for styling.
*   **IPC:** Prefer exposing specific, type-safe handlers in `lib/main/` rather than generic "remote" objects.
*   **Linting/Formatting:** `eslint` and `prettier` are configured. Run `npm run lint` and `npm run format` before committing.
