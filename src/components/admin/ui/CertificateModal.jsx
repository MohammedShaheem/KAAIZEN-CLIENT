export default function CertificateModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Experience Certificate
        </h2>

        <iframe
          src={url}
          title="Experience Certificate"
          className="w-full h-[500px] border rounded"
        />
      </div>
    </div>
  );
}
