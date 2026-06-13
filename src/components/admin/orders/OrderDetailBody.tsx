import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUsd } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";

interface OrderDetailBodyProps {
  order: AdminOrder;
  showStatusBadge?: boolean;
}

export function OrderDetailBody({
  order,
  showStatusBadge = true,
}: OrderDetailBodyProps) {
  return (
    <div className="space-y-6">
      {showStatusBadge ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Estado actual</span>
          <AdminStatusBadge status={order.status} />
        </div>
      ) : null}

      <div className="space-y-2 rounded-lg border border-slate-200 p-4 text-sm">
        <p className="font-medium text-slate-900">{order.customer_name}</p>
        <p className="text-slate-600">{order.customer_email}</p>
        <p className="text-slate-600">{order.customer_phone}</p>
        <p className="text-slate-600">
          {order.delivery_address}, {order.delivery_city}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-900">Ítems</h3>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Cant.</TableHead>
              <TableHead className="text-right">Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.order_items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium text-slate-900">
                    {item.product_name}
                  </p>
                  {item.notes ? (
                    <div className="mt-2 rounded-md border border-amber-200/80 bg-amber-50/60 px-3 py-2">
                      <p className="text-xs font-medium text-slate-600">
                        Personalización del cliente:
                      </p>
                      <p className="text-sm text-slate-700">{item.notes}</p>
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatUsd(item.price_usd)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="font-medium text-slate-900">Total</span>
        <span className="text-lg font-bold text-slate-900">
          {formatUsd(order.total_usd)}
        </span>
      </div>
    </div>
  );
}
