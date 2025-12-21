"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:4000";

export default function Home() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [taskId, setTaskId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/tasks/${taskId}`);
      return res.data;
    },
    enabled: !!taskId,
    refetchInterval: 3000,
  });

  const submitTask = async () => {
    if (!url || !question) return;

    setSubmitting(true);
    const res = await axios.post(`${API_URL}/tasks`, {
      url,
      question,
    });

    setTaskId(res.data.taskId);
    setSubmitting(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Website Q&A</h1>
        <p style={styles.subtitle}>
          Ask a question about any public website and get an AI-generated answer.
        </p>

        <label style={styles.label}>Website URL</label>
        <input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Your Question</label>
        <textarea
          placeholder="What is this website about?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.textarea}
        />

        <button
          onClick={submitTask}
          disabled={submitting || !url || !question}
          style={{
            ...styles.button,
            opacity: submitting || !url || !question ? 0.6 : 1,
          }}
        >
          {submitting ? "Submitting..." : "Ask Question"}
        </button>

        {(isLoading || data) && (
          <div style={styles.resultBox}>
            <p>
              <strong>Status:</strong>{" "}
              {data?.status ?? "starting..."}
            </p>

            {data?.answer && (
              <>
                <h3 style={{ marginTop: 15 }}>Answer</h3>
                <pre style={styles.answer}>{data.answer}</pre>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


// Styles

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: 5,
    fontSize: 24,
  },
  subtitle: {
    marginBottom: 20,
    color: "#555",
    fontSize: 14,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 500,
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    padding: 10,
    minHeight: 80,
    marginBottom: 20,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  resultBox: {
    marginTop: 25,
    padding: 15,
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  answer: {
    whiteSpace: "pre-wrap",
    fontSize: 14,
    lineHeight: 1.5,
  },
};
