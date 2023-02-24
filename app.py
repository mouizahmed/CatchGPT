from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from model import model

app = Flask(__name__)


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.form['text']
    modelTest = model()
    output = modelTest(data)
    return jsonify(output)

@app.route("/")
def index():

    
    #text = request.form['text']
    #modelTest = model()
    #output = modelTest(text)
    #flash(output)
    #return redirect(url_for("index", output=output))
    #return render_template('index.html', output=output, show_results=True)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)