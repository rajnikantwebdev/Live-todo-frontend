import React, { useEffect, useState } from "react";
import axios from "axios";

const UserLogs = () => {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    (async function fetchUserLogs() {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/logs`
      );

      if (response.status === 200) {
        setLogs(response.data.data);
      }
    })();
  }, []);

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case "create":
        return "#10b981";
      case "edit":
        return "#3b82f6";
      case "delete":
        return "#ef4444";
      case "re-assign":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  console.log("logs: ", logs);
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Activity Log</h3>
          <span style={styles.count}>{logs?.length || 0} activities</span>
        </div>

        <div style={styles.logsList}>
          {logs !== null &&
            logs.map((log, index) => {
              const action = log?.data?.action;
              const actionText =
                action !== "Edit" ? action + "d" : action + "ed";

              return (
                <div key={index} style={styles.logItem}>
                  <div style={styles.logContent}>
                    <div style={styles.logHeader}>
                      <div style={styles.userInfo}>
                        <div
                          style={{
                            ...styles.actionIcon,
                            backgroundColor: getActionColor(action) + "20",
                            color: getActionColor(action),
                          }}
                        >
                          {/* {getActionIcon(action)} */}
                        </div>
                        <span style={styles.username}>
                          {log?.data?.actor?.username}
                        </span>
                      </div>

                      <div style={styles.timestamp}>
                        {/* <Clock size={12} /> */}
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    <div style={styles.logMessage}>
                      <span style={styles.actionText}>{actionText}</span>
                      <span style={styles.taskTitle}>
                        "{log?.data?.task.title}"
                      </span>
                    </div>
                  </div>

                  {index < logs.length - 1 && <div style={styles.separator} />}
                </div>
              );
            })}

          {(!logs || logs.length === 0) && (
            <div style={styles.emptyState}>
              {/* <User size={48} color="#d1d5db" /> */}
              <p style={styles.emptyText}>No activity logs yet</p>
              <p style={styles.emptySubtext}>User actions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f9fafb",
    boxSizing: "border-box",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    width: "80%",
    margin: "0 auto",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #f3f4f6",
    backgroundColor: "#fafafa",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
  count: {
    fontSize: "14px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: "12px",
    fontWeight: "500",
  },
  logsList: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  logItem: {
    position: "relative",
  },
  logContent: {
    padding: "16px 24px",
    transition: "background-color 0.2s ease",
  },
  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  actionIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  username: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937",
  },
  timestamp: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "#9ca3af",
  },
  logMessage: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#4b5563",
    marginLeft: "38px",
  },
  actionText: {
    fontWeight: "500",
    color: "#1f2937",
  },
  taskTitle: {
    fontWeight: "600",
    color: "#3b82f6",
    marginLeft: "4px",
  },
  separator: {
    height: "1px",
    backgroundColor: "#f3f4f6",
    margin: "0 24px",
  },
  emptyState: {
    padding: "48px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  emptyText: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "500",
    color: "#6b7280",
  },
  emptySubtext: {
    margin: 0,
    fontSize: "14px",
    color: "#9ca3af",
  },
};

export default UserLogs;
