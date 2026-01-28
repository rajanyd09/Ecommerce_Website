const Message = ({ variant, children }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "success":
        return {
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#6ee7b7'
        };
      case "error":
      case "danger":
        return {
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5'
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          color: '#93c5fd'
        };
    }
  };

  return (
    <div className="p-4 rounded-lg font-medium" style={getVariantStyle()}>
      {children}
    </div>
  );
};

export default Message;
