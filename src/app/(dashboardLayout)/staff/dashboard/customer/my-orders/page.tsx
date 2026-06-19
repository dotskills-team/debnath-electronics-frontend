import MyOrders from '@/components/dashboard/my-orders/MyOrders'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders | Debnath Electronics',
  description: 'View and manage your orders on Debnath Electronics.',
}

export default function MyOrdersPage() {
  return <MyOrders />
}
