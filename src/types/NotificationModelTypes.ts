interface LogNotificationTypeDetail {
  label: string;
  icon: string;
  id: number;
  tag: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface NotificationModelTypes {
  title: string;
  short_description: string;
  description: string;
  main_img: string;
  tag_icon: string;
  viewed_at: string | null;
  readed_at: string;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: number;
  metadata: unknown | null;
  to_user: number;
  notification_type: number;
  statut: number;
  log_notification_type_detail: LogNotificationTypeDetail;
}
