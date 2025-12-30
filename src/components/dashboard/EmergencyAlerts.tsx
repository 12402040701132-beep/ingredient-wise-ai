import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Shield, Zap, ChevronRight, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyAlertsProps {
  alerts: { ingredient: string; count: number; severity: 'high' | 'medium' | 'low' }[];
  totalScans: number;
}

export function EmergencyAlerts({ alerts, totalScans }: EmergencyAlertsProps) {
  const highAlerts = alerts.filter(a => a.severity === 'high');
  const hasEmergency = highAlerts.length > 0;

  const getSeverityStyles = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'low':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'low':
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn(
      "border rounded-2xl p-6 h-full",
      hasEmergency 
        ? "bg-gradient-to-br from-red-950/50 to-slate-900/50 border-red-500/30" 
        : "bg-slate-900/50 border-white/10"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {hasEmergency ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </motion.div>
          ) : (
            <Shield className="w-5 h-5 text-emerald-400" />
          )}
          <h3 className="text-lg font-semibold text-white">
            {hasEmergency ? 'Alerts' : 'Safety Status'}
          </h3>
        </div>
        {hasEmergency && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30"
          >
            {highAlerts.length} Critical
          </motion.span>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.ingredient}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border",
                getSeverityStyles(alert.severity)
              )}
            >
              <div className="flex items-center gap-3">
                {getSeverityIcon(alert.severity)}
                <div>
                  <p className="font-medium">{alert.ingredient}</p>
                  <p className="text-xs opacity-70">
                    Found in {alert.count} of {totalScans} scans ({Math.round(alert.count / Math.max(totalScans, 1) * 100)}%)
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-medium mb-1">All Clear!</p>
            <p className="text-slate-400 text-sm">No concerning patterns detected</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {alerts.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 text-slate-300 text-sm transition-all">
            <Zap className="w-4 h-4 text-amber-400" />
            Allergy Check
          </button>
          <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 text-slate-300 text-sm transition-all">
            <Bell className="w-4 h-4 text-blue-400" />
            Set Alerts
          </button>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="mt-4 p-3 bg-slate-800/30 rounded-xl border border-white/5">
        <p className="text-slate-500 text-xs text-center">
          ⚕️ AI-powered insights • Consult healthcare professionals for medical advice
        </p>
      </div>
    </div>
  );
}
