export type Role = 'ADMIN' | 'MANAGER' | 'DEALER' | 'RIDER' | 'CUSTOMER';
export type OrderStatus = 'PENDING'|'DEALER_ACCEPTED'|'PREPARING'|'READY_FOR_PICKUP'|'RIDER_ASSIGNED'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED';

export const demoUsers = [
  { id:'u-admin', name:'System Admin', role:'ADMIN' as Role, phone:'9800000000', status:'ACTIVE' },
  { id:'u-manager', name:'Operations Manager', role:'MANAGER' as Role, phone:'9811111111', status:'ACTIVE' },
  { id:'u-dealer', name:'Kalikanagar Drinks', role:'DEALER' as Role, phone:'9822222222', status:'ACTIVE' },
  { id:'u-rider', name:'Rider One', role:'RIDER' as Role, phone:'9833333333', status:'ACTIVE' },
  { id:'u-customer', name:'Demo Customer', role:'CUSTOMER' as Role, phone:'9844444444', status:'ACTIVE' }
];

export const products = [
  { id:'p1', name:'Coca-Cola 500ml', category:'Soft Drinks', price:90, stock:45, dealer:'Kalikanagar Drinks' },
  { id:'p2', name:'Mineral Water 1L', category:'Water', price:35, stock:120, dealer:'Kalikanagar Drinks' },
  { id:'p3', name:'Red Bull 250ml', category:'Energy', price:180, stock:25, dealer:'Kalikanagar Drinks' },
  { id:'p4', name:'Frooti 600ml', category:'Juice', price:80, stock:34, dealer:'Kalikanagar Drinks' }
];

export const orders = [
  { id:'#ORD-1004', customer:'Aarav Sharma', area:'Kalikanagar', dealer:'Kalikanagar Drinks', rider:'Rider One', amount:485, status:'OUT_FOR_DELIVERY' as OrderStatus, time:'5 min ago' },
  { id:'#ORD-1003', customer:'Maya KC', area:'Devinagar', dealer:'Kalikanagar Drinks', rider:'Unassigned', amount:270, status:'READY_FOR_PICKUP' as OrderStatus, time:'12 min ago' },
  { id:'#ORD-1002', customer:'Suman Thapa', area:'Traffic Chowk', dealer:'Kalikanagar Drinks', rider:'Rider One', amount:350, status:'DELIVERED' as OrderStatus, time:'32 min ago' },
  { id:'#ORD-1001', customer:'Rojina Gurung', area:'Golpark', dealer:'Kalikanagar Drinks', rider:'Unassigned', amount:180, status:'PENDING' as OrderStatus, time:'45 min ago' }
];

export const riders = [
  { id:'r1', name:'Rider One', phone:'9833333333', presence:'ONLINE', work:'OUT_FOR_DELIVERY', deliveries:8, active:'5h 12m', zone:'Kalikanagar' },
  { id:'r2', name:'Rider Two', phone:'9855555555', presence:'ONLINE', work:'AVAILABLE', deliveries:5, active:'3h 40m', zone:'Devinagar' },
  { id:'r3', name:'Rider Three', phone:'9866666666', presence:'OFFLINE', work:'OFF_SHIFT', deliveries:7, active:'6h 02m', zone:'Traffic Chowk' }
];

export const defaultSettings = {
  systemName:'DrinkDrop', tagline:'Drinks → Nearby → Fast Delivery', logoText:'DD', phone:'+977 9800000000', email:'support@drinkdrop.local', address:'Butwal, Rupandehi, Nepal', currency:'NPR', currencySymbol:'Rs.', timezone:'Asia/Kathmandu', deliveryFee:50, freeDeliveryThreshold:1000, commissionRate:10, minimumOrder:100, status:'OPEN', closedMessage:'We are currently closed. Please check the next opening time.'
};

export const hours = [
  ['Sunday','09:00','21:00',true],['Monday','09:00','21:00',true],['Tuesday','09:00','21:00',true],['Wednesday','09:00','21:00',true],['Thursday','09:00','21:00',true],['Friday','09:00','21:00',true],['Saturday','10:00','18:00',true]
] as const;
