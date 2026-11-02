export interface ExecutiveKPIs {
  total_revenue: number;
  revenue_change_percent: number;
  total_orders: number;
  orders_change_percent: number;
  average_order_value: number;
  aov_change_percent: number;
  active_customers: number;
  new_customers_this_month: number;
}

export interface SalesChartDataPoint {
  date: string;
  sales: number;
  orders_count: number;
  gross_revenue: number;
}

export interface TopProductItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  total_sold: number;
  revenue: number;
  current_stock: number;
}

export interface TopCustomerItem {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  total_orders: number;
  lifetime_spent: number;
  last_order_date: string;
}

export interface InventoryStockItem {
  id: number;
  variant_id: number;
  product_name: string;
  sku: string;
  current_stock: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  unit_price: number;
  last_restocked_at?: string;
}

export interface AdjustStockPayload {
  adjustment: number; // positive or negative
  reason: "RESTOCK" | "INVENTORY_COUNT" | "DAMAGED" | "RETURN";
  note?: string;
}

export interface StockMovementLog {
  id: number;
  variant_sku: string;
  product_name: string;
  movement_type: string;
  quantity_changed: number;
  resulting_quantity: number;
  actor_name: string;
  reason?: string;
  created_at: string;
}

export interface CustomerDossier {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  is_active: boolean;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  registered_at: string;
}

export interface SystemAlert {
  id: number;
  title: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  is_resolved: boolean;
  created_at: string;
}
