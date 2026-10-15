// 🏗️ Balde 2 (Esqueleto): estrutura igual, conteúdo varia por produto.
import { PRODUTO } from '@/config/produto'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/core/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/core/ui/sheet'
import type { MenuItem } from '@/types/tenant'

interface SidebarProps {
  menuItems: MenuItem[]
}

function NavItems({ items, onNavigate }: { items: MenuItem[]; onNavigate?: () => void }) {
  const location = useLocation()

  return (
    <nav className="flex flex-col gap-1 px-2">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            location.pathname === item.path
              ? 'bg-primary text-primary-foreground'
              : 'text-sidebar-foreground hover:bg-muted'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function SidebarContent({ menuItems }: SidebarProps) {
  const tenantName = PRODUTO.nome

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <span className="font-semibold text-sidebar-foreground truncate">{tenantName}</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <NavItems items={menuItems} />
      </div>
    </div>
  )
}

export function Sidebar({ menuItems }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col h-screen sticky top-0">
        <SidebarContent menuItems={menuItems} />
      </aside>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-56">
          <SidebarContent menuItems={menuItems} />
        </SheetContent>
      </Sheet>
    </>
  )
}
