import React, { useEffect, useState } from 'react';
import orderService from '../services/orderservices'

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await orderService.getOrders();
    setOrders(data);
  };

  return (
    <div>
      <h2>Order List</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.orderNumber} - {order.customer.name} - {order.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
