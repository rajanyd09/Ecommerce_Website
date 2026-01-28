const Loader = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-transparent"
        style={{
          borderTopColor: '#3b82f6',
          borderBottomColor: '#8b5cf6'
        }}
      ></div>
    </div>
  );
};

export default Loader;
