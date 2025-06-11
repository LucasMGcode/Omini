import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface UserCardProps {
  name: string;
  role: string;
  avatarUrl?: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ name, role, avatarUrl, onDelete, onEdit}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 flex items-center justify-between border-0 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 overflow-hidden flex items-center justify-center mr-4 shadow-lg">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-white font-semibold font-poppins text-lg">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 font-poppins">{name}</h3>
          <p className="text-sm text-purple-600 font-montserrat">{role}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={onEdit} className="p-2 rounded-lg hover:bg-purple-50 text-purple-500 hover:text-purple-700 transition-all duration-300 hover:cursor-pointer">
          <Edit className="h-4 w-4" />
        </button>
        <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-all duration-300 hover:cursor-pointer">
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
