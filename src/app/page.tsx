import Link from 'next/link';

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ-UdiMIb9221tWbFr019ViyIAWdEdUsSoaGotpYPgUadN0Ny4Hmm69gylIXI-ROvxj3kV8390jevEE6onkiVz-j6oQhVuciBAdfN0eZuaSJ4KUDPXHYZaG5WZ6_O1ozYp77Lmh5Yru9x22Gd8zrBc9SoTB6cTW3yxICN7_rv2HQx6mcp65A6Emi-iSpgGiAz904XAxHlvHoEORWs6rVK9xSdfnwnIP7Oye6cfLw3BIsksuQQeiQi-5U6hqmMzr-h5_v1qiejUtQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC4LYbY6nPCCozMIX9d6djntTekXOzd07Agpkm8s6gYRXVIhCRyXENZ1W2YTtHc1_Y8mvAcUbjuO01K0IEdfBMfn8kcNzNfh-6PlU5hyUq8G73Yb9iscKXtp54EWH4EOu80icjLyQ3L9k_A_EEinS0ytop20qyVg5DX1g0xN2AUAhMIjO-6zJywnm7A6mQvQz9CPsM0Z_FRP2ilmPhsSp65cqS-0GwAfrVEsCPtkaq1u8K6grvaUh1PcETrL0j_rDegYd1CjkoQTg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1F9VjlNfuwMsFpyenr_NgX0pkcQ_G5NwBHr095Dvyh1bY2XJXlrUpno7lDePpPyrc2i3kciy2q84eaEUJfCf45ytwmY-kPmQKD_GPRDH4jl5LwtO1NXRZjPuzMNRUa5RZnw1ON6jUkLPIPkvxzlNuwty0E9S4zrev1io-_FRst5da3uAmTsUAbbS0iV3NqGDjBIsUAfhYJnMHI0SyXx7qbA0rw7hhuMF_s5uNZkxCqR08bIWVRxiGHvIhH7szWUyt1CyEfwbSw',
];

export default function HomePage() {
  return (
    <div className="relative bg-background text-on-background min-h-screen flex flex-col font-sans overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px] animate-floating" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[100px] animate-floating" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-container-margin text-center">
        <div className="max-w-md w-full flex flex-col items-center gap-stack-lg">
          <div className="relative w-full aspect-square max-w-[280px] md:max-w-[340px] mb-stack-md fade-in">
            <div className="absolute inset-0 primary-gradient-btn rounded-full opacity-10 animate-pulse" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Korean study desk with calligraphy notebook and cherry blossoms"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA9D9VZb7slFd3AT9qffcxoUc35aauu9EMLlgp6D2wjwxlbqhZL1P__aYP5_OkrexAWXGaJGM5NEb_yPv3zMThb0ixdHyY5BZw7lZtLn9EDg9z8HVjubQLE6V6sXEYYWNYu-Ov-tYYy9tUvCcxUETs_v9sCUVqUGD5uOpm2nuPQ-7Z36HREkoy6a_vq62kv_SKJlftlNfqHGDL_AkVIok_erzXvDy_EtkD34nxIN4MclrT1WtFa-axWNuntVwbhfSHmhSri-lUWw"
              className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
            />
            <div className="absolute bottom-4 -right-4 glass-card px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-floating">
              <span className="material-symbols-outlined text-secondary text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <span className="text-xs font-medium text-on-surface whitespace-nowrap">Top rated learning</span>
            </div>
          </div>

          <div className="space-y-stack-sm fade-in" style={{ animationDelay: '0.3s' }}>
            <h1 className="font-headline text-[32px] leading-[40px] font-extrabold tracking-tight">
              Start learning Korean
              <br />
              <span className="gradient-text">with expert tutors</span>
            </h1>
            <p className="text-base text-on-surface-variant px-4 leading-relaxed">
              Bridge languages and cultures with personalized Korean lessons from world-class experts.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4 mt-stack-lg fade-in" style={{ animationDelay: '0.5s' }}>
            <Link href="/onboarding" className="primary-gradient-btn w-full h-14 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
              <span>Get started</span>
              <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
            </Link>

            <div className="flex items-center gap-4 w-full">
              <Link href="/homeT" className="flex-1 h-12 rounded-full border-[1.5px] border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center">
                Teacher
              </Link>
              <Link href="/register" className="flex-1 h-12 rounded-full border-[1.5px] border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center">
                Register
              </Link>
            </div>
          </div>

          <div className="mt-section-gap flex flex-col items-center gap-stack-sm fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} alt="" src={src} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
              ))}
            </div>
            <p className="text-xs text-outline">Joined by 50,000+ learners worldwide</p>
          </div>
        </div>
      </main>
    </div>
  );
}
