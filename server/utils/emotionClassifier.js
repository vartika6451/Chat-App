// server/utils/emotionClassifier.js
import dotenv from "dotenv";
dotenv.config();

const EMOTIONS = [
  "romantic", "funny", "angry", "sad", "excited",
  "calm", "motivational", "celebration", "friendly",
  "professional", "horror", "fantasy"
];

const emotionKeywords = {
  romantic: {
    words: ['love', 'babe', 'darling', 'honey', 'sweetheart', 'kiss', 'date', 'forever', 'romantic', 'beautiful', 'gorgeous', 'handsome', 'crush', 'miss you', 'dear'],
    emojis: ['❤️', '💖', '💕', '💘', '💞', '😍', '😘', '👩‍❤️‍👨', '🌹', '💌'],
    weight: 1.3
  },
  funny: {
    words: ['haha', 'lol', 'funny', 'joke', 'lmao', 'rofl', 'hilarious', 'meme', 'crazy', 'prank', 'comedy', 'laugh', 'giggle', 'witty'],
    emojis: ['😂', '🤣', '😹', '😆', '😜', '🤡', '😹'],
    weight: 1.0
  },
  angry: {
    words: ['hate', 'angry', 'furious', 'annoyed', 'pissed', 'shut up', 'stupid', 'mad', 'worst', 'idiot', 'jerk', 'hate you', 'frustrated', 'nonsense', 'irritated'],
    emojis: ['😠', '😡', '🤬', '👿', '🖕', '😤', '👊'],
    weight: 1.4
  },
  sad: {
    words: ['sad', 'cry', 'sorry', 'hurt', 'grief', 'pain', 'broken', 'lonely', 'unhappy', 'depressed', 'miss', 'gloomy', 'tears', 'alone', 'blue', 'weep'],
    emojis: ['😢', '😭', '😞', '😔', '💔', '😿', '🥺', '🌧️', '😩'],
    weight: 1.3
  },
  excited: {
    words: ['excited', 'wow', 'awesome', 'great', 'hype', 'amazing', 'super', 'cool', 'unbelievable', 'thrilled', 'yes', 'omg', 'stunning', 'incredible'],
    emojis: ['🎉', '🥳', '🤩', '💥', '⚡', '🚀', '🌟', '✨'],
    weight: 1.0
  },
  calm: {
    words: ['calm', 'relax', 'peace', 'chill', 'mint', 'quiet', 'breathe', 'slow', 'rest', 'peaceful', 'meditate', 'serene', 'mild', 'soothe'],
    emojis: ['🌿', '🍃', '🧘', '🍵', '🕯️', '🕊️', '☁️'],
    weight: 1.0
  },
  motivational: {
    words: ['motivation', 'success', 'work', 'hard', 'focus', 'achieve', 'win', 'progress', 'goals', 'keep going', 'inspire', 'never give up', 'strive', 'dream', 'hustle'],
    emojis: ['🚀', '💪', '🏆', '📈', '🎯', '🔥', '🧗'],
    weight: 1.1
  },
  celebration: {
    words: ['congrats', 'congratulations', 'happy birthday', 'celebrate', 'party', 'anniversary', 'cheers', 'champagne', 'festival', 'holiday', 'gift', 'balloon'],
    emojis: ['🎉', '🍾', '🎂', '🎁', '🎈', '🍻', '🎊'],
    weight: 1.3
  },
  friendly: {
    words: ['friend', 'buddy', 'thanks', 'thank you', 'welcome', 'nice', 'glad', 'mate', 'hello', 'hi', 'hey', 'good to see', 'kind', 'sweet'],
    emojis: ['👋', '😊', '🤝', '🙌', '🌸', '😺'],
    weight: 0.8
  },
  professional: {
    words: ['meeting', 'project', 'deadline', 'client', 'report', 'schedule', 'work', 'status', 'update', 'task', 'agenda', 'discuss', 'strategy', 'email', 'deliverable'],
    emojis: ['👔', '💼', '📈', '📋', '📁', '💻', '📆'],
    weight: 1.1
  },
  horror: {
    words: ['scared', 'horror', 'ghost', 'spooky', 'dark', 'fear', 'death', 'nightmare', 'creepy', 'monster', 'blood', 'halloween', 'terrified', 'haunted', 'skeleton'],
    emojis: ['💀', '👻', '🧛', '🧟', '🎃', '🕸️', '😱', '🦇'],
    weight: 1.3
  },
  fantasy: {
    words: ['magic', 'unicorn', 'dream', 'fantasy', 'wonderland', 'spell', 'dragon', 'starry', 'fairytale', 'mermaid', 'wizard', 'mythic', 'celestial', 'magical'],
    emojis: ['🦄', '🪄', '🌟', '🌈', '🧚', '🐉', '✨', '🧜‍♀️'],
    weight: 1.1
  }
};

