interface GameProps {
    game: any;
}

function priceDiscount({ game }: GameProps) {
    // If game is missing or doesn't have prices yet, return 0
    if (!game || !game.price || !game.oldPrice) {
      return 0;
    }
    
    const discount = Math.round(((game.price / game.oldPrice) - 1) * -100);
    return discount;
}

export default function GameCard ({game}: GameProps) {
    const getPlatformIcon = (platform: string) => {
        if (platform.includes('Xbox')) return '🎮';
        if (platform.includes('Nintendo')) return '🕹️';
        return '💻'; // Default for PC/EA App
    };
    return (
        <div className="group border border-[#269F87] relative bg-[#2d007a] overflow-hidden transition-all duration-300 gover:ring-2 hover:ring-purple-400 hover:-translate-y-1 shadow-2xl">
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={game.image}
                    alt={game.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm py-2 px-3 flex items-center justify-center gap-2 border-t border-white/10">
                    <span className="text-[10px] opacity-80">{getPlatformIcon(game.platform)}</span>
                    <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase">
                        {game.platform}
                    </span>
                </div>  
                <div className="absolute bottom-12 left- bg-[#00ffcc] text-[#003322] px-4 py-2  text-[12px] font-black flex items-center gap-1">
                    <span className="text-xs">🔄</span> CASHBACK
                </div>
            </div>

            <div className="p-4 flex flex-col justify-between ">
                <h3 className="text-[16px] font-bold leading-tight group-hover:text-purple-300">
                    {game.title} ({game.platform}) {game.region}
                </h3>
                <p className="text-[#269F87] text-[12px] font-bold mt-1 tracking-wider">{game.region}</p>
            </div>

            <div className="flex items-end justify-between p-4">
                <div className="flex flex-col">
                    <div className="flex gap-1">
                        <div className="flex gap-1">
                            <span className="text-[14px] text-white/60 font-bold">From</span>
                            <span className="text-[14px] line-through text-white/40">€{game.oldPrice}</span>
                        </div>
                        <span className="text-[14px] text-green/40 text-[#7BD328] font-extrabold">-{priceDiscount({ game })}%</span>
                    </div>
                    <span className="text-[28px] font-extrabold text-white">€{game.price}</span>
                    <p className="text-[14px] font-extrabold text-[#7BD328]">Cashback: <span className="text-[#7BD328] font-extrabold">€{game.cashback}</span></p>
                </div>
            </div>
            <div className="flex px-4 py-4 gap-2">
            <button className="hover rounded-full transition-all group/heart backdrop-blur-sm">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className="w-5 h-5 text-white/40 group-hover/heart:fill-pink-500 group-hover/heart:text-pink-500 transition-colors">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                </svg>
            </button>
            <p className="text-white/40">999</p>
            </div>
        </div>
    );
}