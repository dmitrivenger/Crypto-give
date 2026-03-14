export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'h-5 w-5 border-[1.5px]', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-2' }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full`}
        style={{ borderColor: 'rgba(201,168,76,0.2)', borderTopColor: '#C9A84C' }}
      />
      {text && <p className="text-sm" style={{ color: 'rgba(226,185,111,0.7)' }}>{text}</p>}
    </div>
  )
}
