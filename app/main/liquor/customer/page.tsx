import { redirect } from 'next/navigation';

export default function LiquorCustomerRedirect() {
  redirect('/customer?branch=LIQUOR');
}
