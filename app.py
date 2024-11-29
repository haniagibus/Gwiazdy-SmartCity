from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

    #production server
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=8080)

