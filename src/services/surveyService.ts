const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL

export async function submitSurvey(
  payload: Record<string, unknown>,
) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error(
      'Chưa cấu hình VITE_GOOGLE_SCRIPT_URL.',
    )
  }

  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  })
}