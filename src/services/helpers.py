import os
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

gemini_model = ChatGoogleGenerativeAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    model="gemini-2.5-flash"
)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150,
    separators=["\n\n", "\n", ".", " "]
)

embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

def getEmbeddings(context: str, argument: str) -> str:
    response = ""
    docs = splitter.create_documents([context]) if context else []
    if docs:
        vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=embedding_model
        )

        retriever = vectorstore.as_retriever(
            search_kwargs={'k': 5}
        )

        retrieved_docs = retriever.invoke(argument)
        response = '\n\n'.join([d.page_content for d in retrieved_docs])

        vectorstore.delete_collection()

    return response