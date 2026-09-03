import {
    Building2,
    Database,
    Goal,
    Smartphone,
} from 'lucide-react'

import AppHeader from '../components/AppHeader'
import BottomNavigation from '../components/BottomNavigation'

function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-24">
                <AppHeader
                    title="Giới thiệu"
                    subtitle="Thông tin về StayCheck"
                />

                <main className="space-y-5 px-5 py-6">
                    <div className="rounded-3xl bg-indigo-700 p-6 text-white">
                        <Building2 size={38} />

                        <h2 className="mt-5 text-2xl font-bold">
                            StayCheck
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-indigo-100">
                            Nền tảng khảo sát chất lượng phòng trọ dựa trên trải nghiệm
                            thực tế của người thuê.
                        </p>
                    </div>

                    <InfoCard
                        icon={<Goal />}
                        title="Mục tiêu"
                        description="Thu thập dữ liệu thực tế về giá thuê, tiện nghi, chất lượng và trải nghiệm tại các phòng trọ."
                    />

                    <InfoCard
                        icon={<Database />}
                        title="Dữ liệu"
                        description="Kết quả khảo sát được lưu trữ tập trung để phục vụ thống kê và phân tích."
                    />

                    <InfoCard
                        icon={<Smartphone />}
                        title="Mobile First"
                        description="Giao diện được tối ưu cho điện thoại và sẵn sàng phát triển thành ứng dụng di động."
                    />
                </main>

                <BottomNavigation />
            </div>
        </div>
    )
}

type InfoCardProps = {
    icon: React.ReactNode
    title: string
    description: string
}

function InfoCard({
    icon,
    title,
    description,
}: InfoCardProps) {
    return (
        <div className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                {icon}
            </div>

            <div>
                <h3 className="font-bold text-slate-900">
                    {title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default AboutPage