/**
 * Runs a fallback keyword-based classifier locally
 * @param {Array<string>} messageTexts - Last few messages
 * @returns {object} { emotion: string, confidence: number }
 */
export const classifyLocally = (messageTexts) => {
  if (!messageTexts || messageTexts.length === 0) {
    return { emotion: "friendly", confidence: 0.50 };
  }

  const scores = {};
  EMOTIONS.forEach((e) => { scores[e] = 0; });

  // Iterate messages, newest holds the highest weight
  messageTexts.forEach((text, index) => {
    if (!text || typeof text !== "string") return;
    
    // Weight decays as messages get older
    const recencyWeight = Math.pow(0.92, messageTexts.length - 1 - index); 
    const lowerText = text.toLowerCase();

    EMOTIONS.forEach((emotion) => {
      const config = emotionKeywords[emotion];
      let matchCount = 0;

      // Check keywords
      config.words.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          matchCount += matches.length;
        }
      });

      // Check emojis
      config.emojis.forEach((emoji) => {
        const matches = lowerText.split(emoji).length - 1;
        if (matches > 0) {
          matchCount += matches * 1.5; // Emojis carry higher weight
        }
      });

      scores[emotion] += matchCount * config.weight * recencyWeight;
    });
  });

  // Find emotion with highest score
  let bestEmotion = "friendly";
  let maxScore = 0;
  
  EMOTIONS.forEach((emotion) => {
    if (scores[emotion] > maxScore) {
      maxScore = scores[emotion];
      bestEmotion = emotion;
    }
  });

  // Calculate confidence based on score relative to maximum possible or a scale
  let confidence = 0.50;
  if (maxScore > 0) {
    // Basic scaling logic: score of 2.5+ is high confidence
    confidence = Math.min(0.50 + (maxScore / 2.5) * 0.45, 0.95);
  }

  return { emotion: bestEmotion, confidence: parseFloat(confidence.toFixed(2)) };
};

/**
 * Classifies the emotion of a list of messages using Gemini or local fallback
 * @param {Array<{sender: string, text: string}>} conversationHistory - Last few messages with sender names
 * @returns {Promise<{emotion: string, confidence: number}>}
 */
export const classifyEmotion = async (conversationHistory) => {
  const messageTexts = conversationHistory.map(m => m.text);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("ℹ️ [EMOTION CLASSIFIER] No GEMINI_API_KEY found. Using local classifier.");
    return classifyLocally(messageTexts);
  }

  try {
    const formattedHistory = conversationHistory
      .map(m => `${m.sender}: "${m.text}"`)
      .join("\n");

    const prompt = `Analyze the sentiment of the following chat conversation history and classify its current dominant emotion.
Choose EXACTLY ONE emotion from this list of options:
- romantic
- funny
- angry
- sad
- excited
- calm
- motivational
- celebration
- friendly
- professional
- horror
- fantasy

Evaluate the general tone of the last few exchanges, giving more importance to the most recent messages. Output your analysis in a valid JSON format containing the fields "emotion" and "confidence" (ranging from 0.0 to 1.0). Do not write any markdown code fences or explanations.

Conversation:
${formattedHistory}

JSON Response:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (rawText) {
      const parsed = JSON.parse(rawText.trim());
      const emotion = parsed.emotion?.toLowerCase().trim();
      const confidence = parseFloat(parsed.confidence);

      if (EMOTIONS.includes(emotion) && !isNaN(confidence)) {
        console.log(`🤖 [EMOTION CLASSIFIER] Gemini classification: ${emotion} (${confidence})`);
        return { emotion, confidence };
      }
    }
    
    throw new Error("Invalid response format from Gemini");
  } catch (err) {
    console.warn("⚠️ [EMOTION CLASSIFIER] Gemini classification failed. Falling back to local classifier. Error:", err.message);
    return classifyLocally(messageTexts);
  }
};
