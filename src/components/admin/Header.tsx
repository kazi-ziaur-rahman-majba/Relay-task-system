import { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { menu } from "@/navigation/sidebar";
import { Link, useLocation } from "react-router-dom";
import { MotionDiv } from "@/utils/framer.motion";
import { FaCog, FaSignOutAlt, FaUserCircle, FaSearch } from "react-icons/fa";

const MenuItem = ({
    icon,
    text,
    className = "",
    onClick
}: {
    icon: React.ReactNode;
    text: string;
    className?: string;
    onClick?: () => void;
}) => (
    <div className={`flex items-center gap-3 p-2 hover:bg-[#FFF5EC] cursor-pointer ${className}`} onClick={onClick}>
        {icon}
        <span>{text}</span>
    </div>
);

const Header = ({ sidebarClick }: { sidebarClick: boolean }) => {
    const { pathname } = useLocation();
    const [showSidebarMenu, setShowSidebarMenu] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userImageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                userImageRef.current &&
                !userImageRef.current.contains(event.target as Node)
            ) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-white">
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

                <div className="relative inline-block">
                    <BsThreeDotsVertical
                        size={20}
                        className="text-[#fe9f43] cursor-pointer"
                        onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                    />

                    {showMenuDropdown && (
                        <MotionDiv>
                            <div className="absolute top-8 right-0 w-48 bg-white shadow-xl rounded-xl border border-slate-200 z-50 p-2">
                                <div className="flex items-center gap-2 bg-[#FFF5EC] p-2 rounded-lg mb-2">
                                    <div className="w-9 h-9 rounded-full bg-[#fe9f43] text-white flex items-center justify-center font-bold text-xs">
                                        KZ
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#051A2C]">
                                            Kazi Ziaur Rahman
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            Front-End Developer
                                        </p>
                                    </div>
                                </div>
                                <div className="border-b border-slate-200 pb-1 mb-1">
                                    <MenuItem
                                        icon={<FaUserCircle size={14} className="text-[#fe9f43]" />}
                                        text="My Profile"
                                        className="text-xs text-slate-700 font-medium rounded-md hover:text-[#fe9f43]"
                                    />
                                    <MenuItem
                                        icon={<FaCog size={14} className="text-[#fe9f43]" />}
                                        text="Settings"
                                        className="text-xs text-slate-700 font-medium rounded-md hover:text-[#fe9f43]"
                                    />
                                </div>

                                <MenuItem
                                    icon={<FaSignOutAlt size={14} />}
                                    text="Logout"
                                    className="text-rose-600 text-xs font-medium rounded-md hover:bg-rose-50"
                                    onClick={handleLogout}
                                />
                            </div>
                        </MotionDiv>
                    )}
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
            <div className="hidden lg:flex justify-between items-center px-6 py-3 bg-white">
                {/* Search Bar */}
                <div className="relative w-80">
                    <FaSearch className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-9 pr-9 py-1.5 text-xs bg-slate-100/70 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fe9f43] transition-all"
                    />
                    <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                        ⌘K
                    </kbd>
                </div>

                {/* Right Area: User Profile Dropdown (Notification Icon Removed) */}
                <div className="flex items-center gap-4">
                    {/* User Profile Dropdown */}
                    <div
                        ref={userImageRef}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1 px-3 rounded-xl transition-colors relative border border-slate-200/80 shadow-2xs"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                        <div className="w-8 h-8 rounded-full bg-[#fe9f43] text-white flex items-center justify-center font-bold text-xs">
                            KZ
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black text-black">Kazi Ziaur Rahman</p>
                            <p className="text-[10px] text-slate-500 font-medium">Front-End Developer</p>
                        </div>
                    </div>

                    {/* User Dropdown Menu */}
                    <div
                        ref={dropdownRef}
                        className={`absolute top-14 right-6 bg-white shadow-xl rounded-xl border border-slate-200 p-2 w-52 origin-top-right transition-all duration-200 z-50 ${
                            showUserDropdown ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                        }`}
                    >
                        <div className="flex items-center gap-2.5 bg-[#FFF5EC] p-2.5 rounded-lg mb-2 border border-[#fe9f43]/20">
                            <div className="w-9 h-9 rounded-full bg-[#fe9f43] text-white flex items-center justify-center font-bold text-xs">
                                KZ
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#051A2C]">Kazi Ziaur Rahman</p>
                                <p className="text-[10px] text-[#FF6E22] font-semibold">WEBNS Ltd. Candidate</p>
                            </div>
                        </div>

                        <div className="border-b border-slate-100 pb-1 mb-1">
                            <MenuItem
                                icon={<FaUserCircle size={14} className="text-[#fe9f43]" />}
                                text="My Profile"
                                className="text-xs text-slate-700 font-medium rounded-md hover:text-[#fe9f43]"
                            />
                            <MenuItem
                                icon={<FaCog size={14} className="text-[#fe9f43]" />}
                                text="Settings"
                                className="text-xs text-slate-700 font-medium rounded-md hover:text-[#fe9f43]"
                            />
                        </div>

                        <MenuItem
                            icon={<FaSignOutAlt size={14} />}
                            text="Logout"
                            className="text-rose-600 text-xs font-medium rounded-md hover:bg-rose-50"
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
