import React, { useEffect, useState } from "react";

import "./Task.css";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../../redux/pageSlice";
import { useGetTasksQuery } from "../../redux/tasksApi.js";

interface TaskProps {
  id: number;
  name: string;
  desc: string;
  priority: string;
  isCompleted: boolean;
}

const Task: React.FC = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.page.currentPage);

  const [filteredData, setFilteredData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Все");
  const [priorityFilter, setPriorityFilter] = useState<string>("Все");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "status" | "priority" | "id">("name");

  useEffect(() => {
    const savedStatusFilter = localStorage.getItem("statusFilter");
    const savedPriorityFilter = localStorage.getItem("priorityFilter");
    const savedSortOrder = localStorage.getItem("sortOrder");

    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
    if (savedPriorityFilter) setPriorityFilter(savedPriorityFilter);
    if (savedSortOrder) setSortOrder(savedSortOrder as "asc" | "desc");
  }, []);

  // Update localStorage whenever filter or sort state changes
  useEffect(() => {
    localStorage.setItem("statusFilter", statusFilter);
    localStorage.setItem("priorityFilter", priorityFilter);
    localStorage.setItem("sortOrder", sortOrder);
  }, [statusFilter, priorityFilter, sortOrder]);

  const { data = [], isLoading } = useGetTasksQuery({ currentPage });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const filtered = data.filter((task: any) => {
      const matchesStatus =
        statusFilter === "Все" || // No filter applied for status
        (statusFilter === "Выполненные" && task.isCompleted) ||
        (statusFilter === "Невыполненные" && !task.isCompleted);

      const matchesPriority = priorityFilter === "Все" || task.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });

    const sortedData = filtered.sort((a, b) => {
      let compareA: any = a[sortBy];
      let compareB: any = b[sortBy];

      // Handle boolean values for status (isCompleted)
      if (sortBy === "status") {
        compareA = a.isCompleted ? 1 : 0;
        compareB = b.isCompleted ? 1 : 0;
      }

      // Handle string values (name, priority)
      if (typeof compareA === "string" && typeof compareB === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      // Handle number values (id)
      if (typeof compareA === "number" && typeof compareB === "number") {
        // No need to modify the values, just compare directly
      }

      // Compare the values based on sortOrder
      if (compareA < compareB) {
        return sortOrder === "asc" ? -1 : 1;
      } else if (compareA > compareB) {
        return sortOrder === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });

    setFilteredData(sortedData);
  }, [statusFilter, priorityFilter, data, sortOrder]);

  const handleScroll = () => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight;

    if (bottom) {
      console.log("Reached bottom, incrementing page");
      dispatch(setCurrentPage(currentPage + 1));

      console.log(currentPage, "current page");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="task-list-container">
      {error && <div className="error">{error}</div>}

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="Все">Все</option>
          <option value="Выполненные">Выполненные</option>
          <option value="Невыполненные">Невыполненные</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="Все">Все</option>
          <option value="Высокий">Высокий</option>
          <option value="Средний">Средний</option>
          <option value="Низкий">Низкий</option>
          <option value="Без приоритета">Без приоритета</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "status" | "priority" | "id")}
        >
          <option value="name">Сортировать по имени</option>
          <option value="status">Сортировать по статусу</option>
          <option value="priority">Сортировать по приоритету</option>
          <option value="id">Сортировать по ID</option>
        </select>
      </div>

      <ul className="task-list">
        {filteredData.map(({ id, name, desc, priority, isCompleted, index }) => (
          <li key={index} className="task">
            <div className="task__name">{name}</div>
            <div className="task__desc">{desc}</div>
            <div className="task__priority">{priority}</div>
            <div className="task__status">{isCompleted ? "Выполнено" : "Невыполнено"}</div>
          </li>
        ))}
      </ul>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Загрузка...</span>
        </div>
      )}
    </div>
  );
};

export default Task;
