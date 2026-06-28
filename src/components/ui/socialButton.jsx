
// Reusable Social Button Component
const SocialButton = ({ provider, icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      {icon}
      <span>{provider}</span>
    </button>
  );
};

export default SocialButton;