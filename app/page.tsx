import Image from "next/image";

export default function Home() {
  return (
    <>
      <button className="absolute top-2.5 right-2.5 rounded-3xl text-white px-8 py-1.5 bg-spotify hover:bg-spotifyHover">
        <span className="text-sm">Login</span>
      </button>
      <div className="flex justify-center items-center flex-col h-screen">
        <h1 className="text-[40px]">Music Tab</h1>
        <div>
          <form>
            <input
              type="search"
              placeholder="Search..."
              className="w-[450px] p-2.5 rounded-3xl"
            />
          </form>
        </div>
      </div>
    </>
  );
}
