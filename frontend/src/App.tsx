function App() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-violet-600">
          Aionys test task
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Notes
        </h1>

        <p className="mt-3 text-gray-600">
          A simple space for your thoughts and ideas.
        </p>

        <button
          type="button"
          className="mt-6 rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white transition hover:bg-violet-700"
        >
          Create your first note
        </button>
      </section>
    </main>
  )
}

export default App