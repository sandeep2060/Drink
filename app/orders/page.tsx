import { AppShell } from '@/components/AppShell';
import { OrderTable } from '@/components/OrderTable';
export default function Orders(){return <AppShell title="Orders" subtitle="Central order management"><div className="mb-5 flex flex-wrap gap-2"><button className="btn-primary">All</button><button className="btn-secondary">Pending</button><button className="btn-secondary">Preparing</button><button className="btn-secondary">On delivery</button><button className="btn-secondary">Completed</button></div><OrderTable/></AppShell>}
