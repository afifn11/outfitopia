const STATUS_CONFIG = {
    Pending:    { label: 'Pending',    class: 'bg-amber-50 text-amber-700 border-amber-200' },
    Processing: { label: 'Processing', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    Shipped:    { label: 'Shipped',    class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    Completed:  { label: 'Completed',  class: 'bg-green-50 text-green-700 border-green-200' },
    Cancelled:  { label: 'Cancelled',  class: 'bg-red-50 text-red-700 border-red-200' },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.class}`}>
            {cfg.label || status}
        </span>
    );
};
export default StatusBadge;
