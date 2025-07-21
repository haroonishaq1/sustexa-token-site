"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import Image from "next/image"

const data = [
	{ name: "Community & Rewards", value: 20, color: "#4ade80" },
	{ name: "Liquidity & Exchange Pool", value: 10, color: "#2dd4bf" },
	{ name: "Development", value: 40, color: "#22c55e" },
	{ name: "Token Sale", value: 10, color: "#34d399" },
	{ name: "Marketing", value: 10, color: "#86efac" },
	{ name: "Staking", value: 10, color: "#0d9488" }
]

const renderActiveShape = (props: any) => {
	const {
		cx,
		cy,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
	} = props

	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
				className="drop-shadow-2xl"
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
				opacity={0.3}
			/>
			<text
				x={cx}
				y={cy - 20}
				dy={8}
				textAnchor="middle"
				fill="white"
				className="text-sm font-medium"
			>
				{payload.name}
			</text>
			<text
				x={cx}
				y={cy + 5}
				dy={8}
				textAnchor="middle"
				fill="white"
				className="text-lg font-bold"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		</g>
	)
}

export function TokenomicsChart() {
	const [activeIndex, setActiveIndex] = React.useState(-1)

	return (
		<div className="relative w-full h-full -mt-12">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<defs>
						{data.map((entry, index) => (
							<linearGradient
								key={`gradient-${index}`}
								id={`gradient-${index}`}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor={entry.color}
									stopOpacity={1}
								/>
								<stop
									offset="100%"
									stopColor={entry.color}
									stopOpacity={0.7}
								/>
							</linearGradient>
						))}
					</defs>
					<Pie
						data={data}
						cx="50%"
						cy="40%"
						innerRadius="40%"
						outerRadius="75%"
						dataKey="value"
						activeShape={renderActiveShape}
						onMouseEnter={(_, index) => setActiveIndex(index)}
						onMouseLeave={() => setActiveIndex(-1)}
						className="filter drop-shadow-xl"
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={`url(#gradient-${index})`}
								stroke="rgba(0,0,0,0.2)"
								strokeWidth={1}
								className={`transition-all duration-300 ${activeIndex === index ? 'scale-105' : ''}`}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
			<div 
				className="absolute left-1/2 transform -translate-x-1/2 top-[64%] md:top-[78%] -z-10"
			>
				<Image
					src="/hanging.png"
					alt="Hanging Character"
					width={126}
					height={126}

				/>
			</div>
		</div>
	)
}
