import React from 'react';
import { OrderStatus as OrderStatusType } from '../../../types/order.types';
import { Badge } from '../../common/Badge';

export const OrderStatusBadge: React.FC<{ status: OrderStatusType }> = ({ status }) => {
  switch (status) {
    case 'delivered':
      return <Badge variant="green">Delivered</Badge>;
    case 'shipped':
      return <Badge variant="blue">Shipped</Badge>;
    case 'processing':
      return <Badge variant="gold">Processing</Badge>;
    case 'cancelled':
      return <Badge variant="red">Cancelled</Badge>;
    case 'pending':
    default:
      return <Badge variant="gray">Pending</Badge>;
  }
};
