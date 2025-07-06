import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    submissionError: "",
  });
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/login`,
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setSubmissionMessage(response.data.message);
        setTimeout(() => navigate("/"), 2000);
      }
      setFormData({ username: "", password: "" });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ ...error, submissionError: error.response.data.message });
      }
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Back</h2>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {}),
              }}
              placeholder="Enter your username"
            />
            {errors.username && (
              <span style={styles.errorMessage}>{errors.username}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span style={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        <div style={styles.registerLink}>
          <Link style={styles.linkButton} to={"/register"}>
            Don't have an account? Register here
          </Link>
        </div>
        <div style={styles.successMessage}>
          {submissionMessage && <span>{submissionMessage}</span>}
        </div>
        <div style={{ textAlign: "center" }}>
          {errors.submissionError && (
            <span style={{ ...styles.errorMessage, fontSize: "16px" }}>
              {errors.submissionError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #e1e5e9",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555555",
  },
  input: {
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  inputError: {
    borderColor: "#dc3545",
    boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
  },
  errorMessage: {
    fontSize: "12px",
    color: "#dc3545",
    marginTop: "4px",
  },

  button: {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    marginTop: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
    transform: "none",
  },
  registerLink: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "14px",
    color: "#666666",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
    fontWeight: "500",
  },

  successMessage: {
    fontSize: "14px",
    color: "#007bff",
    textDecoration: "underline",
    textAlign: "center",
    marginTop: "12px",
  },
};

export default LoginPage;
