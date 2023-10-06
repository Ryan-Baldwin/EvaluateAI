import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";



  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  export const runtime = "edge";
  
  export async function POST(req: Request): Promise<Response> {
    // Check if the OPENAI_API_KEY is set, if not return 400
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
      return new Response(
        "Missing OPENAI_API_KEY – make sure to add it to your .env file.",
        {
          status: 400,
        },
      );
    }
    
    let { 
      systemMessage, 
      prompt, 
      model = "gpt-3.5-turbo", 
      temperature = 0.7, 
      top_p = 1, 
      frequency_penalty = 0, 
      presence_penalty = 0, 
      stream = true, 
      n = 1 
    } = await req.json();
  
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      stream,
      n,
    });
  
    // If the response is unauthorized, return a 401 error
    if (response.status === 401) {
      return new Response("Error: You are unauthorized to perform this action", {
        status: 401,
      });
    }
    
    // Convert the response into a friendly text-stream
    const streamed = OpenAIStream(response);
  
    // Respond with the stream
    return new StreamingTextResponse(streamed);
  }
  