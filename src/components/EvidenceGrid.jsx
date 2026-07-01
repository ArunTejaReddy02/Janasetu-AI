const mockEvidence = [
  {
    id: 'ev-1',
    submission_id: 'SC-9821-B',
    location: 'Sector 47',
    time_ago: '2m ago',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdZ9cZqvQ2D9kUy9aA3AJChKRG_CdPfnQRgC3KSXcuHK1JhClbz-XwPe6VWmnptDZTvQhgMoTiTGmhmaW4puy2s14twTzz0_Los7XdmPh_ECUjoF2-0LaitInx07UVQgoTw79yl7AayB9hGwu2xE5JMlTVIi5hQM6YpJLq1yto0aug1TRs1uFCh7JrD_KErpIjUEAJDY-Ab7i5cKJp-_F4nxqXCCSVbyrNCVenALnXR2DUpIjHVYAVXb-xVvduIyoBBafEsR8Ljg',
  },
  {
    id: 'ev-2',
    submission_id: 'SC-9820-A',
    location: 'Model Town',
    time_ago: '15m ago',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa1YD0X3eJ9Hac8m3ZCMONwmRa7riqK_VR0S4RtPfqx5iggND0Ysh0fssx4USwh5H_YydR5GGthOG6ecJMmZHnKJZpfLQmiE6UURLiDL_AefdW-17jHPoiJ-WT-mBoE0QSyZHKC3zXP62cIdaymQSZTcpmWayUK2EztEx_3x8D8uxkEpxgGAo05DwEgNgXa9TenpsQMIA1fsSAlBNO_Rjq7z53xAzKzPEvELAr8xt3v5DDMYTpLiuwWcVQU7kE89QCRTImXPOv1g',
  },
  {
    id: 'ev-3',
    submission_id: 'SC-9819-V',
    location: 'Central Park',
    time_ago: '22m ago',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG86dYaYOwZY8hg2gaazGvhKwnUHZO8-Rq_4-ZH_n2RfYrwNS-yAVHkCgDAiRBbv6y_G57-qDi2pX3gIzHxH-7k8BKoC7uwj8XizLnqqFyXMev3xMGz0HCWkfCd0XrerOzNhkAlGggFspoC4DOiko1O9tp_Li3aZeYQL2gP9J66QcNlEM1gkuGATaBtEqgZ2t-6ky7X9_miWdnpAwUKl_22pz4ksJaHuuX83PrAq6hxA6w7u9045Y4OLvinXt_GfSvRFzUyO7n3A',
  },
  {
    id: 'ev-4',
    submission_id: 'SC-9817-D',
    location: 'Station Road',
    time_ago: '1h ago',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEu0rRwWWKqLlF7G02NGGTSh29JoW189NIjubJfLmv-FFisz4SHcMe_VJ2iHdq8dgc7he7wWWRz0zBjURCLOsK_z1ZD7S5_7O01N46cgaNT8eyffgZ-5DmR4mbUFHDA7z6E5mSmJPux-WsPiyP-y-BxR7EL3XsbUnssjfAHSjNLnLpJeznJkq9hJqnvce-Vt_BnycvscWM-qmiF2k90EW3WeEsn0S-7BvH-RfC2bvodAyF3bV4Y3EHbu0Ccyn9LKMninrOXdPrZA',
  },
];

export default function EvidenceGrid({ submissionIds }) {
  const items = submissionIds?.length
    ? mockEvidence.filter((e) => submissionIds.includes(e.submission_id))
    : mockEvidence;

  return (
    <div className="glass-panel rounded-2xl p-[16px] inner-glow-top flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[Geist] text-sm font-bold flex items-center gap-2 text-on-surface">
          Visual Evidence
          {submissionIds?.length ? (
            <span className="text-[10px] text-primary font-normal">({items.length} linked)</span>
          ) : null}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-xs text-on-surface-variant text-center py-4">No photo evidence for this project.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {items.map((ev) => (
              <div key={ev.id} className="relative rounded-lg overflow-hidden group h-24">
                <img
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  src={ev.src}
                  alt={`Evidence from ${ev.location}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white leading-tight">{ev.location}</span>
                  <span className="text-[8px] text-white/80">{ev.submission_id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
