import {
	FaChartPie,
	FaListUl,
	FaExclamationTriangle,
	FaUsers,
	FaCog,
} from "react-icons/fa";

export const menu = [
	{
		sectionName: "Task System",
		items: [
			{
				id: 1,
				name: "Dashboard",
				title: "Dashboard",
				icon: FaChartPie,
				path: "/",
				subItems: [],
			},
			{
				id: 2,
				name: "All Tasks",
				title: "All Tasks",
				icon: FaListUl,
				path: "/tasks",
				subItems: [],
			},
			{
				id: 3,
				name: "Urgent & Overdue",
				title: "Urgent & Overdue",
				icon: FaExclamationTriangle,
				path: "/urgent",
				subItems: [],
			},
			{
				id: 4,
				name: "Team Members",
				title: "Team Members",
				icon: FaUsers,
				path: "/team",
				subItems: [],
			},
		],
	},
	{
		sectionName: "Management",
		items: [
			{
				id: 5,
				name: "Settings",
				title: "Settings",
				icon: FaCog,
				path: "/settings",
				subItems: [],
			},
		],
	},
];

