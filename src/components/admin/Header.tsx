import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { menu } from "@/navigation/sidebar";
import { Link, useLocation } from "react-router-dom";

const Header = ({ sidebarClick }: { sidebarClick: boolean }) => {
    const { pathname } = useLocation();
    const [showSidebarMenu, setShowSidebarMenu] = useState(false);

    const closeSidebarWithTransition = () => {
        setTimeout(() => {
            setShowSidebarMenu(false);
        }, 100);
    };

    const handleLogout = () => {
        alert("Logged Out!");
    };

    return (
        <div className={`w-full fixed top-0 right-0 z-40 bg-white border-b border-slate-200 transition-all duration-300 ${
            sidebarClick ? "lg:w-[calc(100%-80px)]" : "lg:w-[calc(100%-240px)]"
        }`}>
            {/* Mobile Header Bar (< 1024px / lg) */}
            <div className="flex lg:hidden items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-white">
                {showSidebarMenu ? (
                    <IoClose
                        size={26}
                        className="text-[#fe9f43] cursor-pointer"
                        onClick={() => setShowSidebarMenu(false)}
                    />
                ) : (
                    <GiHamburgerMenu
                        size={22}
                        className="text-[#fe9f43] cursor-pointer"
                        onClick={() => setShowSidebarMenu(true)}
                    />
                )}

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#fe9f43] flex items-center justify-center text-white font-black text-sm shadow-xs">
                        W
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-black text-sm leading-none">
                            WEBNS
                        </span>
                        <span className="text-[9px] text-[#fe9f43] font-black tracking-widest uppercase">
                            TASK SYSTEM
                        </span>
                    </div>
                </div>


            </div>

            {/* Mobile Slide-over Sidebar Menu */}
            {showSidebarMenu && (
                <div className="lg:hidden fixed top-14 left-0 w-full h-[calc(100vh-56px)] bg-white border-t border-slate-200 overflow-y-auto z-50 p-4 shadow-xl">
                    {menu.map((section) => (
                        <div key={section.sectionName} className="mb-4">
                            <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-2">
                                {section.sectionName}
                            </p>
                            {section.items.map((item) => {
                                const isActive = pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        onClick={closeSidebarWithTransition}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold mb-1 transition-colors min-h-[44px] ${
                                            isActive
                                                ? "bg-[#fe9f43] text-black"
                                                : "text-black hover:bg-slate-50"
                                        }`}
                                    >
                                        <Icon className={isActive ? "text-white" : "text-slate-600"} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop Top Navbar (>= 1024px / lg) Clean Header Bar */}
            <div className="hidden lg:flex justify-end items-center px-6 py-3 bg-white">
                {/* Right Area: User Profile Badge */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5 p-1 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div className="w-8 h-8 rounded-full bg-[#fe9f43] text-white flex items-center justify-center font-bold text-xs">
                            KZ
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black text-black">Kazi Ziaur Rahman</p>
                            <p className="text-[10px] text-slate-500 font-medium">Front-End Developer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
