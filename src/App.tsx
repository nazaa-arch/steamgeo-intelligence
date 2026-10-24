import { useState, useMemo } from 'react'
import {
  MapPin,
  Compass,
  Layers,
  Activity,
  AlertTriangle,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu,
  Search
} from 'lucide-react'

interface RegencyData {
  id: string
  name: string
  bakorwil: string
  x: number // SVG relative coordinates (0 - 100)
  y: number
  lat: number
  lng: number
  population: number
  rainfall: number // mm/bulan
  temp: number // °C
  humidity: number // %
  casesDBD: number // kasus per 100k
  localR2: number
  betaRain: number
  betaPop: number
  moranCluster: 'High-High' | 'Low-Low' | 'High-Low' | 'Low-High' | 'Not Significant'
  status: 'Aman' | 'Waspada' | 'Siaga' | 'Bahaya'
}

const EAST_JAVA_REGENCIES: RegencyData[] = [
  { id: '3578', name: 'Kota Surabaya', bakorwil: 'Bojonegoro', x: 67, y: 34, lat: -7.2575, lng: 112.7521, population: 2970000, rainfall: 245, temp: 29.4, humidity: 76, casesDBD: 62.4, localR2: 0.88, betaRain: 0.42, betaPop: 0.58, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3515', name: 'Kab. Sidoarjo', bakorwil: 'Bojonegoro', x: 66, y: 40, lat: -7.4726, lng: 112.6675, population: 2060000, rainfall: 260, temp: 28.8, humidity: 78, casesDBD: 58.1, localR2: 0.86, betaRain: 0.45, betaPop: 0.51, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3525', name: 'Kab. Gresik', bakorwil: 'Bojonegoro', x: 63, y: 31, lat: -7.1566, lng: 112.6555, population: 1310000, rainfall: 220, temp: 29.1, humidity: 75, casesDBD: 41.5, localR2: 0.82, betaRain: 0.38, betaPop: 0.44, moranCluster: 'High-High', status: 'Waspada' },
  { id: '3573', name: 'Kota Malang', bakorwil: 'Malang', x: 57, y: 58, lat: -7.9797, lng: 112.6304, population: 846000, rainfall: 310, temp: 24.2, humidity: 82, casesDBD: 49.3, localR2: 0.89, betaRain: 0.52, betaPop: 0.39, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3507', name: 'Kab. Malang', bakorwil: 'Malang', x: 56, y: 66, lat: -8.1661, lng: 112.6318, population: 2650000, rainfall: 340, temp: 23.5, humidity: 84, casesDBD: 53.7, localR2: 0.87, betaRain: 0.55, betaPop: 0.35, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3579', name: 'Kota Batu', bakorwil: 'Malang', x: 53, y: 54, lat: -7.8671, lng: 112.5239, population: 213000, rainfall: 350, temp: 21.8, humidity: 88, casesDBD: 28.0, localR2: 0.81, betaRain: 0.48, betaPop: 0.22, moranCluster: 'Low-High', status: 'Waspada' },
  { id: '3509', name: 'Kab. Jember', bakorwil: 'Jember', x: 78, y: 64, lat: -8.1724, lng: 113.7000, population: 2540000, rainfall: 295, temp: 26.5, humidity: 80, casesDBD: 68.2, localR2: 0.91, betaRain: 0.59, betaPop: 0.47, moranCluster: 'High-High', status: 'Bahaya' },
  { id: '3510', name: 'Kab. Banyuwangi', bakorwil: 'Jember', x: 92, y: 62, lat: -8.2192, lng: 114.3692, population: 1710000, rainfall: 210, temp: 27.8, humidity: 77, casesDBD: 44.1, localR2: 0.84, betaRain: 0.39, betaPop: 0.41, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3577', name: 'Kota Madiun', bakorwil: 'Madiun', x: 26, y: 46, lat: -7.6298, lng: 111.5239, population: 195000, rainfall: 275, temp: 28.0, humidity: 79, casesDBD: 71.0, localR2: 0.93, betaRain: 0.62, betaPop: 0.53, moranCluster: 'High-High', status: 'Bahaya' },
  { id: '3519', name: 'Kab. Madiun', bakorwil: 'Madiun', x: 28, y: 43, lat: -7.5500, lng: 111.6500, population: 744000, rainfall: 265, temp: 27.5, humidity: 79, casesDBD: 52.8, localR2: 0.87, betaRain: 0.51, betaPop: 0.38, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3571', name: 'Kota Kediri', bakorwil: 'Madiun', x: 44, y: 52, lat: -7.8228, lng: 112.0119, population: 287000, rainfall: 280, temp: 27.2, humidity: 80, casesDBD: 46.9, localR2: 0.85, betaRain: 0.47, betaPop: 0.43, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3506', name: 'Kab. Kediri', bakorwil: 'Madiun', x: 43, y: 57, lat: -7.8480, lng: 112.1600, population: 1630000, rainfall: 290, temp: 26.8, humidity: 81, casesDBD: 55.4, localR2: 0.88, betaRain: 0.54, betaPop: 0.40, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3575', name: 'Kota Pasuruan', bakorwil: 'Malang', x: 71, y: 43, lat: -7.6453, lng: 112.9075, population: 208000, rainfall: 205, temp: 29.0, humidity: 74, casesDBD: 37.6, localR2: 0.79, betaRain: 0.34, betaPop: 0.42, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3514', name: 'Kab. Pasuruan', bakorwil: 'Malang', x: 68, y: 49, lat: -7.7300, lng: 112.8200, population: 1600000, rainfall: 250, temp: 27.1, humidity: 78, casesDBD: 48.0, localR2: 0.83, betaRain: 0.46, betaPop: 0.39, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3574', name: 'Kota Probolinggo', bakorwil: 'Malang', x: 76, y: 44, lat: -7.7543, lng: 113.2159, population: 240000, rainfall: 190, temp: 29.5, humidity: 73, casesDBD: 32.1, localR2: 0.77, betaRain: 0.31, betaPop: 0.38, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3513', name: 'Kab. Probolinggo', bakorwil: 'Malang', x: 76, y: 51, lat: -7.8700, lng: 113.3100, population: 1150000, rainfall: 230, temp: 27.0, humidity: 76, casesDBD: 41.0, localR2: 0.81, betaRain: 0.42, betaPop: 0.36, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3522', name: 'Kab. Bojonegoro', bakorwil: 'Bojonegoro', x: 42, y: 32, lat: -7.1500, lng: 111.8800, population: 1300000, rainfall: 240, temp: 28.5, humidity: 77, casesDBD: 45.2, localR2: 0.84, betaRain: 0.44, betaPop: 0.37, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3523', name: 'Kab. Tuban', bakorwil: 'Bojonegoro', x: 48, y: 23, lat: -6.8972, lng: 112.0649, population: 1200000, rainfall: 195, temp: 29.2, humidity: 74, casesDBD: 33.4, localR2: 0.79, betaRain: 0.33, betaPop: 0.35, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3524', name: 'Kab. Lamongan', bakorwil: 'Bojonegoro', x: 56, y: 28, lat: -7.1282, lng: 112.4132, population: 1340000, rainfall: 215, temp: 28.7, humidity: 75, casesDBD: 39.8, localR2: 0.80, betaRain: 0.37, betaPop: 0.39, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3516', name: 'Kab. Mojokerto', bakorwil: 'Bojonegoro', x: 57, y: 42, lat: -7.5500, lng: 112.4800, population: 1120000, rainfall: 270, temp: 27.6, humidity: 79, casesDBD: 50.3, localR2: 0.86, betaRain: 0.49, betaPop: 0.42, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3576', name: 'Kota Mojokerto', bakorwil: 'Bojonegoro', x: 58, y: 39, lat: -7.4722, lng: 112.4385, population: 140000, rainfall: 265, temp: 28.2, humidity: 78, casesDBD: 44.0, localR2: 0.84, betaRain: 0.46, betaPop: 0.44, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3517', name: 'Kab. Jombang', bakorwil: 'Bojonegoro', x: 50, y: 41, lat: -7.5460, lng: 112.2331, population: 1320000, rainfall: 275, temp: 27.7, humidity: 80, casesDBD: 47.6, localR2: 0.85, betaRain: 0.48, betaPop: 0.41, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3518', name: 'Kab. Nganjuk', bakorwil: 'Madiun', x: 38, y: 44, lat: -7.6000, lng: 111.9000, population: 1100000, rainfall: 285, temp: 27.4, humidity: 81, casesDBD: 51.2, localR2: 0.87, betaRain: 0.52, betaPop: 0.39, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3572', name: 'Kota Blitar', bakorwil: 'Malang', x: 47, y: 64, lat: -8.0983, lng: 112.1681, population: 150000, rainfall: 300, temp: 26.5, humidity: 82, casesDBD: 42.1, localR2: 0.85, betaRain: 0.50, betaPop: 0.33, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3505', name: 'Kab. Blitar', bakorwil: 'Malang', x: 46, y: 70, lat: -8.1333, lng: 112.2500, population: 1220000, rainfall: 315, temp: 25.9, humidity: 83, casesDBD: 54.0, localR2: 0.88, betaRain: 0.56, betaPop: 0.36, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3504', name: 'Kab. Tulungagung', bakorwil: 'Madiun', x: 38, y: 68, lat: -8.0667, lng: 111.9000, population: 1090000, rainfall: 290, temp: 26.8, humidity: 81, casesDBD: 48.7, localR2: 0.86, betaRain: 0.51, betaPop: 0.38, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3503', name: 'Kab. Trenggalek', bakorwil: 'Madiun', x: 31, y: 70, lat: -8.0500, lng: 111.7167, population: 740000, rainfall: 305, temp: 26.2, humidity: 83, casesDBD: 39.5, localR2: 0.83, betaRain: 0.53, betaPop: 0.31, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3502', name: 'Kab. Ponorogo', bakorwil: 'Madiun', x: 23, y: 58, lat: -7.8667, lng: 111.4667, population: 950000, rainfall: 280, temp: 27.0, humidity: 80, casesDBD: 46.4, localR2: 0.85, betaRain: 0.49, betaPop: 0.37, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3501', name: 'Kab. Pacitan', bakorwil: 'Madiun', x: 15, y: 74, lat: -8.2000, lng: 111.1000, population: 586000, rainfall: 260, temp: 27.5, humidity: 79, casesDBD: 29.3, localR2: 0.79, betaRain: 0.43, betaPop: 0.28, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3521', name: 'Kab. Ngawi', bakorwil: 'Madiun', x: 20, y: 36, lat: -7.4000, lng: 111.4500, population: 870000, rainfall: 250, temp: 28.1, humidity: 78, casesDBD: 44.8, localR2: 0.82, betaRain: 0.45, betaPop: 0.36, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3520', name: 'Kab. Magetan', bakorwil: 'Madiun', x: 18, y: 48, lat: -7.6500, lng: 111.3167, population: 670000, rainfall: 295, temp: 25.4, humidity: 82, casesDBD: 40.2, localR2: 0.84, betaRain: 0.51, betaPop: 0.30, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3508', name: 'Kab. Lumajang', bakorwil: 'Jember', x: 69, y: 65, lat: -8.1333, lng: 113.2167, population: 1120000, rainfall: 320, temp: 26.0, humidity: 82, casesDBD: 56.8, localR2: 0.88, betaRain: 0.57, betaPop: 0.39, moranCluster: 'High-High', status: 'Siaga' },
  { id: '3511', name: 'Kab. Bondowoso', bakorwil: 'Jember', x: 83, y: 52, lat: -7.9135, lng: 113.8214, population: 776000, rainfall: 260, temp: 26.3, humidity: 80, casesDBD: 43.5, localR2: 0.83, betaRain: 0.46, betaPop: 0.35, moranCluster: 'Not Significant', status: 'Waspada' },
  { id: '3512', name: 'Kab. Situbondo', bakorwil: 'Jember', x: 86, y: 43, lat: -7.7064, lng: 114.0044, population: 686000, rainfall: 170, temp: 29.8, humidity: 71, casesDBD: 26.7, localR2: 0.75, betaRain: 0.28, betaPop: 0.34, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3526', name: 'Kab. Bangkalan', bakorwil: 'Pamekasan', x: 70, y: 25, lat: -7.0333, lng: 112.7500, population: 1060000, rainfall: 185, temp: 29.3, humidity: 73, casesDBD: 31.0, localR2: 0.78, betaRain: 0.30, betaPop: 0.37, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3527', name: 'Kab. Sampang', bakorwil: 'Pamekasan', x: 77, y: 26, lat: -7.1833, lng: 113.2500, population: 970000, rainfall: 175, temp: 29.6, humidity: 72, casesDBD: 27.4, localR2: 0.76, betaRain: 0.29, betaPop: 0.35, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3528', name: 'Kab. Pamekasan', bakorwil: 'Pamekasan', x: 83, y: 28, lat: -7.1500, lng: 113.4833, population: 850000, rainfall: 180, temp: 29.4, humidity: 73, casesDBD: 29.1, localR2: 0.77, betaRain: 0.31, betaPop: 0.36, moranCluster: 'Low-Low', status: 'Aman' },
  { id: '3529', name: 'Kab. Sumenep', bakorwil: 'Pamekasan', x: 91, y: 25, lat: -7.0167, lng: 113.8667, population: 1120000, rainfall: 165, temp: 29.9, humidity: 70, casesDBD: 24.8, localR2: 0.74, betaRain: 0.26, betaPop: 0.33, moranCluster: 'Low-Low', status: 'Aman' },
]

export default function App() {
  const [selectedRegency, setSelectedRegency] = useState<RegencyData>(EAST_JAVA_REGENCIES[0])
  const [activeLayer, setActiveLayer] = useState<'cases' | 'localR2' | 'moran' | 'rainfall'>('cases')
  const [bandwidth, setBandwidth] = useState<number>(35)
  const [kernelType, setKernelType] = useState<'bisquare' | 'gaussian'>('bisquare')
  const [selectedBakorwil, setSelectedBakorwil] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filtered Regencies
  const filteredRegencies = useMemo(() => {
    return EAST_JAVA_REGENCIES.filter((r) => {
      const matchBakorwil = selectedBakorwil === 'All' || r.bakorwil === selectedBakorwil
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchBakorwil && matchSearch
    })
  }, [selectedBakorwil, searchQuery])

  // Aggregate stats computed dynamically
  const stats = useMemo(() => {
    const totalCases = EAST_JAVA_REGENCIES.reduce((acc, r) => acc + r.casesDBD, 0)
    const avgCases = (totalCases / EAST_JAVA_REGENCIES.length).toFixed(1)
    const highRiskCount = EAST_JAVA_REGENCIES.filter((r) => r.status === 'Bahaya' || r.status === 'Siaga').length
    const avgR2 = (EAST_JAVA_REGENCIES.reduce((acc, r) => acc + r.localR2, 0) / EAST_JAVA_REGENCIES.length).toFixed(3)
    // Dynamic Moran's I estimation based on bandwidth
    const moranI = (0.428 * (35 / bandwidth)).toFixed(3)
    return { avgCases, highRiskCount, avgR2, moranI }
  }, [bandwidth])

  const getColor = (r: RegencyData) => {
    if (activeLayer === 'cases') {
      if (r.casesDBD >= 60) return '#ef4444' // red
      if (r.casesDBD >= 45) return '#f97316' // orange
      if (r.casesDBD >= 35) return '#eab308' // yellow
      return '#10b981' // emerald
    }
    if (activeLayer === 'localR2') {
      if (r.localR2 >= 0.88) return '#6366f1' // indigo
      if (r.localR2 >= 0.82) return '#3b82f6' // blue
      return '#06b6d4' // cyan
    }
    if (activeLayer === 'moran') {
      if (r.moranCluster === 'High-High') return '#ef4444'
      if (r.moranCluster === 'Low-Low') return '#3b82f6'
      if (r.moranCluster === 'High-Low') return '#ec4899'
      if (r.moranCluster === 'Low-High') return '#8b5cf6'
      return '#64748b'
    }
    // rainfall
    if (r.rainfall >= 300) return '#0284c7'
    if (r.rainfall >= 240) return '#38bdf8'
    return '#bae6fd'
  }

  const exportCSV = () => {
    const headers = 'ID,Nama,Bakorwil,Populasi,Curah_Hujan,Suhu,Kelembaban,Kasus_DBD_per_100k,Local_R2,Beta_Rain,Beta_Pop,LISA_Cluster,Status\n'
    const rows = EAST_JAVA_REGENCIES.map((r) =>
      `${r.id},"${r.name}",${r.bakorwil},${r.population},${r.rainfall},${r.temp},${r.humidity},${r.casesDBD},${r.localR2},${r.betaRain},${r.betaPop},${r.moranCluster},${r.status}`
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SteamGeo_GWR_JawaTimur_${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  SteamGeo Intelligence
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  v1.2 GWR-GIS
                </span>
              </div>
              <p className="text-xs text-slate-400">Spatial Data Science & Climate Early-Warning GIS Jawa Timur</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://steamcraft.online"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800 border border-slate-800"
            >
              <span>Ecosystem Hub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dataset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="bg-slate-900/40 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-100">{stats.highRiskCount} Daerah</div>
              <div className="text-xs text-slate-400">Status Siaga & Bahaya</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-100">{stats.avgCases}</div>
              <div className="text-xs text-slate-400">Rerata Insidensi /100k</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-indigo-400">{stats.avgR2}</div>
              <div className="text-xs text-slate-400">Mean Local GWR R²</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-teal-400">{stats.moranI}</div>
              <div className="text-xs text-slate-400">Global Moran's I (p &lt; 0.001)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spatial Map & Choropleth Controls */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Layer Choropleth:</span>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveLayer('cases')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    activeLayer === 'cases' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Insidensi DBD
                </button>
                <button
                  onClick={() => setActiveLayer('localR2')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    activeLayer === 'localR2' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Local R²
                </button>
                <button
                  onClick={() => setActiveLayer('moran')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    activeLayer === 'moran' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  LISA Clusters
                </button>
                <button
                  onClick={() => setActiveLayer('rainfall')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    activeLayer === 'rainfall' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Curah Hujan
                </button>
              </div>
            </div>

            {/* Filter by Bakorwil */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedBakorwil}
                onChange={(e) => setSelectedBakorwil(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">Semua Wilayah (38 Kab/Kota)</option>
                <option value="Bojonegoro">Bakorwil Bojonegoro (Surabaya, Gresik, Sidoarjo, dkk)</option>
                <option value="Malang">Bakorwil Malang (Malang, Pasuruan, Probolinggo, dkk)</option>
                <option value="Madiun">Bakorwil Madiun (Madiun, Kediri, Ponorogo, dkk)</option>
                <option value="Jember">Bakorwil Jember (Jember, Banyuwangi, Bondowoso)</option>
                <option value="Pamekasan">Bakorwil Pamekasan (Madura Island)</option>
              </select>
            </div>
          </div>

          {/* Interactive Spatial Grid / SVG Map */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[440px] overflow-hidden shadow-inner">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

            {/* Compass rose watermark */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-950/70 border border-slate-800 px-2 py-1 rounded-md backdrop-blur">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>UTM Zone 49S • WGS84</span>
            </div>

            {/* SVG Visual Canvas */}
            <div className="w-full max-w-2xl relative aspect-[16/9] my-2">
              <svg viewBox="0 0 100 85" className="w-full h-full drop-shadow-2xl">
                {/* East Java Coastline silhouette hint */}
                <path
                  d="M 12 76 Q 25 70 38 68 Q 50 67 60 62 Q 78 64 92 62 Q 95 45 88 38 Q 74 38 68 34 Q 60 26 46 22 Q 30 30 18 36 Q 14 55 12 76 Z"
                  fill="rgba(15, 23, 42, 0.7)"
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="1,1"
                />
                {/* Madura island silhouette */}
                <path
                  d="M 68 25 Q 75 22 93 23 Q 95 28 85 30 Q 72 29 68 25 Z"
                  fill="rgba(15, 23, 42, 0.6)"
                  stroke="#334155"
                  strokeWidth="0.5"
                />

                {/* Nodes representing each Regency */}
                {filteredRegencies.map((r) => {
                  const isSelected = selectedRegency.id === r.id
                  const nodeColor = getColor(r)
                  return (
                    <g
                      key={r.id}
                      onClick={() => setSelectedRegency(r)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-125"
                    >
                      {/* Pulse effect if high risk */}
                      {r.status === 'Bahaya' && (
                        <circle
                          cx={r.x}
                          cy={r.y}
                          r="3.5"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="0.4"
                          className="animate-ping"
                          opacity="0.6"
                        />
                      )}
                      {/* Main node dot */}
                      <circle
                        cx={r.x}
                        cy={r.y}
                        r={isSelected ? '2.8' : '1.8'}
                        fill={nodeColor}
                        stroke={isSelected ? '#ffffff' : '#0f172a'}
                        strokeWidth={isSelected ? '0.6' : '0.4'}
                      />
                      {/* Label for notable regencies or selected */}
                      {(isSelected || ['Surabaya', 'Malang', 'Jember', 'Madiun', 'Banyuwangi'].some((k) => r.name.includes(k))) && (
                        <text
                          x={r.x}
                          y={r.y - 2.8}
                          textAnchor="middle"
                          fill={isSelected ? '#34d399' : '#94a3b8'}
                          fontSize="2"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="pointer-events-none select-none drop-shadow"
                        >
                          {r.name.replace('Kota ', 'K.').replace('Kab. ', '')}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Map Legend */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 bg-slate-950/70 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur">
              <span className="font-semibold text-slate-300">
                Layer:{' '}
                {activeLayer === 'cases' && 'Tingkat Kejadian DBD (per 100k)'}
                {activeLayer === 'localR2' && 'GWR Local R-Squared (Fit Model)'}
                {activeLayer === 'moran' && 'LISA Spatial Autocorrelation Cluster'}
                {activeLayer === 'rainfall' && 'Curah Hujan Rata-Rata (mm)'}
              </span>

              <div className="flex items-center gap-3">
                {activeLayer === 'cases' && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt;35
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> 35-44
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 45-59
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> &ge;60
                    </div>
                  </>
                )}
                {activeLayer === 'moran' && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High-High
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Low-Low
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Not Sig
                    </div>
                  </>
                )}
                {activeLayer === 'localR2' && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> ~0.75
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> ~0.84
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> &ge;0.88
                    </div>
                  </>
                )}
                {activeLayer === 'rainfall' && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-200"></span> &lt;200mm
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> 200-280mm
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> &gt;280mm
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table / List of Regencies */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">Daftar Data Wilayah ({filteredRegencies.length})</h3>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari Kab/Kota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 w-44"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                    <th className="py-2 px-3">Wilayah</th>
                    <th className="py-2 px-3">Bakorwil</th>
                    <th className="py-2 px-3">Kasus DBD</th>
                    <th className="py-2 px-3">Curah Hujan</th>
                    <th className="py-2 px-3">Local R²</th>
                    <th className="py-2 px-3">LISA Cluster</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRegencies.map((r) => {
                    const isSelected = selectedRegency.id === r.id
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRegency(r)}
                        className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-950/40 text-emerald-300 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <td className="py-2 px-3 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{r.name}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">{r.bakorwil}</td>
                        <td className="py-2 px-3 font-mono">{r.casesDBD} /100k</td>
                        <td className="py-2 px-3 font-mono">{r.rainfall} mm</td>
                        <td className="py-2 px-3 font-mono text-indigo-400">{r.localR2}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            r.moranCluster === 'High-High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            r.moranCluster === 'Low-Low' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {r.moranCluster}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              r.status === 'Bahaya'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : r.status === 'Siaga'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                : r.status === 'Waspada'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right Column: Selected Regency Detail & GWR Tuner */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          {/* Regency Detail Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold text-slate-100">{selectedRegency.name}</h2>
                  <p className="text-xs text-slate-400">Kode Wilayah BPS: {selectedRegency.id} • {selectedRegency.bakorwil}</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedRegency.status === 'Bahaya'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : selectedRegency.status === 'Siaga'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : selectedRegency.status === 'Waspada'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {selectedRegency.status}
              </span>
            </div>

            {/* Environmental & Climate Telemetry */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Curah Hujan</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-200">{selectedRegency.rainfall} mm</div>
                <div className="text-[10px] text-slate-500">Normal: 150-250 mm</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suhu Udara</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-200">{selectedRegency.temp} °C</div>
                <div className="text-[10px] text-slate-500">RH: {selectedRegency.humidity}%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>Insidensi DBD</span>
                </div>
                <div className="text-base font-mono font-bold text-red-400">{selectedRegency.casesDBD}</div>
                <div className="text-[10px] text-slate-500">per 100.000 jiwa</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Populasi</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-200">
                  {(selectedRegency.population / 1000000).toFixed(2)} Juta
                </div>
                <div className="text-[10px] text-slate-500">Kepadatan Tinggi</div>
              </div>
            </div>

            {/* Local GWR Model Parameters */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Parameter Model GWR Lokal</span>
              </h4>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Koefisien Hujan (\beta_1):</span>
                  <span className="font-mono font-bold text-indigo-300">+{selectedRegency.betaRain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Koefisien Populasi (\beta_2):</span>
                  <span className="font-mono font-bold text-indigo-300">+{selectedRegency.betaPop}</span>
                </div>
                <div className="flex justify-between border-t border-indigo-900/30 pt-1.5">
                  <span className="text-slate-300 font-semibold">Local Goodness of Fit (R²):</span>
                  <span className="font-mono font-bold text-emerald-400">{(selectedRegency.localR2 * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Early Warning Recommendation */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Rekomendasi Respons Dini:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedRegency.status === 'Bahaya' || selectedRegency.status === 'Siaga'
                  ? 'Intensifkan fogging fokus dan PSN 3M Plus dalam radius 200m dari kluster. Tingkatkan kapasitas uji NS1 antigen di seluruh Puskesmas setempat.'
                  : 'Pertahankan surveillance mingguan ABJ (Angka Bebas Jentik) di atas 95%. Lakukan monitoring curah hujan akumulatif.'}
              </p>
            </div>
          </div>

          {/* GWR Tuning Hyperparameters */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">GWR Spatial Hyperparameters</h3>
            </div>

            {/* Bandwidth Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Kernel Bandwidth (b):</span>
                <span className="font-mono font-bold text-emerald-400">{bandwidth} km</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={bandwidth}
                onChange={(e) => setBandwidth(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>15 km (Local)</span>
                <span>Optimal CV: 35 km</span>
                <span>80 km (Global)</span>
              </div>
            </div>

            {/* Kernel Function Selection */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Fungsi Kernel Spatial:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setKernelType('bisquare')}
                  className={`px-3 py-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                    kernelType === 'bisquare'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Adaptive Bi-Square
                </button>
                <button
                  onClick={() => setKernelType('gaussian')}
                  className={`px-3 py-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                    kernelType === 'gaussian'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fixed Gaussian
                </button>
              </div>
            </div>

            {/* Academic Reference */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-teal-400" />
                <span>Formulasi Matematis GWR:</span>
              </div>
              <p className="font-mono text-emerald-400/90 text-[10px]">
                y_i = \beta_0(u_i, v_i) + \sum \beta_k(u_i, v_i) x_ik + \epsilon_i
              </p>
              <p className="text-slate-500 text-[10px]">
                Menghitung heterogenitas spasial koefisien regresi pada koordinat geografis (u_i, v_i).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/50 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>© 2026 SteamGeo Intelligence</span>
            <span>•</span>
            <span>Ecosystem of <a href="https://steamcraft.online" className="text-emerald-400 hover:underline">STEAM-Craft</a></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Lead Architect:{' '}
              <a
                href="https://portofolionaza.steamcraft.online"
                target="_blank"
                rel="noreferrer"
                className="text-slate-200 font-semibold hover:text-emerald-400 transition-colors"
              >
                Muhammad Naza Firmansyah
              </a>
            </span>
            <a
              href="https://github.com/nazaa-arch/steamgeo-intelligence"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
