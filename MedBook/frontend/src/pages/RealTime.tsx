import React, { useEffect, useState } from "react";
import axios from "axios";

const RealtimeHealthNews: React.FC = () => {
  const [healthNews, setHealthNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealthNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          category: "health",
          country: "us", // Change to your preferred country code
          apiKey: "798f9ad2f6dc4befab3ec46c5b0da2b4", // Replace with your NewsAPI key
        },
      });

      // Filter out invalid news articles
      const validArticles = response.data.articles.filter(
        (article: any) =>
          article.title &&
          article.description &&
          article.urlToImage &&
          !article.title.includes("[Removed]")
      );

      // Shuffle the articles randomly
      const shuffledArticles = validArticles.sort(() => Math.random() - 0.5);

      setHealthNews(shuffledArticles);
    } catch (error) {
      console.error("Error fetching health news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthNews();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Real-Time Health News</h1>
      <button
        onClick={fetchHealthNews}
        disabled={loading}
        style={styles.refreshButton}
      >
        {loading ? "Loading..." : "Refresh News"}
      </button>
      <div style={styles.gridContainer}>
        {healthNews.length > 0 ? (
          healthNews.map((newsItem, index) => (
            <div key={index} style={styles.card}>
              <a
                href={newsItem.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                <img
                  src={newsItem.urlToImage || "https://via.placeholder.com/150"}
                  alt={newsItem.title}
                  style={styles.image}
                />
                <h3 style={styles.title}>{newsItem.title}</h3>
              </a>
              <p style={styles.description}>{newsItem.description}</p>
              <p style={styles.source}>
                Source: {newsItem.source.name} | Published:{" "}
                {new Date(newsItem.publishedAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noNews}>
            {loading ? "Loading health news..." : "No news available."}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center" as "center",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  refreshButton: {
    display: "block",
    margin: "0 auto 20px auto",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "space-between",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover" as "cover",
  },
  title: {
    fontSize: "1.2rem",
    margin: "10px",
  },
  description: {
    fontSize: "0.9rem",
    margin: "10px",
    color: "#555",
  },
  source: {
    fontSize: "0.8rem",
    margin: "10px",
    color: "#888",
  },
  noNews: {
    textAlign: "center" as "center",
    fontSize: "1.2rem",
    color: "#666",
  },
};

export default RealtimeHealthNews;
