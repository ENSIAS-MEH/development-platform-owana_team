import { _mock } from './_mock';
import { _purchasedSubscriptions } from './_abonnements';

export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Carte de crédit', value: 'credit_card' },
  { label: 'Virement bancaire', value: 'bank_transfer' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: 'Réussi', value: 'SUCCEEDED' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Échoué', value: 'FAILED' },
];

const SUBSCRIBERS = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _payments = [...Array(15)].map((_, index) => {
  const status = PAYMENT_STATUS_OPTIONS[index % PAYMENT_STATUS_OPTIONS.length].value;

  return {
    id: _mock.id(index),
    transactionId: `TXN-${_mock.id(index).slice(0, 7) + index}`,
    subscriber: SUBSCRIBERS[index % SUBSCRIBERS.length],
    subscriptions: [_purchasedSubscriptions[index % _purchasedSubscriptions.length]],
    amount: _mock.number.price(index),
    paymentMethod: PAYMENT_METHOD_OPTIONS[index % PAYMENT_METHOD_OPTIONS.length].value,
    paymentDate: _mock.time(index),
    status,
    invoiceGenerated: index % 4 !== 3,
    createdAt: _mock.time(index - 2),
    updatedAt: _mock.time(index),
    invoice: undefined,
  };
});
