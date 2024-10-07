'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const route = usePathname();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center px-2 sm:justify-between">
      <h2 className="text-base md:text-xl font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center text-sm md:text-base gap-2">
          <li>
            <Link className="font-medium dark:text-gray-300" href='/dashboard'>
              Panel /
            </Link>
          </li>
          <li>
            <Link className="font-medium text-blue-500" href={route}>
              {pageName}
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
