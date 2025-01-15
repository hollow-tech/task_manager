import { HTMLAttributes } from "react";

export interface TaskItems {
  id: string | number; // уникальный идентификатор
  title: string; // название задачи
  description: string; // описание задачи
  priority: "High" | "Medium" | "Low" | "None"; // приоритет задачи
  status: "Completed" | "Not Completed"; // статус задачи
}

export interface TaskProps extends HTMLAttributes<HTMLUListElement> {
  tasks: TaskItems[];
}
