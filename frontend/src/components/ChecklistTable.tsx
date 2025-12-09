import { ChecklistItem } from '../App';
import { ChecklistCard } from './ChecklistCard';

interface ChecklistTableProps {
  items: ChecklistItem[];
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onStatusChange: (id: string, status: 'Completed' | 'Pending') => void;
  onCommentChange: (id: string, comment: string) => void;
}

export function ChecklistTable({
  items,
  onEditItem,
  onDeleteItem,
  onStatusChange,
  onCommentChange,
}: ChecklistTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#1E1F22] border border-[#3F4147] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-[#2B2D31]">
              <th className="text-left px-6 py-4 text-sm text-gray-300 tracking-wide">
                CHECKS
              </th>
              <th className="text-left px-6 py-4 text-sm text-gray-300 tracking-wide">
                STATUS
              </th>
              <th className="text-left px-6 py-4 text-sm text-gray-300 tracking-wide">
                COMMENT(S)
              </th>
              <th className="text-left px-6 py-4 text-sm text-gray-300 tracking-wide w-32">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No checklist items. Click "Add Item" to create one.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-t border-[#3F4147] transition-colors hover:bg-[#252729] ${
                    index % 2 === 0 ? 'bg-[#1E1F22]' : 'bg-[#23242B]'
                  }`}
                >
                  <td className="px-6 py-4 text-white">{item.name}</td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={item.comment}
                      onChange={(e) => onCommentChange(item.id, e.target.value)}
                      className="w-full bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-2 text-white text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      placeholder="Add comments..."
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onEditItem(item.id)}
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {items.length === 0 ? (
          <div className="bg-[#1E1F22] border border-[#3F4147] rounded-xl p-6 text-center text-gray-400">
            No checklist items. Click "Add Item" to create one.
          </div>
        ) : (
          items.map((item) => (
            <ChecklistCard
              key={item.id}
              item={item}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onStatusChange={onStatusChange}
              onCommentChange={onCommentChange}
            />
          ))
        )}
      </div>
    </>
  );
}


