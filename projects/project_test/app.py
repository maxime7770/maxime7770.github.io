from flask import Flask, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)

# Load model and tokenizer
model = AutoModelForCausalLM.from_pretrained("tiny_llm", torch_dtype="auto")
tokenizer = AutoTokenizer.from_pretrained("tiny_llm")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text_to_process = data['text']

    inputs = tokenizer(text_to_process, return_tensors="pt", return_attention_mask=False)
    outputs = model.generate(**inputs, max_length=200)
    generated_text = tokenizer.batch_decode(outputs)[0]

    return jsonify({"response": generated_text})

if __name__ == '__main__':
    app.run(debug=True)
