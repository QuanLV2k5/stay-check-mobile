import {
    ArrowLeft,
    Building2,
    Camera,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    ClipboardCheck,
    Home,
    LoaderCircle,
    MapPin,
    ShieldCheck,
    Star,
    UserRound,
} from 'lucide-react'
import {
    useState,
    type ChangeEvent,
    type ReactNode,
} from 'react'
import { useNavigate } from 'react-router'
import { submitSurvey } from '../services/surveyService'

type SurveyFormData = {
    fullName: string
    ageGroup: string
    occupation: string
    workplace: string
    phone: string
    email: string

    propertyName: string
    address: string
    roomType: string
    monthlyRent: string
    roomSize: string
    occupants: string
    stayDuration: string
    latitude: string
    longitude: string

    electricityPrice: string
    waterPrice: string
    internetPrice: string
    parkingPrice: string
    facilities: string[]

    cleanliness: number
    security: number
    noise: number
    internetQuality: number
    roomCondition: number
    locationRating: number
    landlordSupport: number

    fireExtinguisher: string
    emergencyExit: string
    cctv: string
    floodRisk: string

    problems: string[]
    recommend: string
    likes: string
    dislikes: string
    suggestions: string
    consent: boolean
}

const initialFormData: SurveyFormData = {
    fullName: '',
    ageGroup: '',
    occupation: '',
    workplace: '',
    phone: '',
    email: '',

    propertyName: '',
    address: '',
    roomType: '',
    monthlyRent: '',
    roomSize: '',
    occupants: '',
    stayDuration: '',
    latitude: '',
    longitude: '',

    electricityPrice: '',
    waterPrice: '',
    internetPrice: '',
    parkingPrice: '',
    facilities: [],

    cleanliness: 0,
    security: 0,
    noise: 0,
    internetQuality: 0,
    roomCondition: 0,
    locationRating: 0,
    landlordSupport: 0,

    fireExtinguisher: '',
    emergencyExit: '',
    cctv: '',
    floodRisk: '',

    problems: [],
    recommend: '',
    likes: '',
    dislikes: '',
    suggestions: '',
    consent: false,
}

const stepInfo = [
    {
        title: 'Thông tin cá nhân',
        subtitle: 'Người thực hiện khảo sát',
        icon: UserRound,
    },
    {
        title: 'Thông tin phòng trọ',
        subtitle: 'Đặc điểm nơi đang ở',
        icon: Building2,
    },
    {
        title: 'Tiện nghi & chi phí',
        subtitle: 'Điều kiện sinh hoạt',
        icon: CircleDollarSign,
    },
    {
        title: 'Đánh giá chất lượng',
        subtitle: 'Trải nghiệm thực tế',
        icon: ShieldCheck,
    },
    {
        title: 'Nhận xét & xác nhận',
        subtitle: 'Hoàn tất khảo sát',
        icon: ClipboardCheck,
    },
]

const facilities = [
    'Điều hòa',
    'Wi-Fi',
    'Nhà vệ sinh riêng',
    'Bình nóng lạnh',
    'Bếp',
    'Chỗ để xe',
    'Máy giặt',
    'Tủ lạnh',
    'Thang máy',
    'Camera an ninh',
]

const commonProblems = [
    'Giá điện cao',
    'Tiếng ồn',
    'An ninh chưa tốt',
    'Nước yếu hoặc không sạch',
    'Internet kém',
    'Ngập nước',
    'Chỗ để xe bất tiện',
    'Chủ trọ hỗ trợ chưa tốt',
    'Phòng xuống cấp',
    'Khác',
]

