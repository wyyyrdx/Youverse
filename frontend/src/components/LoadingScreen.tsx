export default function LoadingScreen({ message = 'Entering Youverse…' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void">
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border-2 border-magenta/20 border-b-magenta animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        <div className="absolute w-4 h-4 rounded-full bg-mist shadow-[0_0_16px_#2fe4ff] animate-pulse" />
      </div>
      <p className="mt-6 font-mono text-xs tracking-widest text-mist-muted uppercase animate-pulse">
        {message}
      </p>
    </div>
  )
}
