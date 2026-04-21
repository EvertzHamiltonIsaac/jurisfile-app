const statusConfig = {
  Open: { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'In Progress': { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'On Hold': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
  Closed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Archived: { color: 'bg-gray-100 text-gray-600 border-gray-200' },
  Pending: { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  Held: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Postponed: { color: 'bg-orange-100 text-orange-700 border-orange-200' },
  Cancelled: { color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    color: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      {status}
    </span>
  );
}
