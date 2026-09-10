'use client';

import Link from 'next/link';

const teachers = [
  { id: '1', name: '고선미', rating: '4.9', price: '$18', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHPiPuxm_-n7eDq9R5lnTkeRgLObIpSHgV8yGQ2qcvBW-X3bu4NMpgPOAu7_k1IoHcGXT0eTT1g7kMtiIABZleHRO1Lk8-l7KduIgrc5ntXffjPVqXRn0LJ_2BJC0X2Stg1ryflmtlfUWV4oLF-5BgrUuCcYPDx-HeT7CSwff1J7wT0z1VestyVYfmU6P9vhCAtwA6H7XsFlwcqlVnNeGgAeXImaiM_rcZSwOAVHu-wQj_1DLETSDqdk7XOxX8nX3JUqefQZXwkQ' },
  { id: '2', name: 'Min-jun Lee', rating: '4.8', price: '$15', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpD998PfDDin7Bf52GGfocc1uSgQmrhPrSNXEkCkbdzVnJKEX_rPHlvodp2tlMfSLOgK_ACOKS1lZoqddIzk_Uu855HcHjRivyllDA4HrxAoaHH5EacR5v0IcXq3IT3ldU7OaH1b9lgUdeuT_lUP6UMKqp6sOOnS4-DQhhT9W1drMTx5CcfAdHIa5RzfNFkb_Oo1loh3RJUprtkwv9XQiTeK_CQPeJtOcU9ZOB2eO_yoE3tjT8SqPgmmzM7bsQWA3o8O62tHACYQ' },
  { id: '3', name: 'Soo-ah Park', rating: '4.7', price: '$20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZzhnKFmLsjbB5DxSMj2xxQ-yWW1zT85_Mn_iqLVPDpZbJfq_I2GhJQEaoaxpOaD91jlPbMKrJVxqdK67M75J4EE0nEjQuKM5srPa8HUni0makGJl_2qvTTJkA8og6o7JSj-4AO5lL5RZrNYiMYa8jSPkayF7a6VsURiM6Uig2ebZSCaKQNP3MIk9KE9FFFeXsvnxQzvSI5Nwt_lAZUlbGVU_bQjd-uoE9xAq74B2fkr7Og9iheRCMjD6cy6-MQuRiJwlrm2ywTQ' },
];

export default function BookingResultsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 text-on-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/90 px-container-margin py-4 shadow-sm backdrop-blur">
        <Link href="/student/booking/confirm" aria-label="Back" className="material-symbols-outlined text-primary">arrow_back</Link>
        <h1 className="font-headline text-xl font-bold">Available tutors</h1>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-container-margin py-stack-lg pb-32">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrY6BFuv52mT5V2dBF_ev-xIoHtOQwGAtBGPgwhCvO-XOKhHsDjkxz8eENXewsvpquRArU6JWVCpTN07aMxhuYUeMS9LxG7wGY1cSJpjTaqzC7wk5PvSMJ7Q6XRPdL_-KZUcyr_qK9ORdE-WUBbJqmBNNnNFuiG_clEI_mFVTABxLuT81Z3F82zT3Wj9X3C1wlK6vGm3yUJn1zLlbVBO9ZOAbYhB_bWt7Pyi0xaNsKPcDE1EtebHwODI7y8Jlx96OfsTP_VsZ1ew" alt="Booking results" className="h-44 w-full rounded-xl object-cover md:h-56" />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => (
          <Link key={teacher.id} href={`/teachers/${teacher.id}`} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-outline-variant/50">
            <img src={teacher.img} alt={teacher.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h2 className="font-semibold">{teacher.name}</h2>
              <p className="text-sm text-on-surface-variant">50 min lesson</p>
              <p className="mt-2 text-sm font-bold text-primary">{teacher.rating}</p>
            </div>
            <span className="font-bold">{teacher.price}</span>
          </Link>
        ))}
        </section>
      </main>
    </div>
  );
}
