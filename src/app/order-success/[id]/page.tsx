import React from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  return <OrderSuccessClient id={params.id} />;
}
