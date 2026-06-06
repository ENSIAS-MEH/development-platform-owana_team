import { _mock } from './_mock';
import { abonnementItems } from './_abonnements';
import { PAYMENT_METHOD_OPTIONS } from './_payment';

export const SUBSCRIBER_STATUS_OPTIONS = [
  { label: 'Actif', value: 'active' },
  { label: 'Inactif', value: 'inactive' },
  { label: 'En attente', value: 'pending' },
];

export const BILLING_CYCLE_OPTIONS = [
  { label: 'Mensuel', value: 'monthly' },
  { label: 'Trimestriel', value: 'quarterly' },
  { label: 'Annuel', value: 'yearly' },
];

export const _subscribers = [...Array(20)].map((_, index) => {
  const status = SUBSCRIBER_STATUS_OPTIONS[index % SUBSCRIBER_STATUS_OPTIONS.length].value;
  const subscriptionCount = (index % 3) + 1; // 1-3 subscriptions per subscriber
  const subscriptions = [];

  // Assign 1-3 subscriptions to each subscriber
  for (let i = 0; i < subscriptionCount; i += 1) {
    const subIndex = (index + i) % abonnementItems.length;
    subscriptions.push(abonnementItems[subIndex]);
  }

  // Calculate dates based on mock times
  const createdAt = _mock.time(index - 5);
  const subscriptionStartDate = _mock.time(index);

  const subscriptionEndDate = _mock.time(index + 2);

  const lastPaymentDate = _mock.time(index - 1);
  const updatedAt = _mock.time(index);

  return {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: `${_mock.firstName(index).toLowerCase()}.${_mock.lastName(index).toLowerCase()}@example.com`,
    phone: _mock.phoneNumber(index),
    address: _mock.fullAddress(index),
    subscriptions: [abonnementItems[index % abonnementItems.length]],
    subscriptionStartDate,
    subscriptionEndDate,
    status,
    paymentMethod: PAYMENT_METHOD_OPTIONS[index % PAYMENT_METHOD_OPTIONS.length].value,
    billingCycle: BILLING_CYCLE_OPTIONS[index % BILLING_CYCLE_OPTIONS.length].value,
    lastPaymentDate,
    createdAt,
    updatedAt,
  };
});
