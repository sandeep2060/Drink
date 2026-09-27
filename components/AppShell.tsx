import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export function AppShell({ children, title, subtitle, role='ADMIN' }: {children:React.ReactNode; title:string; subtitle?:string; role?:string}) { return <div className="flex min-h-screen"><Sidebar role={role}/><main className="min-w-0 flex-1"><Topbar title={title} subtitle={subtitle}/><div className="p-4 md:p-7">{children}</div></main></div>; }
