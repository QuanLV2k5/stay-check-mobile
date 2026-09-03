import {
    ArrowRight,
    BarChart3,
    Building2,
    CheckCircle2,
    ClipboardPenLine,
    MapPin,
    ShieldCheck,
    Star,
    Users,
} from 'lucide-react'
import { useNavigate } from 'react-router'

import AppHeader from '../components/AppHeader'
import BottomNavigation from '../components/BottomNavigation'

function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-24 shadow-sm">
                <AppHeader />

                <main>
                    {/* Hero */}
                    <section className="bg-indigo-700 px-5 pb-10 text-white">
                        <p className="text-sm font-medium text-indigo-100">
                            Khảo sát cộng đồng
                        </p>

                        <h2 className="mt-2 text-3xl font-bold leading-tight">
                            Đánh giá nơi ở.
                            <br />
                            Chia sẻ trải nghiệm.
                        </h2>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-100">
                            StayCheck giúp thu thập và tổng hợp những đánh giá thực tế
                            về chất lượng phòng trọ từ người thuê.
                        </p>

                        <button
                            onClick={() => navigate('/khao-sat')}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-indigo-700 shadow-sm transition active:scale-[0.98]"
                        >
                            <ClipboardPenLine size={20} />

                            Bắt đầu khảo sát

                            <ArrowRight size={18} />
                        </button>
                    </section>

                    {/* Statistics */}
                    <section className="-mt-4 grid grid-cols-2 gap-3 px-5">
                        <StatCard
                            icon={<Users size={21} />}
                            value="128"
                            label="Lượt khảo sát"
                        />

                        <StatCard
                            icon={<Star size={21} />}
                            value="4.2/5"
                            label="Điểm trung bình"
                        />
                    </section>

                    {/* Purpose */}
                    <section className="px-5 py-7">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                Về StayCheck
                            </p>

                            <h3 className="mt-1 text-xl font-bold text-slate-900">
                                Một khảo sát, nhiều góc nhìn
                            </h3>
                        </div>

                        <div className="mt-5 space-y-3">
                            <FeatureCard
                                icon={<Building2 size={22} />}
                                title="Thông tin phòng trọ"
                                description="Ghi nhận giá thuê, diện tích, loại phòng và các chi phí sinh hoạt."
                            />

                            <FeatureCard
                                icon={<ShieldCheck size={22} />}
                                title="Chất lượng & an toàn"
                                description="Đánh giá vệ sinh, an ninh, tiếng ồn, Internet và điều kiện phòng."
                            />

                            <FeatureCard
                                icon={<MapPin size={22} />}
                                title="Vị trí thực tế"
                                description="Ghi nhận vị trí phòng trọ để dữ liệu khảo sát có độ tin cậy cao hơn."
                            />

                            <FeatureCard
                                icon={<BarChart3 size={22} />}
                                title="Thống kê dữ liệu"
                                description="Tổng hợp kết quả khảo sát thành những chỉ số trực quan, dễ theo dõi."
                            />
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="px-5 pb-7">
                        <div className="rounded-3xl bg-slate-900 p-5 text-white">
                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                                Cách hoạt động
                            </p>

                            <h3 className="mt-2 text-lg font-bold">
                                Chỉ mất vài phút để hoàn thành
                            </h3>

                            <div className="mt-5 space-y-4">
                                <Step
                                    number="1"
                                    text="Nhập thông tin người khảo sát"
                                />

                                <Step
                                    number="2"
                                    text="Cung cấp thông tin phòng trọ"
                                />

                                <Step
                                    number="3"
                                    text="Đánh giá tiện nghi và chất lượng"
                                />

                                <Step
                                    number="4"
                                    text="Gửi kết quả khảo sát"
                                />
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="px-5 pb-7">
                        <button
                            onClick={() => navigate('/khao-sat')}
                            className="flex w-full items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left"
                        >
                            <div>
                                <p className="font-bold text-indigo-900">
                                    Sẵn sàng đánh giá?
                                </p>

                                <p className="mt-1 text-xs text-indigo-600">
                                    Bắt đầu khảo sát phòng trọ ngay
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <ArrowRight size={19} />
                            </div>
                        </button>
                    </section>
                </main>

                <BottomNavigation />
            </div>
        </div>
    )
}

type StatCardProps = {
    icon: React.ReactNode
    value: string
    label: string
}

function StatCard({
    icon,
    value,
    label,
}: StatCardProps) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                {icon}
            </div>

            <p className="text-2xl font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-sm text-slate-500">
                {label}
            </p>
        </div>
    )
}

type FeatureCardProps = {
    icon: React.ReactNode
    title: string
    description: string
}

function FeatureCard({
    icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                {icon}
            </div>

            <div>
                <h4 className="font-bold text-slate-900">
                    {title}
                </h4>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    )
}

type StepProps = {
    number: string
    text: string
}

function Step({
    number,
    text,
}: StepProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 font-bold">
                {number}
            </div>

            <div className="flex flex-1 items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-sm">
                    {text}
                </span>

                <CheckCircle2
                    size={17}
                    className="text-indigo-300"
                />
            </div>
        </div>
    )
}

export default HomePage