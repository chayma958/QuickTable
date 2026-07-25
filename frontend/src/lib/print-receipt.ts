import type { Order } from '@models/index';

export function printReceipt(order: Order, restaurantName: string): void {
  const win = window.open('', '_blank', 'width=380,height=600');
  if (!win) return;

  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td>${item.quantity}x ${item.nameSnapshot}</td>
          <td style="text-align:right">$${Number(item.subtotal).toFixed(2)}</td>
        </tr>`,
    )
    .join('');

  win.document.write(`
    <html>
      <head>
        <title>Receipt — Order #${order.orderNumber}</title>
        <style>
          body { font-family: monospace; padding: 16px; font-size: 13px; }
          h1 { font-size: 16px; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .total-row td { border-top: 1px dashed #000; padding-top: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${restaurantName}</h1>
        <div>Order #${order.orderNumber} — Table ${order.table?.number ?? '-'}</div>
        <div>${new Date(order.createdAt).toLocaleString()}</div>
        <table>
          ${rows}
          <tr><td>Subtotal</td><td style="text-align:right">$${Number(order.subtotal).toFixed(2)}</td></tr>
          <tr><td>Tax</td><td style="text-align:right">$${Number(order.taxAmount).toFixed(2)}</td></tr>
          <tr class="total-row"><td>Total</td><td style="text-align:right">$${Number(order.totalAmount).toFixed(2)}</td></tr>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
