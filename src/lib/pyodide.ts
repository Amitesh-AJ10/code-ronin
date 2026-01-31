import { loadPyodide, PyodideInterface } from 'pyodide';

class PyodideManager {
    private static instance: PyodideManager;
    private pyodide: PyodideInterface | null = null;
    private initPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): PyodideManager {
        if (!PyodideManager.instance) {
            PyodideManager.instance = new PyodideManager();
        }
        return PyodideManager.instance;
    }

    public async init(): Promise<void> {
        if (this.pyodide) return;
        if (this.initPromise) return this.initPromise;

        this.isLoading = true;
        this.initPromise = (async () => {
            try {
                let pyodideInstance: PyodideInterface;

                // We use the CDN script injected in index.html, so 'loadPyodide' should be available globally
                // or we can import it if we configured the bundler correctly.
                // For this hackathon setup relying on the CDN script is safer for asset loading.
                // @ts-ignore - loadPyodide might be global if we use the script tag
                if (typeof (window as any).loadPyodide === 'function') {
                    pyodideInstance = await (window as any).loadPyodide({
                        indexURL: "https://cdn.jsdelivr.net/npm/pyodide@0.29.3/full/"
                    });
                } else {
                    // Fallback to npm package if global is not found (though index.html has it)
                    pyodideInstance = await loadPyodide({
                        indexURL: "https://cdn.jsdelivr.net/npm/pyodide@0.29.3/full/"
                    });
                }

                await pyodideInstance.loadPackage(['numpy', 'pandas']); // Preload common data science libs
                this.pyodide = pyodideInstance;
                console.log("Pyodide Ready");
            } catch (error) {
                console.error("Failed to load Pyodide:", error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        })();

        return this.initPromise;
    }

    public async runCode(code: string): Promise<{ output: string; error: string | null }> {
        if (!this.pyodide) {
            await this.init();
        }

        try {
            // Capture stdout
            this.pyodide!.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

            await this.pyodide!.runPythonAsync(code);

            const stdout = this.pyodide!.runPython("sys.stdout.getvalue()");
            const stderr = this.pyodide!.runPython("sys.stderr.getvalue()");

            return { output: stdout + (stderr ? "\nError:\n" + stderr : ""), error: null };
        } catch (err: any) {
            return { output: "", error: err.message };
        }
    }

    public isReady(): boolean {
        return this.pyodide !== null;
    }
}

export const pyodideManager = PyodideManager.getInstance();
