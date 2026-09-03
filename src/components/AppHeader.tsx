import { Building2 } from 'lucide-react'

type AppHeaderProps = {
    title?: string
    subtitle?: string
}

function AppHeader({
    title = 'StayCheck',
    subtitle = 'Khảo sát chất lượng phòng trọ',
}: AppHeaderProps) {
    return (
        <header className="bg-indigo-700 px-5 pb-6 pt-6 text-white">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <Building2 size={25} />
                </div>

                <div>
                    <h1 className="text-lg font-bold">
                        {title}
                    </h1>

                    <p className="mt-0.5 text-xs text-indigo-100">
                        {subtitle}
                    </p>
                </div>
            </div>
        </header>
    )
}

export default AppHeader