export function Footer() {
  return (
    <footer className="py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          Built with Rust (WASM), React, and TypeScript 🍁
        </p>
        <a
          href="https://github.com/halfguru/retire-eh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  )
}
