import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="ml-2">
      {favoriteCount > 0 && (
        <span className="px-1.5 py-0.5 text-xs text-white rounded-full font-semibold min-w-[20px] text-center inline-block shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
          }}
        >
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
