const express=require('express');
const app =express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GOOGLEAIKEY;
app.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});
app.post('/api/generate', async (req, res) => {
  const { product, vibe } = req.body;

  try {
   const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("Successful");
    const prompt =`I am a marketing expert. Create 2 things for a product: "${product}" with a "${vibe}" style.
      
      1. An engaging Instagram caption with emojis and hashtags.
      2. A highly descriptive image generation prompt (max 40 words). 
         - CRITICAL: Do NOT use words like "picture of" or "image of". 
         - Focus on: Lighting, Texture, 8k resolution, Photorealistic, Unreal Engine 5 render, Depth of Field.
         - Example style: "Cinematic product shot of ${product}, dramatic side lighting, hyper-detailed texture, 8k, bokeh background."
      
      Return the response STRICTLY as a JSON object like this:
      {
        "caption": "Your caption here",
        "imagePrompt": "Your image prompt here"
      }`
      const result = await model.generateContent(prompt);
      const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanText);

    res.status(200).json(data);

    res.status(200).json({
      status:"Success"
})
  } catch (error) {
    console.error(error);
    res.status(500).json({
        status:"Fail",
        message: error
    });
  }
});

app.listen(4000,()=>{
    console.log("Server Started");
})