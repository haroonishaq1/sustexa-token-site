"use client"

import { useState, useEffect } from "react"

const roadmapData = [
	{
		quarter: "Q3 2025",
		title: "Building Community",
		items: [
			"Social Media Marketing",
			"Presale Round 1 and 2",
		],
		color: "#10b981",
	},
	{
		quarter: "Q4 2025",
		title: "Public Sale",
		items: [
			"DEX Listings (Jupiter, Raydium)",
			"Launchpad Campaign",
		],
		color: "#10b981",
	},
	{
		quarter: "Q1-Q3 2026",
		title: "Launch of Sustexa E-Commerce Platform",
		items: [
			"Integration with eco-partners and regional NGOs",
			"Launch Game Sustainheroes",
		],
		color: "#10b981",
	},
]

export function VerticalRoadmap() {
	const [visibleItems, setVisibleItems] = useState<number[]>([])

	useEffect(() => {
		const timer = setInterval(() => {
			setVisibleItems((prev) => {
				if (prev.length < roadmapData.length) {
					return [...prev, prev.length]
				}
				return prev
			})
		}, 600)

		return () => clearInterval(timer)
	}, [])

	return (
		<div className="relative max-w-4xl mx-auto px-4">
			{/* Central Timeline Line */}
			<div className="absolute right-4 md:right-auto md:left-1/2 transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-green-600 via-green-900 to-black-400 h-full"></div>

			<div className="space-y-8 md:space-y-16">
				{roadmapData.map((phase, index) => (
					<div
						key={index}
						className={`relative transform transition-all duration-700 ${
							visibleItems.includes(index)
								? "translate-y-0 opacity-100"
								: "translate-y-8 opacity-0"
						}`}
					>
						{/* Timeline Dot */}
						<div className="absolute right-2 md:right-auto md:left-1/2 transform md:-translate-x-1/2 -translate-y-2">
							<div
								className="w-6 h-6 rounded-full border-4 border-black shadow-lg"
								style={{ backgroundColor: phase.color }}
							></div>
						</div>

						{/* Content Card */}
						<div
							className={`flex flex-col md:flex-row ${
								index % 2 === 0 ? "md:justify-start" : "md:justify-end"
							} w-[90%] md:w-full`}
						>
							<div
								className={`w-full pr-8 md:pr-0 ${
									index % 2 === 0 ? "md:w-5/12" : "md:w-5/12 md:ml-auto"
								}`}
							>
								<div className="bg-gradient-to-br from-green-900/60 to-black/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
									<div className="mb-4">
										<span
											className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-black"
											style={{ backgroundColor: phase.color }}
										>
											{phase.quarter}
										</span>
									</div>
									<h3 className="text-2xl font-bold text-green-300 mb-4">
										{phase.title}
									</h3>
									<ul className="space-y-2">
										{phase.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className="flex items-start gap-2 text-green-200"
											>
												<div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
