import { Link, useLocation } from 'react-router-dom'
import { 
  Inbox, 
  Users, 
  FileText, 
  Settings,
  HelpCircle,
  User
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { blink } from '../../blink/client'

const navigation = [
  { name: 'Inbox', href: '/dashboard', icon: Inbox },
  { name: 'Patients', href: '/responses', icon: Users },
  { name: 'Documents', href: '/templates', icon: FileText },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Get help', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const location = useLocation()

  const handleGetHelp = () => {
    alert('Help feature coming soon!')
  }

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm">Kalia</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/builder' && location.pathname.startsWith('/builder'))
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.name === 'Inbox' && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <ul className="space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <li key={item.name}>
                {item.name === 'Get help' ? (
                  <button
                    onClick={handleGetHelp}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors w-full text-left',
                      isActive
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}