import {
	FaThLarge,
	FaExclamationTriangle,
	FaUsers,
	FaCheckCircle,
	FaCog,
} from "react-icons/fa";

export const menu = [
	{
		sectionName: "Task System",
		items: [
			{
				id: 1,
				name: "All Tasks",
				title: "All Tasks",
				icon: FaThLarge,
				path: "/",
				subItems: [],
			},
			{
				id: 2,
				name: "Urgent & Overdue",
				title: "Urgent & Overdue",
				icon: FaExclamationTriangle,
				path: "/urgent",
				subItems: [],
			},
			{
				id: 3,
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
				id: 4,
				name: "Settings",
				title: "Settings",
				icon: FaCog,
				path: "/settings",
				subItems: [],
			},
		],
	},
];
