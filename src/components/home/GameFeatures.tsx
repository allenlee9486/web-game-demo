export const GameFeatures = () => {
  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Game Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
              <h3 className="font-bold mb-2">Free to Play</h3>
              <p className="text-gray-600 dark:text-gray-400">Play instantly in your browser without downloads.</p>
           </div>
           <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
              <h3 className="font-bold mb-2">No Registration</h3>
              <p className="text-gray-600 dark:text-gray-400">Jump right into the action without creating an account.</p>
           </div>
           <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
              <h3 className="font-bold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 dark:text-gray-400">Optimized for all devices including phones and tablets.</p>
           </div>
        </div>
      </div>
    </section>
  );
};
