import { _mock } from './_mock';
import { _payments } from './_payment';

// ----------------------------------------------------------------------

export const INVOICE_STATUS_OPTIONS = [
  { label: 'Payée', value: 'paid' },
  { label: 'En attente', value: 'pending' },
  { label: 'Échoué', value: 'failed' },
  { label: 'Remboursée', value: 'refunded' },
  { label: 'envoyée', value: 'sent' },
];

export const _invoices = _payments
  .filter((payment) => payment.invoiceGenerated)
  .map((payment, index) => {
    const status =
      payment.status === 'success'
        ? 'paid'
        : payment.status === 'pending'
          ? 'pending'
          : payment.status === 'refunded'
            ? 'refunded'
            : payment.status === 'failed'
              ? 'failed'
              : 'pending';

    const refundAmount = status === 'refunded' ? payment.amount : undefined;
    const refundDate = status === 'refunded' ? _mock.time(index + 10) : undefined;
    const refundReason = status === 'refunded' ? 'Remboursement demandé par le client' : undefined;

    return {
      id: _mock.id(index),
      subscriber: payment.subscriber,
      subscriptions: payment.subscriptions,
      amount: payment.amount,
      invoiceNumber: `INV-${2000 + index}`,
      createDate: payment.paymentDate,
      updatedDate: _mock.time(index),
      status,
      payment: _payments[index],
      refundAmount,
      refundDate,
      refundReason,
      notes: index % 3 === 0 ? _mock.description(index) : undefined,
    };
  });

export function updatePaymentsWithInvoices() {
  _payments.forEach((payment, index) => {
    if (payment.invoiceGenerated) {
      const invoice = _invoices.find((inv) => inv.payment.id === payment.id);

      if (invoice) {
        (payment as any).invoice = invoice;
      }
    }
  });
}
