from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
import pandas as pd
from utils.process import process_csv
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
        results = process_csv(df)
        return jsonify(results)
    else:
        return jsonify({"error": "File type not supported"}), 400

@app.route('/download-report', methods=['POST'])
def download_report():
    file = request.files['file']
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
        df = df.dropna()
        num_df = df.select_dtypes(include=['float64', 'int64'])

        scaler = StandardScaler()
        scaled = scaler.fit_transform(num_df)
        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(scaled)
        df['Segment'] = clusters

        summary = df.groupby('Segment').size().reset_index(name='count')

        # Save CSV to temp file
        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
        summary.to_csv(temp.name, index=False)

        return send_file(temp.name, as_attachment=True, download_name="segment_summary.csv", mimetype='text/csv')
    else:
        return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)
