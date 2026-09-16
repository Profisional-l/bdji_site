'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { headerLinks } from "@/data/headerLinks";
import DropdownMenu from "@/components/dropdown_menu/DropdownMenu";

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            document.body.style.overflow = newState ? "hidden" : "";
            if (newState) window.scrollTo(0, 0);
            return newState;
        });
    };

    const closeMenu = () => {
        setIsOpen(false);
        document.body.style.overflow = "";
    };

    useEffect(() => {
        const handleRouteChange = () => closeMenu();

        router.prefetch && router.prefetch("/");
        return () => closeMenu();
    }, [router]);

    return (
        <div className="md:hidden flex h-inherit items-center z-50">
            <button
                onClick={toggleMenu}
                className={`relative w-8 h-8 flex flex-col items-center justify-center gap-2 z-50`}
                aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
                title={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
                <span className={`block h-[2px] w-full bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2.5" : ""}`} />
                <span className={`block h-[2px] w-full bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`block h-[2px] w-full bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </button>

            {isOpen && (
                <div className="fixed w-full min-h-full h-screen left-0 top-0 bg-blue overflow-y-auto">
                    <nav className="w-full pt-[50px] pl-[50px] pb-[50px] text-white">
                        <ul className="flex flex-col gap-8">
                            {headerLinks.map((item, index) => (
                                <li key={index} className="list__item">
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="cursor-pointer text-base font-semibold hover:underline underline-offset-4"
                                            onClick={closeMenu}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <DropdownMenu submenuItems={item.submenu}>
                                            {item.name}
                                        </DropdownMenu>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mb-[50px] bottom-0">
                        <div className="w-full border-t-2 border-white"></div>
                        <p className="flex flex-col text-white items-center gap-2 mt-[50px]">
                            <span className="flex flex-col items-center">
                                <span className="text-lg">Совместный институт</span>
                                <span>БГУ и ДПУ</span>
                            </span>
                            <span>+375 (17) 209-53-72</span>
                            <span>© {new Date().getFullYear()}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BurgerMenu;
