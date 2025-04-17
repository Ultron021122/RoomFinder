import { Avatar } from '@nextui-org/react';
import { useEffect, useRef } from 'react';
import useDropdownStore from '@/stores/useDropdownStore';
import { User } from 'lucide-react';

interface DropdownItem {
  text: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'light' | 'dark';
  onClick?: () => void;
}

interface DropdownProps {
  usuarioName: string;
  vchimage: string;
  vchemail: string;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ usuarioName, vchimage, vchemail, items }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, toggleDropdown, closeDropdown } = useDropdownStore();

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="text-gray-600 dark:text-gray-400 rounded focus:outline-none"
      >
        <Avatar
          src={vchimage}
          size='sm'
          color='primary'
          classNames={{
            base: "ring-offset-gray-900 mr-1"
          }}
          isBordered
        />
      </div>
      {isOpen && (
        <ul
          className={`absolute left-full w-max rounded-md px-2 py-2 ml-6 border invisible -translate-x-3 transition-all
             group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 bg-white border-gray-300 dark:bg-gray-950
             dark:border-gray-900 shadow-lg`}
        >
          <li className="px-4 py-2 text-xs sm:text-sm text-black dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
            <Avatar
              src={vchimage}
              size='sm'
              color='primary'
              classNames={{
                base: "ring-offset-gray-900 mr-2"
              }}
              isBordered
            />
            <div className='flex flex-col'>
              <p>
                {usuarioName}
              </p>
              <span className='text-xs'>
                {vchemail}
              </span>
            </div>
          </li>
          {items.map((item, index) => (
            <li
              key={index}
              className={`
                px-4 py-2 text-xs sm:text-sm cursor-pointer 
                transition-all duration-300 ease-in-out 
                rounded-lg 
                ${item.color === 'primary' ? 'text-gray-900 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 dark:hover:text-gray-200' : ''}
                ${item.color === 'secondary' ? 'text-gray-900 dark:text-gray-200 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300' : ''}
                ${item.color === 'success' ? 'text-gray-900 dark:text-gray-200 hover:bg-green-600 hover:text-white dark:hover:bg-green-700 dark:hover:text-gray-200' : ''}
                ${item.color === 'warning' ? 'text-gray-900 dark:text-gray-200 hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-600 dark:hover:text-gray-200' : ''}
                ${item.color === 'error' ? 'text-gray-900 dark:text-gray-200 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-gray-200' : ''}
                ${item.color === 'info' ? 'text-gray-900 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:text-gray-200' : ''}
              `}
              onClick={item.onClick}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
