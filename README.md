
# Audio Speed Typer

An application to test your spelling and typing speed. A random word is spoken, and you must type it from memory as fast as you can to see your score and words per minute (WPM).

## Features

-   **Spelling Test Format**: Hear the word, then type it without seeing it first.
-   **Text-to-Speech (TTS)**: Utilizes the browser's built-in speech synthesis for audio playback.
-   **Performance Metrics**: Calculates your typing time and WPM score after each word.
-   **Minimalist UI**: A clean, dark-themed interface designed for focus.
-   **Audio Replay**: A button to hear the word again if you miss it.
-   **Auditory Countdown**: A 3-second countdown with beeps to prepare you for the test.
-   **No Build Step Required**: Runs directly in the browser using modern JavaScript features like import maps.
-   **Developer "Cheat"**: A console command (`logTheWord()`) to see the current word for debugging.

## Running Locally

This project is set up to run directly in the browser without any build tools like Webpack or Vite. All you need is a simple local web server.

1.  **Clone or download the code** to your local machine.

2.  **Navigate to the project directory** in your terminal:
    ```bash
    cd path/to/your/project
    ```

3.  **Start a local web server**. If you have Node.js installed, the easiest way is using the `serve` package:
    ```bash
    # If you don't have 'serve' installed, run this first:
    # npm install -g serve
    
    serve .
    ```
    Alternatively, if you have Python installed, you can use its built-in server:
    ```bash
    # For Python 3
    python3 -m http.server
    
    # For Python 2
    python -m SimpleHTTPServer
    ```

4.  **Open your browser** and go to the URL provided by the server (usually `http://localhost:3000`, `http://localhost:8000`, or `http://localhost:5000`).

## Deployment

Since this is a static application, you can deploy it to any static hosting service. Services like **Vercel**, **Netlify**, and **GitHub Pages** offer generous free tiers and are very easy to set up.

The general process is as follows:

1.  **Push your code to a Git repository** (e.g., on GitHub, GitLab, or Bitbucket).

2.  **Sign up for a static hosting provider** (we'll use Vercel as an example).

3.  **Connect your Git repository** to the provider.

4.  **Configure the project settings**. This is the most important step. Because our app doesn't have a build step, you need to tell the hosting provider to just serve the files as they are.

    Here are the typical settings for Vercel, Netlify, or similar platforms:

    -   **Framework Preset**: Select `Other` or `None`.
    -   **Build Command**: Leave this **EMPTY**. There is nothing to build.
    -   **Output Directory**: Set this to the root directory (`.`). This tells the service that your `index.html` is in the main folder.
    -   **Install Command**: Leave this **EMPTY**.

5.  **Deploy!**

The hosting provider will now serve your `index.html` file and all the associated assets (`.tsx`, `.ts` files), and your application will be live on the web. The browser handles the "compilation" of the JSX and TypeScript code on the fly thanks to the project's setup with `esm.sh`.
