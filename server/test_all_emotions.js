import { classifyLocally } from "./utils/emotionClassifier.js";

const testCases = {
  romantic: ["I love you so much ❤️", "You are beautiful, let's go on a date"],
  funny: ["that was so funny 😂", "haha what a hilarious joke lmao"],
  angry: ["I hate this, it is so annoying 😡", "shut up, you are stupid"],
  sad: ["I feel so sad and lonely 😢", "I want to cry, my heart is broken"],
  excited: ["OMG this is so exciting 🎉", "wow, awesome, can't wait!"],
  calm: ["let's relax and chill 🌿", "breathe in, find your peace and quiet"],
  motivational: ["we will succeed and win 🚀", "keep going, focus on your goals and work hard"],
  celebration: ["happy birthday to you! 🎉", "congrats, let's celebrate and party!"],
  friendly: ["hello my friend 👋", "thanks buddy, nice to see you"],
  professional: ["let's discuss the project status in the meeting 💼", "schedule the client call and update the report"],
  horror: ["I am so scared, this ghost is spooky 💀", "this dark nightmare is creepy"],
  fantasy: ["this magic unicorn is starry 🪄", "a dream wonderland fairytale"]
};

console.log("=== Emotion Classification Test ===");
for (const [emotion, messages] of Object.entries(testCases)) {
  console.log(`\nTesting Emotion: ${emotion.toUpperCase()}`);
  for (const msg of messages) {
    const res = classifyLocally([msg]);
    console.log(` - Text: "${msg}"`);
    console.log(`   Output: emotion='${res.emotion}', confidence=${res.confidence} (Success: ${res.emotion === emotion && res.confidence >= 0.60})`);
  }
}
