import { Link, useLocation } from "react-router-dom";
import { menu } from "@/navigation/sidebar";

type SidebarProps = {
  sidebarClick: boolean;
  setSidebarClick: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ sidebarClick }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-white text-slate-900 transition-all duration-300 border-r border-slate-200 z-50 shrink-0 ${
        sidebarClick ? "w-20" : "w-60"
      }`}
    >
      {/* Brand Logo & Header - WEBNS TASK SYSTEM */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-[#FE9F43] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            W
          </div>
          {!sidebarClick && (
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-black leading-none">
                WEBNS
              </span>
              <span className="text-[10px] text-[#FE9F43] font-black tracking-widest uppercase mt-0.5">
                TASK SYSTEM
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5 custom-scrollbar">
        {menu.map((section) => (
          <div key={section.sectionName} className="space-y-1">
            {!sidebarClick && (
              <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                {section.sectionName}
              </p>
            )}

            {section.items.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={sidebarClick ? item.name : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#FE9F43] text-white shadow-2xs"
                      : "text-black hover:bg-slate-100 hover:text-black"
                  } ${sidebarClick ? "justify-center" : ""}`}
                >
                  {/* Icon: White when active, Dark/Slate when inactive */}
                  <Icon className={`text-lg shrink-0 ${isActive ? "text-white" : "text-slate-600"}`} />
                  
                  {!sidebarClick && (
                    <span className={`truncate font-semibold ${isActive ? "text-white" : "text-black"}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer User Profile Card */}
      {!sidebarClick && (
        <div className="p-3 m-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FE9F43] text-white font-bold text-xs flex items-center justify-center shrink-0">
            KZ
          </div>
          <div className="truncate">
            <p className="text-xs font-black text-black truncate">Kazi Ziaur Rahman</p>
            <p className="text-[10px] text-slate-500 font-medium">WEBNS Ltd. Candidate</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
