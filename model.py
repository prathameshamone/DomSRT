from google import genai

Client = genai.Client(api_key="AQ.Ab8RN6KQ1xis0A0U92yftbc2F9uUmp66umI1xC06E1FhOdNTGw")

model = Client.chats.create(model="gemini-3.5-flash-lite")

while True :
    question = input("You : ")

    if question.lower() == "exit" :
        break

    response = model.send_message(question)

    print("DomSRT : ", response.text)