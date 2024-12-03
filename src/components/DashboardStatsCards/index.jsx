import { PiShoppingCartSimpleDuotone } from "react-icons/pi";
import { PiListPlus } from "react-icons/pi";
import { PiUserCircleDuotone } from "react-icons/pi";

export default function DashboardStatsCards() {
    
	return (
		<div className="dash flex justify-center items-center gap-4 flex-wrap pb-10">
			<div className="wrapper rounded-lg p-5 flex-1 flex items-start justify-between bg-[#FDF7F2]">
				<div className="flex flex-col">
					<span className="text-[16px] text-[#171A1F] font-bold pb-2">New orders</span>
					<span className="text-4xl text-[#171A1F] font-bold pb-3">32</span>
					<span className="text-sm text-[#117B34] pl-2">^ 5.39%<a className="text-[#565D6D] font-normal pl-2">from last month</a></span>
				</div>
				<div className="rounded-lg h-[44px] w-[44px] flex items-center justify-center border border-[#CC7B25]">
					<PiShoppingCartSimpleDuotone className="text-2xl text-[#CC7B25]"/> 
				</div>
			</div>
			<div className="wrapper rounded-lg p-5 flex-1 flex items-start justify-between bg-[#EEFCFF]">
				<div className="flex flex-col">
					<span className="text-[16px] text-[#171A1F] font-bold pb-2">Open orders</span>
					<span className="text-4xl text-[#171A1F] font-bold pb-3">31</span>
					<span className="text-sm text-[#117B34] pl-2">^ 5.39%<a className="text-[#565D6D] font-normal pl-2">from last month</a></span>
				</div>
				<div className="rounded-lg h-[44px] w-[44px] flex items-center justify-center border border-[#007A8F]">
					<PiListPlus className="text-2xl text-[#007A8F]"/> 
				</div>
			</div>
			<div className="wrapper rounded-lg p-5 flex-1 flex items-start justify-between bg-[#F0F8FE]">
				<div className="flex flex-col">
					<span className="text-[16px] text-[#171A1F] font-bold pb-2">All orders</span>
					<span className="text-4xl text-[#171A1F] font-bold pb-3">298</span>
					<span className="text-sm text-[#117B34] pl-2">^ 6.39%<a className="text-[#565D6D] font-normal pl-2">from last month</a></span>
				</div>
				<div className="rounded-lg h-[44px] w-[44px] flex items-center justify-center border border-[#007A8F]">
					<PiUserCircleDuotone className="text-2xl text-[#007A8F]"/> 
				</div>
			</div>
		</div>
	)
}