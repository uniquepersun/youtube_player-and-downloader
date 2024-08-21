from flask import Flask, render_template,request , send_file
from yt_dlp import YoutubeDL

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    ydl_opts = {}
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        video_file = ydl.prepare_filename(info)
    return send_file(video_file, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
