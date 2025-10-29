export interface MondayConfig {
  apiToken: string;
  apiVersion: string;
  apiUrl: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  workspace_id?: string;
  board_kind?: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  type: string;
  settings_str?: string;
}

export interface BoardGroup {
  id: string;
  title: string;
  color?: string;
}

export interface BoardItem {
  id: string;
  name: string;
  group?: { id: string };
  column_values?: ColumnValue[];
}

export interface ColumnValue {
  id: string;
  value?: string;
  text?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
}

export interface MondayResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
  error_code?: string;
}
