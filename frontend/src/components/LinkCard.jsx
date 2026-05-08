import { trackClick } from '../services/api';

const LinkCard = ({ title, url, description, icon, color }) => {
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await trackClick({
        link_url: url,
        link_title: title,
        ip_address: '0.0.0.0'
      });
      // REMOVED: toast.loading, toast.success, toast.error
      window.open(url, '_blank');
    } catch (error) {
      console.error('Track error:', error);
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* Your existing card content */}
    </div>
  );
};

export default LinkCard;