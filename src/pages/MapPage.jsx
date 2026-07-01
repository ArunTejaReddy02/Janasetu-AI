import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHotspots, fetchGapScores } from '../services/api';
import { getAllAdminUnits } from '../services/geocoding';
import HotspotMap from '../components/HotspotMap';

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const wardParam = searchParams.get('ward');

  const [hotspots, setHotspots] = useState(null);
  const [gapScores, setGapScores] = useState([]);
  const [adminUnits] = useState(getAllAdminUnits());
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedWard, setSelectedWard] = useState(wardParam ?? null);
  const [showGapOverlay, setShowGapOverlay] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wardParam) setSelectedWard(wardParam);
  }, [wardParam]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [data, gaps] = await Promise.all([
        fetchHotspots('CST-VZG-01', selectedFacility, dateRange),
        fetchGapScores(),
      ]);
      setHotspots(data);
      setGapScores(gaps);
      setLoading(false);
    }
    load();
  }, [selectedFacility, dateRange]);

  const facilityTypes = ['all', 'water_infrastructure', 'roads', 'lighting', 'sanitation', 'drainage'];
  const dateOptions = [
    { value: 'all', label: 'All time' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ];

  return (
    <div className="h-full grid grid-cols-12 gap-[12px] overflow-hidden">
      <aside className="col-span-3 flex flex-col gap-[12px] overflow-y-auto pr-1">
        <div className="glass-panel p-[16px] rounded-xl inner-glow-top">
          <h3 className="font-mono text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant mb-4 uppercase">
            Map Layers
          </h3>
          <div className="space-y-2">
            {facilityTypes.map((ft) => (
              <button
                key={ft}
                type="button"
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedFacility === ft
                    ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                    : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                }`}
                onClick={() => setSelectedFacility(ft)}
              >
                {ft === 'all' ? 'All Facility Types' : ft.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-[16px] rounded-xl inner-glow-top">
          <h3 className="font-mono text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant mb-4 uppercase">
            Date Range
          </h3>
          <div className="space-y-2">
            {dateOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  dateRange === opt.value
                    ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                    : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                }`}
                onClick={() => setDateRange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-[16px] rounded-xl inner-glow-top">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">
              Demand Gap Overlay
            </h3>
            <button
              type="button"
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${showGapOverlay ? 'bg-primary/20 text-primary' : 'bg-black/5 text-on-surface-variant'}`}
              onClick={() => setShowGapOverlay((v) => !v)}
            >
              {showGapOverlay ? 'ON' : 'OFF'}
            </button>
          </div>
          {showGapOverlay && (
            <div className="space-y-2">
              {gapScores.map((g) => (
                <div key={g.admin_unit_id} className="p-2 rounded-lg bg-black/5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-on-surface">{g.admin_unit_id.replace('AU-VZG-', '')}</span>
                    <span className="text-primary font-mono">{g.gap_score}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">{g.label} ({g.sector})</p>
                  <div className="w-full h-1 bg-black/10 rounded-full mt-1">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: `${g.gap_score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-[16px] rounded-xl inner-glow-top flex-1">
          <h3 className="font-mono text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant mb-4 uppercase">
            Admin Units
          </h3>
          <div className="space-y-2">
            {adminUnits.map((unit) => (
              <button
                key={unit.id}
                type="button"
                className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedWard === unit.id ? 'bg-primary/20 border border-primary/30' : 'bg-black/5 hover:bg-black/10'
                }`}
                onClick={() => setSelectedWard(selectedWard === unit.id ? null : unit.id)}
              >
                <p className="text-xs font-bold text-on-surface">{unit.name}</p>
                <p className="text-[10px] text-on-surface-variant font-mono">{unit.id}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="col-span-9 glass-panel rounded-2xl inner-glow-top overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-black/5">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Demand Hotspot Map</h2>
            <p className="text-[10px] text-on-surface-variant">
              {hotspots?.features?.length ?? 0} hotspots · KDE analysis · OpenStreetMap
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 hover:scale-105"
            onClick={() => {
              setLoading(true);
              fetchHotspots('CST-VZG-01', selectedFacility, dateRange).then((data) => {
                setHotspots(data);
                setLoading(false);
              });
            }}
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        <div className="flex-1 relative min-h-0">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <HotspotMap features={hotspots?.features ?? []} selectedWard={selectedWard} />
          )}
        </div>
      </div>
    </div>
  );
}
