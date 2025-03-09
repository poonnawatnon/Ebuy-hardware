export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center py-20 md:py-36 space-y-8 md:space-y-14">
        <div>
          <h1 className="font-semibold text-2xl sm:text-4xl md:text-6xl leading-[110%]">
            Welcome to{' '}
            <span className="text-blue-500">EBuy</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Buy and sell PC components, complete builds, and accessories.
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-full transition-colors">
            Browse Items
          </button>
          <button className="text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md text-sm transition-colors">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}