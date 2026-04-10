import { useState, useEffect } from "react"
import { Cloud, HardDrive, Zap } from "lucide-react"

interface UsageData {
  credits: {
    usage: number;
    limit: number;
    used_percent: number;
  };
  storage: {
    usage: number; // bytes
  };
  transformations?: {
    usage: number;
  };
}

export function CloudinaryStats() {
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cloudinary-usage')
      .then(res => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) return null;

  const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1) + ' MB';

  return (
    <div className="flex items-center gap-4 text-xs bg-muted/50 border rounded-lg px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-muted-foreground mr-2 font-medium">
        <Cloud className="w-4 h-4 text-blue-500" />
        <span>Cloudinary</span>
      </div>
      
      <div className="flex items-center gap-2" title="Tổng lưu trữ">
        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
        <span>{bytesToMB(data.storage.usage)}</span>
      </div>

      <div className="flex items-center gap-2" title="Tài nguyên chuyển đổi số (Credits)">
        <Zap className="w-3.5 h-3.5 text-yellow-500" />
        <div className="flex flex-col gap-0.5 w-[80px]">
          <div className="flex justify-between text-[10px] leading-none mb-0.5">
            <span>{data.credits.used_percent}%</span>
            <span>{data.credits.limit} cr</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${data.credits.used_percent > 80 ? 'bg-red-500' : data.credits.used_percent > 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
              style={{ width: `${data.credits.used_percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
