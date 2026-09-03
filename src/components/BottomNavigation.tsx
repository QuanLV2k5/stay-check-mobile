import {
    BarChart3,
    ClipboardPenLine,
    Home,
    Info,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

function BottomNavigation() {
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = [
        {
            label: 'Trang chủ',
            path: '/',
            icon: Home,
        },
        {
            label: 'Khảo sát',
            path: '/khao-sat',
            icon: ClipboardPenLine,
        },
        {
            label: 'Thống kê',
            path: '/thong-ke',
            icon: BarChart3,
        },
        {
            label: 'Giới thiệu',
            path: '/gioi-thieu',
            icon: Info,
        },
    ]

    return (
        <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-slate-200 bg-white px-2 pb-3 pt-2 shadow-lg">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-medium transition ${isActive
                                ? 'text-indigo-700'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Icon size={21} />

                        <span>{item.label}</span>
                    </button>
                )
            })}
        </nav>
    )
}

export default BottomNavigation