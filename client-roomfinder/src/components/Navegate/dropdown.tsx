import { Avatar } from '@nextui-org/react';
import { useEffect, useRef } from 'react';
import useDropdownStore from '@/stores/useDropdownStore';

interface DropdownItem {
  text: string;
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
             dark:border-gray-900 dark:text-gray-200 dark:hover:text-white shadow-lg`}
        >
          <li className="px-4 py-2 text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer flex flex-col">
            <p>
            {usuarioName}
            </p>
            <span className='text-xs'>
              {vchemail}
            </span>
          </li>
          {items.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
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
