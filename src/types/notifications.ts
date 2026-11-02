export type NotificationType = "ORDER" | "PAYMENT" | "PROMO" | "SYSTEM";
export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Notification {
  id: number | string;
  title: string;
  message: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  is_read: boolean;
  action_url?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
  urgent_count: number;
}

export interface NotificationPreferences {
  email_promotions: boolean;
  in_app_promotions: boolean;
  order_updates: boolean;
  sms_updates?: boolean;
}

export interface BroadcastNotificationPayload {
  title: string;
  message: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  broadcast: boolean;
  action_url?: string;
}

export interface EmailQueueItem {
  id: number | string;
  recipient_email: string;
  subject: string;
  status: "PENDING" | "SENT" | "FAILED" | "CANCELLED";
  attempts: number;
  error_message?: string | null;
  created_at: string;
}

export interface NotificationTemplate {
  code: string;
  name: string;
  description?: string;
  notification_type: NotificationType;
  email_subject_template: string;
  email_body_html_template: string;
  email_body_text_template: string;
  in_app_title_template: string;
  in_app_message_template: string;
  is_active: boolean;
}
