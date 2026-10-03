import { redirect } from 'next/navigation';

export default function GroceryCustomerRedirect() {
  redirect('/customer?branch=GROCERY');
}
