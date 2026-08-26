export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">UzaNaNunua</span>
        </h1>
        
        <p className="text-xl leading-8 text-gray-600">
          Your premier marketplace for buying and selling. We're currently getting things ready.
        </p>

        <div className="flex gap-4 justify-center mt-10">
          <a
            href="#"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Browse Products
          </a>
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-gray-900 border border-gray-300 rounded-md px-3.5 py-2.5 hover:bg-gray-100"
          >
            Start Selling <span aria-hidden="true">→</span>
          </a>
        </div>
      </main>
    </div>
  );
}
