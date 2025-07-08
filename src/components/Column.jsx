import React, { useEffect } from "react";
import TodoCard from "./TodoCard";
import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { socket } from "../../socketIo";

const Column = ({ title, tasks, columnColor, columnKey, onDropTask }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "task",
    drop: (item) => {
      onDropTask(item, columnKey);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div style={styles.column}>
      <div style={{ ...styles.columnHeader, backgroundColor: columnColor }}>
        <h2 style={styles.columnTitle}>{title}</h2>
        <span style={styles.taskCount}>{tasks.length}</span>
      </div>

      <div ref={drop} style={styles.tasksContainer}>
        {tasks.map((task) => {
          return <TodoCard key={task._id} todoData={task} />;
        })}

        {tasks.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  column: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
    flex: "1",
    maxWidth: "350px",
    overflow: "hidden",
  },
  columnHeader: {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e2e8f0",
  },
  columnTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    margin: "0",
  },
  taskCount: {
    backgroundColor: "#ffffff",
    color: "#4a5568",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    minWidth: "20px",
    textAlign: "center",
  },
  tasksContainer: {
    padding: "16px",
    minHeight: "400px",
    maxHeight: "600px",
    overflowY: "auto",
  },
  todoCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
    gap: "12px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2d3748",
    margin: "0",
    lineHeight: "1.3",
    flex: "1",
  },
  priorityBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    border: "1px solid",
    flexShrink: "0",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#4a5568",
    margin: "0 0 12px 0",
    lineHeight: "1.4",
  },
  assignee: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#4299e1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: "0",
  },
  assigneeName: {
    fontSize: "12px",
    color: "#718096",
    fontWeight: "500",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#a0aec0",
  },
  emptyText: {
    fontSize: "14px",
    margin: "0",
    fontStyle: "italic",
  },
};

export default Column;