function SurveyPage() {
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] =
        useState<SurveyFormData>(initialFormData)

    const [isGettingLocation, setIsGettingLocation] =
        useState(false)

    const [photoPreview, setPhotoPreview] =
        useState<string>('')

    const [photoFile, setPhotoFile] =
        useState<File | null>(null)

    const [isSubmitted, setIsSubmitted] =
        useState(false)

    const [submitMessage, setSubmitMessage] =
        useState('')

    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const updateField = <K extends keyof SurveyFormData>(
        field: K,
        value: SurveyFormData[K],
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }))
    }

    const toggleFacility = (facility: string) => {
        const exists =
            formData.facilities.includes(facility)

        updateField(
            'facilities',
            exists
                ? formData.facilities.filter(
                    (item) => item !== facility,
                )
                : [...formData.facilities, facility],
        )
    }

    const toggleProblem = (problem: string) => {
        const exists =
            formData.problems.includes(problem)

        updateField(
            'problems',
            exists
                ? formData.problems.filter(
                    (item) => item !== problem,
                )
                : [...formData.problems, problem],
        )
    }

    const handlePhotoChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0]

        if (!file) return

        setPhotoFile(file)

        const reader = new FileReader()

        reader.onload = () => {
            setPhotoPreview(reader.result as string)
        }

        reader.readAsDataURL(file)
    }

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            window.alert(
                'Trình duyệt của bạn không hỗ trợ định vị GPS.',
            )
            return
        }

        setIsGettingLocation(true)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateField(
                    'latitude',
                    position.coords.latitude.toFixed(6),
                )

                updateField(
                    'longitude',
                    position.coords.longitude.toFixed(6),
                )

                setIsGettingLocation(false)
            },
            () => {
                window.alert(
                    'Không thể lấy vị trí. Vui lòng cho phép trình duyệt truy cập vị trí của bạn.',
                )

                setIsGettingLocation(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            },
        )
    }

    const validateStep = () => {
        if (currentStep === 1) {
            if (
                !formData.fullName.trim() ||
                !formData.ageGroup ||
                !formData.occupation
            ) {
                window.alert(
                    'Vui lòng hoàn thành các trường bắt buộc ở bước 1.',
                )
                return false
            }
        }

        if (currentStep === 2) {
            if (
                !formData.propertyName.trim() ||
                !formData.address.trim() ||
                !formData.roomType ||
                !formData.monthlyRent
            ) {
                window.alert(
                    'Vui lòng nhập đầy đủ thông tin phòng trọ bắt buộc.',
                )
                return false
            }
        }

        if (currentStep === 4) {
            const ratings = [
                formData.cleanliness,
                formData.security,
                formData.noise,
                formData.internetQuality,
                formData.roomCondition,
                formData.locationRating,
                formData.landlordSupport,
            ]

            if (ratings.some((rating) => rating === 0)) {
                window.alert(
                    'Vui lòng đánh giá đầy đủ tất cả các tiêu chí.',
                )
                return false
            }

            if (!formData.floodRisk) {
                window.alert(
                    'Vui lòng chọn mức độ nguy cơ ngập nước.',
                )
                return false
            }
        }

        if (currentStep === 5) {
            if (!formData.recommend) {
                window.alert(
                    'Vui lòng cho biết bạn có giới thiệu phòng trọ này hay không.',
                )
                return false
            }

            if (!formData.consent) {
                window.alert(
                    'Vui lòng xác nhận thông tin khảo sát trước khi hoàn tất.',
                )
                return false
            }
        }

        return true
    }

    const nextStep = () => {
        if (!validateStep()) return

        if (currentStep < 5) {
            setCurrentStep((previous) => previous + 1)

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    }

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep((previous) => previous - 1)

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    }

    const handleSubmit = async () => {
        if (!validateStep() || isSubmitting) {
            return
        }

        setIsSubmitting(true)

        const payload = {
            ...formData,

            overallRating: Number(
                overallRating.toFixed(2),
            ),

            photoName: photoFile?.name ?? '',
        }

        try {
            const result = await submitSurvey(payload)

            setSubmitMessage(result.message)
            setIsSubmitted(true)

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } catch (error) {
            console.error(
                'Lỗi gửi khảo sát:',
                error,
            )

            window.alert(
                'Không thể lưu dữ liệu khảo sát. Vui lòng thử lại.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const restartSurvey = () => {
        setFormData(initialFormData)
        setPhotoPreview('')
        setPhotoFile(null)
        setCurrentStep(1)
        setIsSubmitted(false)
    }

    const ratingValues = [
        formData.cleanliness,
        formData.security,
        formData.noise,
        formData.internetQuality,
        formData.roomCondition,
        formData.locationRating,
        formData.landlordSupport,
    ]

    const overallRating =
        ratingValues.reduce(
            (total, rating) => total + rating,
            0,
        ) / ratingValues.length

    if (isSubmitted) {
        return (
            <SuccessScreen
                message={submitMessage}
                onHome={() => navigate('/')}
                onRestart={restartSurvey}
            />
        )
    }

    const currentStepData =
        stepInfo[currentStep - 1]

    const StepIcon = currentStepData.icon

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen max-w-md bg-slate-50">
                {/* Header */}
                <header className="bg-indigo-700 px-5 pb-6 pt-6 text-white">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                currentStep === 1
                                    ? navigate('/')
                                    : previousStep()
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15"
                        >
                            <ArrowLeft size={21} />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-bold">
                                Khảo sát phòng trọ
                            </h1>

                            <p className="mt-0.5 text-xs text-indigo-100">
                                Bước {currentStep}/5 ·{' '}
                                {currentStepData.title}
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-5 flex gap-1.5">
                        {stepInfo.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 flex-1 rounded-full transition ${index + 1 <= currentStep
                                    ? 'bg-white'
                                    : 'bg-white/25'
                                    }`}
                            />
                        ))}
                    </div>
                </header>

                <main className="px-5 py-6">
                    {/* Step Heading */}
                    <div className="mb-7 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                            <StepIcon size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {currentStepData.title}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {currentStepData.subtitle}
                            </p>
                        </div>
                    </div>

                    {currentStep === 1 && (
                        <StepOne
                            formData={formData}
                            updateField={updateField}
                        />
                    )}

                    {currentStep === 2 && (
                        <StepTwo
                            formData={formData}
                            updateField={updateField}
                            getCurrentLocation={getCurrentLocation}
                            isGettingLocation={isGettingLocation}
                            photoPreview={photoPreview}
                            photoFile={photoFile}
                            handlePhotoChange={handlePhotoChange}
                        />
                    )}

                    {currentStep === 3 && (
                        <StepThree
                            formData={formData}
                            updateField={updateField}
                            toggleFacility={toggleFacility}
                        />
                    )}

                    {currentStep === 4 && (
                        <StepFour
                            formData={formData}
                            updateField={updateField}
                        />
                    )}

                    {currentStep === 5 && (
                        <StepFive
                            formData={formData}
                            updateField={updateField}
                            toggleProblem={toggleProblem}
                            overallRating={overallRating}
                        />
                    )}

                    {/* Navigation */}
                    <div className="mt-8 flex gap-3">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={previousStep}
                                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700"
                            >
                                <ChevronLeft size={19} />
                                Quay lại
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 font-bold text-white shadow-sm transition active:scale-[0.98]"
                            >
                                Tiếp tục
                                <ChevronRight size={19} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoaderCircle
                                            size={20}
                                            className="animate-spin"
                                        />
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} />
                                        Gửi khảo sát
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

type StepProps = {
    formData: SurveyFormData
    updateField: <K extends keyof SurveyFormData>(
        field: K,
        value: SurveyFormData[K],
    ) => void
}

function StepOne({
    formData,
    updateField,
}: StepProps) {
    return (
        <div className="space-y-5">
            <FormField label="Họ và tên" required>
                <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) =>
                        updateField(
                            'fullName',
                            event.target.value,
                        )
                    }
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="input-style"
                />
            </FormField>

            <FormField label="Nhóm tuổi" required>
                <select
                    value={formData.ageGroup}
                    onChange={(event) =>
                        updateField(
                            'ageGroup',
                            event.target.value,
                        )
                    }
                    className="input-style"
                >
                    <option value="">
                        Chọn nhóm tuổi
                    </option>

                    <option value="Dưới 18 tuổi">
                        Dưới 18 tuổi
                    </option>

                    <option value="18 - 22 tuổi">
                        18 – 22 tuổi
                    </option>

                    <option value="23 - 30 tuổi">
                        23 – 30 tuổi
                    </option>

                    <option value="31 - 40 tuổi">
                        31 – 40 tuổi
                    </option>

                    <option value="Trên 40 tuổi">
                        Trên 40 tuổi
                    </option>
                </select>
            </FormField>

            <FormField label="Nghề nghiệp" required>
                <select
                    value={formData.occupation}
                    onChange={(event) =>
                        updateField(
                            'occupation',
                            event.target.value,
                        )
                    }
                    className="input-style"
                >
                    <option value="">
                        Chọn nghề nghiệp
                    </option>

                    <option value="Sinh viên">
                        Sinh viên
                    </option>

                    <option value="Nhân viên văn phòng">
                        Nhân viên văn phòng
                    </option>

                    <option value="Người lao động">
                        Người lao động
                    </option>

                    <option value="Làm việc tự do">
                        Làm việc tự do
                    </option>

                    <option value="Khác">
                        Khác
                    </option>
                </select>
            </FormField>

            <FormField label="Trường học / Nơi làm việc">
                <input
                    type="text"
                    value={formData.workplace}
                    onChange={(event) =>
                        updateField(
                            'workplace',
                            event.target.value,
                        )
                    }
                    placeholder="Ví dụ: Đại học CNTT & TT Việt - Hàn"
                    className="input-style"
                />
            </FormField>

            <FormField label="Số điện thoại">
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) =>
                        updateField(
                            'phone',
                            event.target.value,
                        )
                    }
                    placeholder="Nhập số điện thoại"
                    className="input-style"
                />
            </FormField>

            <FormField label="Email">
                <input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                        updateField(
                            'email',
                            event.target.value,
                        )
                    }
                    placeholder="example@gmail.com"
                    className="input-style"
                />
            </FormField>

            <InfoBox>
                Các thông tin trên chỉ được sử dụng cho mục
                đích tổng hợp và phân tích kết quả khảo sát.
            </InfoBox>
        </div>
    )
}

type StepTwoProps = StepProps & {
    getCurrentLocation: () => void
    isGettingLocation: boolean
    photoPreview: string
    photoFile: File | null
    handlePhotoChange: (
        event: ChangeEvent<HTMLInputElement>,
    ) => void
}

function StepTwo({
    formData,
    updateField,
    getCurrentLocation,
    isGettingLocation,
    photoPreview,
    photoFile,
    handlePhotoChange,
}: StepTwoProps) {
    return (
        <div className="space-y-5">
            <FormField label="Tên khu trọ / Nhà trọ" required>
                <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(event) =>
                        updateField(
                            'propertyName',
                            event.target.value,
                        )
                    }
                    placeholder="Ví dụ: Nhà trọ An Phú"
                    className="input-style"
                />
            </FormField>

            <FormField label="Địa chỉ" required>
                <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(event) =>
                        updateField(
                            'address',
                            event.target.value,
                        )
                    }
                    placeholder="Nhập địa chỉ phòng trọ"
                    className="input-style resize-none"
                />
            </FormField>

            <FormField label="Loại phòng" required>
                <select
                    value={formData.roomType}
                    onChange={(event) =>
                        updateField(
                            'roomType',
                            event.target.value,
                        )
                    }
                    className="input-style"
                >
                    <option value="">
                        Chọn loại phòng
                    </option>

                    <option value="Phòng đơn">
                        Phòng đơn
                    </option>

                    <option value="Phòng ở ghép">
                        Phòng ở ghép
                    </option>

                    <option value="Phòng studio">
                        Phòng studio
                    </option>

                    <option value="Căn hộ mini">
                        Căn hộ mini
                    </option>

                    <option value="Nhà nguyên căn">
                        Nhà nguyên căn
                    </option>

                    <option value="Khác">
                        Khác
                    </option>
                </select>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
                <FormField label="Giá thuê/tháng" required>
                    <input
                        type="number"
                        min="0"
                        value={formData.monthlyRent}
                        onChange={(event) =>
                            updateField(
                                'monthlyRent',
                                event.target.value,
                            )
                        }
                        placeholder="2500000"
                        className="input-style"
                    />
                </FormField>

                <FormField label="Diện tích (m²)">
                    <input
                        type="number"
                        min="0"
                        value={formData.roomSize}
                        onChange={(event) =>
                            updateField(
                                'roomSize',
                                event.target.value,
                            )
                        }
                        placeholder="25"
                        className="input-style"
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField label="Số người ở">
                    <input
                        type="number"
                        min="1"
                        value={formData.occupants}
                        onChange={(event) =>
                            updateField(
                                'occupants',
                                event.target.value,
                            )
                        }
                        placeholder="2"
                        className="input-style"
                    />
                </FormField>

                <FormField label="Thời gian đã ở">
                    <select
                        value={formData.stayDuration}
                        onChange={(event) =>
                            updateField(
                                'stayDuration',
                                event.target.value,
                            )
                        }
                        className="input-style"
                    >
                        <option value="">
                            Chọn
                        </option>

                        <option value="Dưới 3 tháng">
                            Dưới 3 tháng
                        </option>

                        <option value="3 - 6 tháng">
                            3 – 6 tháng
                        </option>

                        <option value="6 - 12 tháng">
                            6 – 12 tháng
                        </option>

                        <option value="1 - 2 năm">
                            1 – 2 năm
                        </option>

                        <option value="Trên 2 năm">
                            Trên 2 năm
                        </option>
                    </select>
                </FormField>
            </div>

            {/* GPS */}
            <FormField label="Vị trí phòng trọ">
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left disabled:opacity-60"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                        {isGettingLocation ? (
                            <LoaderCircle
                                size={21}
                                className="animate-spin"
                            />
                        ) : (
                            <MapPin size={21} />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                            {isGettingLocation
                                ? 'Đang lấy vị trí...'
                                : 'Lấy vị trí hiện tại'}
                        </p>

                        {formData.latitude &&
                            formData.longitude ? (
                            <p className="mt-1 break-all text-xs text-indigo-600">
                                {formData.latitude},{' '}
                                {formData.longitude}
                            </p>
                        ) : (
                            <p className="mt-1 text-xs text-slate-500">
                                Nhấn để sử dụng GPS của thiết bị
                            </p>
                        )}
                    </div>
                </button>
            </FormField>

            {/* Photo */}
            <FormField label="Ảnh phòng trọ">
                <label className="block cursor-pointer">
                    {photoPreview ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <img
                                src={photoPreview}
                                alt="Ảnh phòng trọ"
                                className="h-52 w-full object-cover"
                            />

                            <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
                                <Camera size={15} />

                                <span className="truncate">
                                    {photoFile?.name}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-5 py-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                                <Camera size={23} />
                            </div>

                            <p className="mt-3 text-sm font-bold text-slate-800">
                                Thêm ảnh phòng trọ
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Chọn ảnh từ thiết bị
                            </p>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                </label>
            </FormField>
        </div>
    )
}

type StepThreeProps = StepProps & {
    toggleFacility: (facility: string) => void
}

function StepThree({
    formData,
    updateField,
    toggleFacility,
}: StepThreeProps) {
    return (
        <div className="space-y-7">
            <section>
                <SectionTitle
                    title="Tiện nghi hiện có"
                    description="Chọn tất cả tiện nghi đang được cung cấp."
                />

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {facilities.map((facility) => {
                        const selected =
                            formData.facilities.includes(facility)

                        return (
                            <button
                                key={facility}
                                type="button"
                                onClick={() =>
                                    toggleFacility(facility)
                                }
                                className={`flex min-h-14 items-center gap-2 rounded-2xl border p-3 text-left text-sm font-semibold transition ${selected
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                            >
                                <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-slate-300'
                                        }`}
                                >
                                    {selected && <Check size={14} />}
                                </div>

                                {facility}
                            </button>
                        )
                    })}
                </div>
            </section>

            <section>
                <SectionTitle
                    title="Chi phí sinh hoạt"
                    description="Nhập mức phí đang áp dụng tại phòng trọ."
                />

                <div className="mt-4 space-y-5">
                    <FormField label="Giá điện (VNĐ/kWh)">
                        <input
                            type="number"
                            min="0"
                            value={formData.electricityPrice}
                            onChange={(event) =>
                                updateField(
                                    'electricityPrice',
                                    event.target.value,
                                )
                            }
                            placeholder="Ví dụ: 3500"
                            className="input-style"
                        />
                    </FormField>

                    <FormField label="Tiền nước">
                        <input
                            type="number"
                            min="0"
                            value={formData.waterPrice}
                            onChange={(event) =>
                                updateField(
                                    'waterPrice',
                                    event.target.value,
                                )
                            }
                            placeholder="Ví dụ: 70000"
                            className="input-style"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Có thể nhập mức phí theo người hoặc theo
                            tháng.
                        </p>
                    </FormField>

                    <FormField label="Internet/tháng">
                        <input
                            type="number"
                            min="0"
                            value={formData.internetPrice}
                            onChange={(event) =>
                                updateField(
                                    'internetPrice',
                                    event.target.value,
                                )
                            }
                            placeholder="Ví dụ: 100000"
                            className="input-style"
                        />
                    </FormField>

                    <FormField label="Phí gửi xe/tháng">
                        <input
                            type="number"
                            min="0"
                            value={formData.parkingPrice}
                            onChange={(event) =>
                                updateField(
                                    'parkingPrice',
                                    event.target.value,
                                )
                            }
                            placeholder="Ví dụ: 50000"
                            className="input-style"
                        />
                    </FormField>
                </div>
            </section>
        </div>
    )
}

function StepFour({
    formData,
    updateField,
}: StepProps) {
    return (
        <div className="space-y-7">
            <section>
                <SectionTitle
                    title="Đánh giá trải nghiệm"
                    description="Chạm vào số sao tương ứng từ 1 đến 5."
                />

                <div className="mt-4 space-y-3">
                    <RatingRow
                        label="Vệ sinh"
                        value={formData.cleanliness}
                        onChange={(value) =>
                            updateField('cleanliness', value)
                        }
                    />

                    <RatingRow
                        label="An ninh"
                        value={formData.security}
                        onChange={(value) =>
                            updateField('security', value)
                        }
                    />

                    <RatingRow
                        label="Mức độ yên tĩnh"
                        value={formData.noise}
                        onChange={(value) =>
                            updateField('noise', value)
                        }
                    />

                    <RatingRow
                        label="Chất lượng Internet"
                        value={formData.internetQuality}
                        onChange={(value) =>
                            updateField(
                                'internetQuality',
                                value,
                            )
                        }
                    />

                    <RatingRow
                        label="Tình trạng phòng"
                        value={formData.roomCondition}
                        onChange={(value) =>
                            updateField(
                                'roomCondition',
                                value,
                            )
                        }
                    />

                    <RatingRow
                        label="Vị trí"
                        value={formData.locationRating}
                        onChange={(value) =>
                            updateField(
                                'locationRating',
                                value,
                            )
                        }
                    />

                    <RatingRow
                        label="Hỗ trợ của chủ trọ"
                        value={formData.landlordSupport}
                        onChange={(value) =>
                            updateField(
                                'landlordSupport',
                                value,
                            )
                        }
                    />
                </div>
            </section>

            <section>
                <SectionTitle
                    title="Kiểm tra an toàn"
                    description="Một số yếu tố an toàn cơ bản tại nơi ở."
                />

                <div className="mt-4 space-y-5">
                    <YesNoField
                        label="Có bình chữa cháy?"
                        value={formData.fireExtinguisher}
                        onChange={(value) =>
                            updateField(
                                'fireExtinguisher',
                                value,
                            )
                        }
                    />

                    <YesNoField
                        label="Có lối thoát hiểm?"
                        value={formData.emergencyExit}
                        onChange={(value) =>
                            updateField(
                                'emergencyExit',
                                value,
                            )
                        }
                    />

                    <YesNoField
                        label="Có camera an ninh?"
                        value={formData.cctv}
                        onChange={(value) =>
                            updateField('cctv', value)
                        }
                    />

                    <FormField
                        label="Nguy cơ ngập nước"
                        required
                    >
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                'Thấp',
                                'Trung bình',
                                'Cao',
                            ].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() =>
                                        updateField(
                                            'floodRisk',
                                            level,
                                        )
                                    }
                                    className={`rounded-xl border px-2 py-3 text-sm font-semibold ${formData.floodRisk === level
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200 bg-white text-slate-600'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </FormField>
                </div>
            </section>
        </div>
    )
}

type StepFiveProps = StepProps & {
    toggleProblem: (problem: string) => void
    overallRating: number
}

function StepFive({
    formData,
    updateField,
    toggleProblem,
    overallRating,
}: StepFiveProps) {
    return (
        <div className="space-y-7">
            <section>
                <SectionTitle
                    title="Những vấn đề đã gặp"
                    description="Có thể chọn nhiều vấn đề."
                />

                <div className="mt-4 flex flex-wrap gap-2">
                    {commonProblems.map((problem) => {
                        const selected =
                            formData.problems.includes(problem)

                        return (
                            <button
                                key={problem}
                                type="button"
                                onClick={() =>
                                    toggleProblem(problem)
                                }
                                className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${selected
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                            >
                                {selected && '✓ '}
                                {problem}
                            </button>
                        )
                    })}
                </div>
            </section>

            <FormField label="Điều bạn hài lòng nhất">
                <textarea
                    rows={3}
                    value={formData.likes}
                    onChange={(event) =>
                        updateField(
                            'likes',
                            event.target.value,
                        )
                    }
                    placeholder="Ví dụ: Phòng rộng, khu vực yên tĩnh..."
                    className="input-style resize-none"
                />
            </FormField>

            <FormField label="Điều bạn chưa hài lòng">
                <textarea
                    rows={3}
                    value={formData.dislikes}
                    onChange={(event) =>
                        updateField(
                            'dislikes',
                            event.target.value,
                        )
                    }
                    placeholder="Chia sẻ những hạn chế bạn đã gặp..."
                    className="input-style resize-none"
                />
            </FormField>

            <FormField label="Đề xuất cải thiện">
                <textarea
                    rows={3}
                    value={formData.suggestions}
                    onChange={(event) =>
                        updateField(
                            'suggestions',
                            event.target.value,
                        )
                    }
                    placeholder="Ý kiến hoặc đề xuất của bạn..."
                    className="input-style resize-none"
                />
            </FormField>

            <FormField
                label="Bạn có giới thiệu phòng trọ này cho người khác?"
                required
            >
                <div className="space-y-2">
                    {[
                        'Chắc chắn có',
                        'Có thể có',
                        'Không chắc',
                        'Có thể không',
                        'Chắc chắn không',
                    ].map((answer) => (
                        <button
                            key={answer}
                            type="button"
                            onClick={() =>
                                updateField(
                                    'recommend',
                                    answer,
                                )
                            }
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold ${formData.recommend === answer
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-600'
                                }`}
                        >
                            <div
                                className={`h-4 w-4 rounded-full border-4 ${formData.recommend === answer
                                    ? 'border-indigo-600'
                                    : 'border-slate-300'
                                    }`}
                            />

                            {answer}
                        </button>
                    ))}
                </div>
            </FormField>

            {/* Summary */}
            <div className="rounded-3xl bg-slate-900 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Tổng quan đánh giá
                </p>

                <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-bold">
                        {overallRating.toFixed(1)}
                    </span>

                    <span className="mb-1 text-sm text-slate-400">
                        / 5
                    </span>
                </div>

                <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={20}
                            className={
                                star <=
                                    Math.round(overallRating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                            }
                        />
                    ))}
                </div>

                <div className="mt-5 border-t border-slate-700 pt-4 text-sm text-slate-300">
                    <p>
                        <strong className="text-white">
                            Phòng trọ:
                        </strong>{' '}
                        {formData.propertyName}
                    </p>

                    <p className="mt-1">
                        <strong className="text-white">
                            Giá thuê:
                        </strong>{' '}
                        {formatCurrency(
                            formData.monthlyRent,
                        )}
                    </p>
                </div>
            </div>

            {/* Consent */}
            <button
                type="button"
                onClick={() =>
                    updateField(
                        'consent',
                        !formData.consent,
                    )
                }
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left"
            >
                <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${formData.consent
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                        }`}
                >
                    {formData.consent && (
                        <Check size={14} />
                    )}
                </div>

                <p className="text-xs leading-5 text-slate-600">
                    Tôi xác nhận các thông tin đã cung cấp là
                    dựa trên trải nghiệm thực tế và đồng ý sử
                    dụng chúng cho mục đích khảo sát, thống kê
                    của bài tập.
                </p>
            </button>
        </div>
    )
}

type RatingRowProps = {
    label: string
    value: number
    onChange: (value: number) => void
}

function RatingRow({
    label,
    value,
    onChange,
}: RatingRowProps) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">
                    {label}
                </p>

                <span className="text-xs font-bold text-indigo-600">
                    {value > 0
                        ? `${value}/5`
                        : 'Chưa đánh giá'}
                </span>
            </div>

            <div className="mt-3 flex justify-between">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() =>
                            onChange(star)
                        }
                        aria-label={`${star} sao`}
                        className="p-1"
                    >
                        <Star
                            size={28}
                            className={
                                star <= value
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                            }
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}

type YesNoFieldProps = {
    label: string
    value: string
    onChange: (value: string) => void
}

function YesNoField({
    label,
    value,
    onChange,
}: YesNoFieldProps) {
    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-slate-800">
                {label}
            </p>

            <div className="grid grid-cols-3 gap-2">
                {[
                    'Có',
                    'Không',
                    'Không rõ',
                ].map((answer) => (
                    <button
                        key={answer}
                        type="button"
                        onClick={() =>
                            onChange(answer)
                        }
                        className={`rounded-xl border px-2 py-3 text-sm font-semibold ${value === answer
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600'
                            }`}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </div>
    )
}

type FormFieldProps = {
    label: string
    required?: boolean
    children: ReactNode
}

function FormField({
    label,
    required = false,
    children,
}: FormFieldProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    )
}

type SectionTitleProps = {
    title: string
    description: string
}

function SectionTitle({
    title,
    description,
}: SectionTitleProps) {
    return (
        <div>
            <h3 className="font-bold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
            </p>
        </div>
    )
}

function InfoBox({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="rounded-2xl bg-indigo-50 p-4">
            <div className="flex gap-3">
                <Check
                    size={19}
                    className="mt-0.5 shrink-0 text-indigo-700"
                />

                <p className="text-xs leading-5 text-indigo-800">
                    {children}
                </p>
            </div>
        </div>
    )
}

type SuccessScreenProps = {
    message: string
    onHome: () => void
    onRestart: () => void
}

function SuccessScreen({
    message,
    onHome,
    onRestart,
}: SuccessScreenProps) {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2
                        size={52}
                        className="text-emerald-600"
                    />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-slate-900">
                    Hoàn tất khảo sát!
                </h1>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    {message ||
                        'Cảm ơn bạn đã tham gia khảo sát. Thông tin của bạn đã được ghi nhận bởi StayCheck.'}
                </p>

                <div className="mt-8 w-full space-y-3">
                    <button
                        type="button"
                        onClick={onHome}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 font-bold text-white"
                    >
                        <Home size={19} />
                        Về trang chủ
                    </button>

                    <button
                        type="button"
                        onClick={onRestart}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700"
                    >
                        Thực hiện khảo sát mới
                    </button>
                </div>
            </div>
        </div>
    )
}

function formatCurrency(value: string) {
    if (!value) return 'Chưa nhập'

    const amount = Number(value)

    if (Number.isNaN(amount)) {
        return value
    }

    return `${amount.toLocaleString('vi-VN')} VNĐ/tháng`
}

export default SurveyPage