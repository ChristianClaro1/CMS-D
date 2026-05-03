import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  description?: string
  count?: string | number
  icon?: LucideIcon
  to?: string
}

export const DashboardCard: React.FC<Props> = ({ title, description, count, icon: Icon, to }) => {
  const Card = (
    <div className="group bg-white rounded-2xl shadow-md p-6 glass-effect card-hover h-full">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 group-hover:bg-[#0f2147] transition-colors flex items-center justify-center">
          {Icon ? <Icon className="h-6 w-6 text-gray-600 group-hover:text-yellow-400 transition-colors" /> : null}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0f2147] uppercase tracking-wide">{title}</h3>
            {count ? (
              <div className="ml-2 text-sm font-semibold text-gray-500">{count}</div>
            ) : null}
          </div>
          {description ? (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  )

  if (to) return <Link to={to}>{Card}</Link>
  return Card
}

export default DashboardCard
