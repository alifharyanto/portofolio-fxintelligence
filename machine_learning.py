import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class MLChatbot:
    def __init__(self, csv_file: str):
        #mengambil data dari csv
        data = pd.read_csv(csv_file)
        self.pertanyaan_list = data["pertanyaan"].tolist()
        self.jawaban_list = data["jawaban"].tolist()

        self.vectorizer = CountVectorizer()
        self.X = self.vectorizer.fit_transform(self.pertanyaan_list)

    def jawab(self, pertanyaan_user: str) -> str:
        # Cari jawaban paling mirip
        user_vec = self.vectorizer.transform([pertanyaan_user])
        similarity = cosine_similarity(user_vec, self.X)
        idx = similarity.argmax()
        if similarity[0, idx] < 0.1:
         return "Maaf, saya tidak tahu jawaban nya"
        return self.jawaban_list[idx]

#bagian function CLI terminal
if __name__ == "__main__":
    chatbot = MLChatbot("data.csv")
    print("Ketik 'exit' untuk keluar")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        print("FX Intelligence:", chatbot.jawab(user_input))
