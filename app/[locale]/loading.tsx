export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="animate-pulse text-gray-400 font-light tracking-widest text-sm">
        LOADING...
      </div>
    </div>
  );
}
