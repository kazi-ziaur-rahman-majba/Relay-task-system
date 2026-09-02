import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useState, Suspense } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { TableSkeleton } from "@/components/skeleton";

export default function AdminLayout() {
	const [sidebarClick, setSidebarClick] = useState(false);

	const handleSidebarClick = () => setSidebarClick((v) => !v);

	return (
		<div className="relative flex h-screen overflow-hidden bg-[#F7F7F7]">
			{/* Desktop Sidebar Collapse Toggle Button */}
			<button
				onClick={handleSidebarClick}
				aria-label={sidebarClick ? "Expand sidebar" : "Collapse sidebar"}
				className={`hidden lg:flex fixed top-[19px] z-[51] bg-[#fe9f43] text-white rounded-full p-1 shadow-md hover:scale-105 focus:outline-none transition-all duration-300 ease-in-out cursor-pointer items-center justify-center ${
					sidebarClick ? "left-[68px]" : "left-[228px]"
				}`}
			>
				{sidebarClick ? (
					<MdKeyboardDoubleArrowRight size={18} />
				) : (
					<MdKeyboardDoubleArrowLeft size={18} />
				)}
			</button>

			{/* Sidebar Navigation */}
			<Sidebar
				sidebarClick={sidebarClick}
				setSidebarClick={setSidebarClick}
			/>

			{/* Main Layout Area - Added +4px padding */}
			<div className="flex flex-col flex-1 min-w-0 overflow-hidden">
				<Header sidebarClick={sidebarClick} />

				<main className="flex-1 overflow-y-auto mt-16 p-2.5 md:p-3 lg:p-5 bg-[#F7F7F7]">
					<Suspense fallback={<TableSkeleton rowsCount={8} />}>
						<Outlet />
					</Suspense>
				</main>
			</div>
		</div>
	);
}
