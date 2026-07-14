const Spinner = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'd-flex justify-content-center align-items-center vh-100'
    : 'd-flex justify-content-center align-items-center py-4';

  return (
    <div className={containerClass}>
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;