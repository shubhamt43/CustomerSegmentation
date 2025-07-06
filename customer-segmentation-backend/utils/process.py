import io
import base64
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def generate_base64_plot(fig):
    buf = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buf, format="png")
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def process_csv(df):
    df = df.dropna()
    num_df = df.select_dtypes(include=['float64', 'int64'])

    scaler = StandardScaler()
    scaled = scaler.fit_transform(num_df)

    kmeans = KMeans(n_clusters=3, random_state=42)
    df['Segment'] = kmeans.fit_predict(scaled)

    summary = df.groupby('Segment').size().reset_index(name='count')
    
    # --- Chart 1: Bar chart of customers per segment
    fig1 = plt.figure()
    sns.barplot(data=summary, x='Segment', y='count', palette='pastel')
    plt.title("Customer Count per Segment")
    chart1 = generate_base64_plot(fig1)

    # --- Chart 2: Age distribution per segment
    fig2 = plt.figure()
    sns.boxplot(data=df, x='Segment', y='Age', palette='Set2')
    plt.title("Age Distribution per Segment")
    chart2 = generate_base64_plot(fig2)

    # --- Chart 3: Income by segment
    fig3 = plt.figure()
    sns.boxplot(data=df, x='Segment', y='Annual Income (k$)', palette='Set3')
    plt.title("Income Distribution per Segment")
    chart3 = generate_base64_plot(fig3)

    # --- Chart 4: Gender distribution by segment (if 'Gender' column exists)
    chart4 = None
    if 'Gender' in df.columns:
        fig4 = plt.figure()
        sns.countplot(data=df, x='Segment', hue='Gender', palette='muted')
        plt.title("Gender Distribution by Segment")
        chart4 = generate_base64_plot(fig4)

    return {
        "summary": summary.to_dict(orient='records'),
        "preview": df.head().to_dict(orient='records'),
        "charts": {
            "segment_distribution": chart1,
            "age_distribution": chart2,
            "income_distribution": chart3,
            "gender_distribution": chart4,
        }
    }
