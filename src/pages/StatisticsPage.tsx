import {
    BarChart3,
    Building2,
    Star,
    Users,
} from 'lucide-react'

import AppHeader from '../components/AppHeader'
import BottomNavigation from '../components/BottomNavigation'

function StatisticsPage() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-24">
                <AppHeader
                    title="Thống kê"
                    subtitle="Tổng hợp dữ liệu khảo sát"
                />

                <main className="px-5 py-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        Tổng quan
                    </h2>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <StatBox
                            icon={<Users size={20} />}
                            value="128"
                            label="Lượt khảo sát"
                        />

                        <StatBox
                            icon={<Star size={20} />}
                            value="4.2"
                            label="Điểm trung bình"
                        />

                        <StatBox
                            icon={<Building2 size={20} />}
                            value="86"
                            label="Phòng trọ"
                        />

                        <StatBox
                            icon={<BarChart3 size={20} />}
                            value="2.5 triệu"
                            label="Giá thuê TB"
                        />
                    </div>

                    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900">
                            Dữ liệu đang được cập nhật
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Khi kết nối Google Sheets hoàn tất, các chỉ số tại đây
                            sẽ được lấy từ dữ liệu khảo sát thực tế.
                        </p>
                    </div>
                </main>

                <BottomNavigation />
            </div>
        </div>
    )
}

type StatBoxProps = {
    icon: React.ReactNode
    value: string
    label: string
}

function StatBox({
    icon,
    value,
    label,
}: StatBoxProps) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                {icon}
            </div>

            <p className="text-xl font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
                {label}
            </p>
        </div>
    )
}

export default StatisticsPage