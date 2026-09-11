import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import {
    BarChart3,
    Building2,
    CloudOff,
    RefreshCw,
    Star,
    Users,
} from 'lucide-react'

import AppHeader from '../components/AppHeader'
import BottomNavigation from '../components/BottomNavigation'
import {
    getPendingSurveyCount,
    syncPendingSurveys,
} from '../services/surveyService'

function StatisticsPage() {
    const [pendingCount, setPendingCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [syncMessage, setSyncMessage] = useState('')

    const loadPendingCount = useCallback(async () => {
        try {
            const count = await getPendingSurveyCount()
            setPendingCount(count)
        } catch (error) {
            console.error(
                'Lỗi lấy số khảo sát chờ đồng bộ:',
                error,
            )

            setPendingCount(0)
        }
    }, [])

    const handleSyncNow = useCallback(async () => {
        setIsLoading(true)
        setSyncMessage('Đang đồng bộ dữ liệu...')

        try {
            const result = await syncPendingSurveys()

            setSyncMessage(result.message)

            const count = await getPendingSurveyCount()
            setPendingCount(count)
        } catch (error) {
            console.error('Lỗi đồng bộ thủ công:', error)

            setSyncMessage(
                'Không thể đồng bộ dữ liệu. Vui lòng kiểm tra kết nối mạng và cấu hình Google Apps Script.',
            )
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            loadPendingCount()
        }, 0)

        const handleOnline = () => {
            window.setTimeout(() => {
                handleSyncNow()
            }, 1000)
        }

        window.addEventListener('online', handleOnline)

        return () => {
            window.clearTimeout(timerId)
            window.removeEventListener('online', handleOnline)
        }
    }, [loadPendingCount, handleSyncNow])

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

                    <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                                <CloudOff size={22} />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900">
                                    Hàng chờ đồng bộ
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-amber-800">
                                    Hiện có{' '}
                                    <strong>{pendingCount}</strong>{' '}
                                    khảo sát đang chờ gửi lên Google Sheets.
                                </p>

                                {syncMessage && (
                                    <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-amber-900">
                                        {syncMessage}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSyncNow}
                                    disabled={isLoading}
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-amber-700 disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={14}
                                        className={
                                            isLoading ? 'animate-spin' : ''
                                        }
                                    />

                                    {isLoading
                                        ? 'Đang đồng bộ...'
                                        : 'Đồng bộ ngay'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900">
                            Dữ liệu đang được cập nhật
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Các chỉ số tổng quan hiện đang dùng dữ liệu mẫu.
                            Ở phiên bản tiếp theo, trang thống kê sẽ được kết nối
                            trực tiếp với Google Sheets để hiển thị dữ liệu khảo sát
                            thực tế.
                        </p>
                    </div>
                </main>

                <BottomNavigation />
            </div>
        </div>
    )
}

type StatBoxProps = {
    icon: ReactNode
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