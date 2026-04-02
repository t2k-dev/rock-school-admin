import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-text-main px-4">
      <div className="relative flex flex-col items-center mb-4">
        <h1 className="text-[340px] font-bold leading-none select-none flex items-center gap-12">
          <span className="text-text-muted">4</span>
          <span className="text-accent/70 mx-[-44px]">0</span>
          <span className="text-text-muted">4</span>
        </h1>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] h-80 w-fit flex items-center justify-center">
          <img
            src="/Guitar404.png"
            alt="Sad guitar"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="h-44" />

      <div className="text-center space-y-8">
        <p className="text-3xl text-text-muted font-light tracking-wide">
          Кажется, мы не можем найти эту страницу...
        </p>
        <Link to="/">
          <button
            className="flex items-center gap-3 bg-accent/40 hover:bg-accent/70 active:bg-accent transition-colors px-12 py-7 rounded-2xl 
            text-text-main font-semibold group mx-auto text-2xl"
            style={{ border: "none" }}
          >
            <Home
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
            На главную
          </button>
        </Link>
      </div>
    </div>
  );
};
