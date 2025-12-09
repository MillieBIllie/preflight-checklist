import { ChecklistItem } from '../App';

interface ChecklistCardProps {
  item: ChecklistItem;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onStatusChange: (id: string, status: 'Completed' | 'Pending') => void;
  onCommentChange: (id: string, comment: string) => void;
}

export function ChecklistCard({
  item,
  onEditItem,
  onDeleteItem,
  onStatusChange,
  onCommentChange,
}: ChecklistCardProps) {
  return (
    <div className="bg-[#1E1F22] border border-[#3F4147] rounded-xl p-6 shadow-xl">
      {/* Header with Check Name and Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-white">{item.name}</h3>
        <select
          value={item.status}
          onChange={(e) =>
            onStatusChange(item.id, e.target.value as 'Completed' | 'Pending')
          }
          className={`px-4 py-2 rounded-full text-white text-sm cursor-pointer border-none outline-none transition-colors ${
            item.status === 'Completed'
              ? 'bg-[#22C55E] hover:bg-[#16A34A]'
              : 'bg-[#F59E0B] hover:bg-[#D97706]'
          }`}
        >
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Comment Section */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-2 block">COMMENT(S)</label>
        <textarea
          value={item.comment}
          onChange={(e) => onCommentChange(item.id, e.target.value)}
          className="w-full bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white text-sm resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          placeholder="Add comments..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onEditItem(item.id)}
          className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-3 rounded-lg transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteItem(item.id)}
          className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-3 rounded-lg transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}


