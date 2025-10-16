from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from machine_learning import MLChatbot 

chatbot = MLChatbot("data.csv")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
API_KEY = "#fx294421231intelligenceAPI.0012112708#"

@app.post("/fxintelligence-1.0-lite")
async def ask(request: Request):
    data = await request.json()
    api_key = data.get("api_key")
    question = data.get("question")

    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    
    answer = chatbot.jawab(question)
    return {"answer": answer}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
