import os
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import Chroma
from typing import Any
from dotenv import load_dotenv

load_dotenv()

class Chatbot:
    def __init__(self, data: Any) -> None:
        self.context = []
        self.data = data

        self.gemini = ChatGoogleGenerativeAI(
            model="gemini2.5-flash",
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=150,
            separators=["\n\n", "\n", ".", " "]
        )

        self.embedding_model = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )

    def getEmbeddings(self, context: str = None, argument: str = "") -> str:
        response = ""
        docs = self.splitter.create_documents([context]) if context else []
        
        if docs:
            vectorstore = Chroma.from_documents(
                documents=docs,
                embedding=self.embedding_model
            )

            retriever = vectorstore.as_retriever(
                search_kwargs={'k': 5}
            )

            retrieved_docs = retriever.invoke(argument)
            response = '\n\n'.join([d.page_content for d in retrieved_docs])

            vectorstore.delete_collection()

        return response
    
    def responseModel(self, query: str) -> str:
        ref_embeddings = self.getEmbeddings(
            context=self.data,
            argument=query
        )

        context_embeddings = self.getEmbeddings(
            context=self.context,
            argument=query
        )
        prompt = PromptTemplate(
            template="""
                You are a Travel Support AI. Your objective is to assist users with itinerary management, booking resolutions, and 
                travel logistics based on provided references and context.

                Reference and Context
                You must prioritize information found in the provided Reference and Context blocks. If a user's request contradicts 
                the provided data, gently point out the discrepancy. If information is missing from the references, inform the user 
                you do not have that specific detail rather than inventing it.

                Communication Guidelines
                Keep responses direct and functional. Focus on accuracy over creative flourishes. When dealing with travel disruptions, 
                provide a clear status update followed by actionable next steps. Use plain text for all communication.

                Operational Rules

                1. Cross-reference user booking IDs and flight numbers with the context before confirming.
                2. If the user is reporting a problem, check the context for refund or rebooking policies.
                3. Maintain a professional and helpful tone without using overly emotive language.
                4. Do not disclose internal system codes or raw data strings to the user; translate them into readable information.
                5. If the context contains safety or health warnings for a destination, ensure they are mentioned in any relevant 
                travel plans.

                INPUT:
                Reference: {reference_embeddings}
                Context: {context_embeddings}
            """,
            input_variables=['reference_embeddings', 'context_embeddings']
        )

        chain = prompt | self.gemini | StrOutputParser()
        response = chain.ainvoke({
            "reference_embeddings": ref_embeddings,
            "context_embeddings": context_embeddings
        })

        return response