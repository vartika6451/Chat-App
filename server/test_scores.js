import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

async function run() {
  const conv = await prisma.conversation.findFirst({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 15 }
    }
  });

  const messageTexts = conv.messages.reverse().map(m => m.text);

  const scores = {};
  EMOTIONS.forEach((e) => { scores[e] = 0; });

  messageTexts.forEach((text, index) => {
    const recencyWeight = Math.pow(0.92, messageTexts.length - 1 - index); 
    const lowerText = text.toLowerCase();
    
    console.log(`\nText: "${text}" (index ${index}, weight: ${recencyWeight.toFixed(4)})`);

    EMOTIONS.forEach((emotion) => {
      const config = emotionKeywords[emotion];
      let matchCount = 0;

      config.words.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          matchCount += matches.length;
          console.log(` - Matches word "${word}" under "${emotion}" (count: ${matches.length})`);
        }
      });

      config.emojis.forEach((emoji) => {
        const matches = lowerText.split(emoji).length - 1;
        if (matches > 0) {
          matchCount += matches * 1.5;
          console.log(` - Matches emoji "${emoji}" under "${emotion}" (count: ${matches})`);
        }
      });

      if (matchCount > 0) {
        const added = matchCount * config.weight * recencyWeight;
        scores[emotion] += added;
        console.log(` -> Added score to "${emotion}": ${added.toFixed(4)}`);
      }
    });
  });

  console.log("\nFinal Scores:", scores);
  await prisma.$disconnect();
}

run();
