from flask import Flask, request, jsonify
from llama_cpp import Llama

app = Flask(__name__)

# Initialize the Llama model
llm = Llama(
    model_path="./phi-2.Q4_K_M.gguf",
    n_ctx=4096,
    n_threads=8,
    n_gpu_layers=35
)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    prompt = data['text']
    
    output = llm(
        f"Instruct: {prompt}\nOutput:",
        max_tokens=512,
        stop=["</s>"],
        echo=True
    )

    return jsonify({"response": output})

if __name__ == '__main__':
    app.run(debug=True)
