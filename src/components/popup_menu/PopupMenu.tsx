'use client';

import React from 'react';
import Link from 'next/link';

import { MenuProps } from '@/interfaces/popupMenuProps';
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon';

const PopupMenu: React.FC<MenuProps> = ({ children, submenuItems }) => {
    return (
        <div className='relative group'>
            <div className='cursor-pointer text-base font-semibold text-white group-hover:text-gray-300 transition-colors duration-150 ease-in-out'>
                {children}
            </div>

            {submenuItems && submenuItems.length > 0 && (
                <div
                    className='absolute bg-white border border-gray-200/75 rounded-lg shadow-xl z-20
                               opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 scale-95 transform
                               transition-all duration-400 ease-in-out min-w-max max-w-[calc(100vw-1rem)]'
                    style={{ left: 'auto', right: 0 }}
                >
                    <ul className='divide-y divide-gray-100 '>
                        {submenuItems.map((submenuItem: any, idx: number) => (
                            <li key={idx}>
                                <Link
                                    href={submenuItem.subhref}
                                    className='flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue hover:text-white
                                               transition-colors duration-250 ease-in-out whitespace-nowrap'
                                    target={submenuItem.blank ? '_blank' : undefined}
                                    rel={submenuItem.blank ? 'noopener noreferrer' : undefined}
                                >
                                    {submenuItem.subname}
                                    {submenuItem.blank && (
                                        <ExternalLinkIcon className="shrink-0" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PopupMenu;
