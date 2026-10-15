// 🏗️ Balde 2 (Esqueleto): estrutura igual, conteúdo varia por produto.
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAppMenu } from '@/app/menu'

export function AppLayout() {
  const menuItems = useAppMenu()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar menuItems={menuItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
