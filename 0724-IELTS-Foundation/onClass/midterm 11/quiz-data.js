export const meta = { title: 'Mid-Term Test 3' };
export const assignmentId = 'mid-term-test-3'; // A unique ID for this assignment
export const sections = [
    {
        title: "Reading Passage I",
        id: "reading-passage-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the following advertisement and mark the letter A, B, C and D on your answer sheet to indicate the option that best fits each of the numbered blanks from 1 to 6.",
        readingText: "Living a healthy life requires a combination of good habits which promote both physical and mental well-being. People (1)___ prioritize balanced nutrition and regular exercises often (2)___ improved energy levels and overall happiness. Eating a variety of fruits and vegetables, which contain essential vitamins and minerals, is fundamental to maintaining health. The (3)___ of adults who meet recommended daily activity guidelines has increased recently, reflecting a positive shift in public awareness. Sometimes, (4)___ mindfulness practices such as meditation helps reduce stress and improve focus. Understanding the importance of nutrition allows individuals to make better dietary choices. Additionally, staying hydrated by drinking enough water contributes (5)___ to bodily functions, which many (6)___ underestimate.",
        questions: [
            { qNum: 1, type: 'mcq-standard', prompt: "1.", options: ["which", "that", "whose", "who"] },
            { qNum: 2, type: 'mcq-standard', prompt: "2.", options: ["has experienced", "experience", "is experiencing", "experienced"] },
            { qNum: 3, type: 'mcq-standard', prompt: "3.", options: ["range", "amount", "percent", "percentage"] },
            { qNum: 4, type: 'mcq-standard', prompt: "4.", options: ["challenging", "misleading", "incorporating", "disturbing"] },
            { qNum: 5, type: 'mcq-standard', prompt: "5.", options: ["significantly", "significant", "significance", "insignificantly"] },
            { qNum: 6, type: 'mcq-standard', prompt: "6.", options: ["confide in", "tend to", "resort to", "refrain from"] }
        ],
        answers: { 1: 'D', 2: 'B', 3: 'D', 4: 'C', 5: 'A', 6: 'B' }
    },
    {
        title: "Reading Passage II",
        id: "reading-passage-2",
        renderer: 'renderReadingComprehension',
        instruction: "Read the following leaflet and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks from 7 to 12.",
        readingText: "Improving our health requires a holistic approach that focuses (7)___ both physical and mental aspects. (8)___, adopting small daily habits can lead to long-term benefits. One effective strategy is to start your day with (9)___ that boosts your metabolism. In addition to exercise, we should also concentrate on (10)___ healthy habits, such as getting enough sleep and reducing screen time. Many people improve their mental well-being by (11)___ mindfulness regularly, which helps reduce anxiety and increase focus. Lastly, make (12)___ for yourself is a useful collocation that encourages personal balance and stress relief.",
        questions: [
            { qNum: 7, type: 'mcq-standard', prompt: "7.", options: ["in", "with", "on", "for"] },
            { qNum: 8, type: 'mcq-standard', prompt: "8.", options: ["So", "Moreover", "Though", "Nonetheless"] },
            { qNum: 9, type: 'mcq-standard', prompt: "9.", options: ["a light nutritious breakfast", "a nutritious light breakfast", "a light breakfast nutritious", "light nutritious a breakfast"] },
            { qNum: 10, type: 'mcq-standard', prompt: "10.", options: ["others", "another", "the other", "other"] },
            { qNum: 11, type: 'mcq-standard', prompt: "11.", options: ["sustaining", "fostering", "justifying", "practicing"] },
            { qNum: 12, type: 'mcq-standard', prompt: "12.", options: ["priority", "impact", "time", "strategy"] }
        ],
        answers: { 7: 'C', 8: 'B', 9: 'A', 10: 'D', 11: 'D', 12: 'C' }
    },
    {
        title: "Arrangements",
        id: "arrangements",
        renderer: 'renderMcqTasks',
        instruction: "Mark the letter A, B, C or D on your answer sheet to indicate the best arrangement of utterances or sentences to make a meaningful exchange or text.",
        questions: [
            { qNum: 13, type: 'mcq-standard', prompt: "<b>a.</b> Anna: That sounds really helpful. I’ll definitely give it a try—thanks a lot!<br><b>b.</b> David: Certainly. You should maintain a balanced diet, exercise regularly, and, most importantly, manage stress through mindfulness or journaling.<br><b>c.</b> Anna: Excuse me, do you know any effective ways to stay healthy both physically and mentally?", options: ["c-a-b", "b-c-a", "c-b-a", "a-c-b"] },
            { qNum: 14, type: 'mcq-standard', prompt: "<b>a.</b> James: Yes, I’ve started prioritizing sleep and practicing intermittent fasting—it has significantly improved my focus and mood.<br><b>b.</b> James: That’s a great combination. Sustainable habits like these truly make a difference over time.<br><b>c.</b> Emily: Absolutely. Long-term health isn't about quick fixes—it's about consistency and self-awareness.<br><b>d.</b> Emily: You seem so energetic lately. Have you changed something in your routine?<br><b>e.</b> Emily: That’s impressive. I’ve been incorporating mindfulness and cutting down on processed food to feel more balanced.", options: ["d-e-b-a-c", "b-e-d-a-c", "c-d-a-b-c", "d-a-e-b-c"] },
            { qNum: 15, type: 'mcq-standard', prompt: "<b>a.</b> Initiating daily routines that include moderate physical activities...<br><b>b.</b> We understand that achieving optimal health requires a multifaceted approach...<br><b>c.</b> Furthermore, incorporating stress management techniques...<br><b>d.</b> Should you require personalized advice...<br><b>e.</b> Emphasizing a diet abundant in antioxidants...", options: ["b-a-e-c-d", "b-e-d-c-a", "a-e-b-d-b", "b-c-e-a-d"] },
            { qNum: 16, type: 'mcq-standard', prompt: "<b>a.</b> Prior to this, I had underestimated the profound impact...<br><b>b.</b> Adopting a daily mindfulness practice over the past year has markedly enhanced...<br><b>c.</b> The benefits were unmistakable: reduced anxiety, improved sleep quality...<br><b>d.</b> Ultimately, this journey has reinforced my conviction...<br><b>e.</b> Despite numerous professional obligations, I integrated activities...", options: ["b-c-d-e-a", "b-a-e-c-d", "b-c-a-d-e", "e-c-a-b-c"] },
            { qNum: 17, type: 'mcq-standard', prompt: "<b>a.</b> These comprehensive initiatives have substantially improved public health metrics...<br><b>b.</b> Over recent years, there has been a significant shift towards holistic health practices...<br><b>c.</b> Recognizing the importance of preventative care, healthcare providers have increasingly promoted...<br><b>d.</b> Consequently, communities now experience higher levels of vitality...<br><b>e.</b> To support this trend, wellness centers have expanded their offerings...", options: ["b-a-d-c-e", "e-a-d-c-b", "d-e-c-b-a", "b-e-c-a-d"] }
        ],
        answers: { 13: 'B', 14: 'D', 15: 'A', 16: 'B', 17: 'D' }
    },
    {
        title: "Cloze Test",
        id: "cloze-test-protein",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and mark the letter A, B, C or D to indicate the option that best fits each blank.",
        readingText: "There’s nothing like a big occasion looming on the calendar... to get you paying closer attention to your diet. For me, that was much of 2023. I was excitedly planning my fall wedding and (18)___. One of those things was protein... I had absorbed all the Big Protein buzz... (19)___, I decided to be a bit more intentional about my protein intake... I set a rough benchmark: 100 grams of protein per day... I tracked it for a few weeks until I felt like I had a good handle on things, then I went on vibes. (20)___, but over time without really realizing it, hitting my goal (or close to it) became the default, not the exception. Let me tell you, what started as a “let’s try this for a few months” (21)___ I’m still following today. (22)___ has had impossible-to-ignore effects, like way less brain fog and more sustained energy. I think I sleep better, and I know I get better workouts in.",
        questions: [
            { qNum: 18, type: 'mcq-standard', prompt: "18.", options: ["concerning about how I’ll look or feel on the big day—what matters more is just being present.", "preparing to look at and feel my best attraction has become a top priority for the big event.", "exploring ways to enhance my appearance and confidence for the big trip", "wondering what might help me look and feel my best on the big day"] },
            { qNum: 19, type: 'mcq-standard', prompt: "19.", options: ["Whether it was valid science or impressive marketing", "There was no doubt it was backed by credible scientific research", "It was clearly nothing more than a marketing ploy with no real scientific basis.", "Whether the claims are scientifically substantiated or merely dress up for consumer appeal."] },
            { qNum: 20, type: 'mcq-standard', prompt: "20.", options: ["I stressed over every little detail", "I couldn't help but spiral into overthinking", "I didn’t overly stress or obsess", "I became increasingly preoccupied."] },
            { qNum: 21, type: 'mcq-standard', prompt: "21.", options: ["failed to bring any lasting transformation", "seemed like a radical shift eventually proved to be", "ended up reinforcing the status quo", "has turned into a fundamental shift"] },
            { qNum: 22, type: 'mcq-standard', prompt: "22.", options: ["Being intentional about hitting higher daily protein targets", "Making a conscious effort to prioritize protein intake throughout the day", "Taking a more relaxed approach to nutrition without tracking macronutrient targets", "Disregarding specific protein goals in favor of intuitive eating"] }
        ],
        answers: { 18: 'D', 19: 'A', 20: 'C', 21: 'D', 22: 'A' }
    },
    {
        title: "Reading Comprehension I",
        id: "reading-comp-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and mark the letter A, B, C or D to indicate the best answer to each question.",
        readingText: "There are many ways to improve our health, but the most effective ones involve small, consistent lifestyle changes... Health experts argue that building long-term habits is more beneficial than drastic short-term solutions... One crucial aspect often overlooked is sleep... Moreover, managing stress through meditation or mindful breathing can significantly reduce blood pressure... Another vital contributor to better health is maintaining strong social connections... In fact, research suggests that loneliness can be as harmful to health as smoking or obesity... Modern technology also plays a growing role in promoting health... From fitness apps that track steps and calories to wearable devices that monitor heart rate and sleep cycles, people can now take more control of their health.",
        questions: [
            { qNum: 23, type: 'mcq-standard', prompt: "23. Which of the following is NOT mentioned as a factor affecting health?", options: ["Sleep", "Diet", "Education", "Social interaction"] },
            { qNum: 24, type: 'mcq-standard', prompt: "24. The word “drastic” in paragraph 1 is CLOSEST in meaning to ____.", options: ["consistent", "severe", "meticulous", "superfluous"] },
            { qNum: 25, type: 'mcq-standard', prompt: "25. What is the effect of poor sleep according to paragraph 2?", options: ["It increases hunger.", "It can cause heart disease.", "It improves immunity.", "It helps mental focus."] },
            { qNum: 26, type: 'mcq-standard', prompt: "26. The word “their” in paragraph 4 refers to ____.", options: ["people", "communities", "volunteers", "activities"] },
            { qNum: 27, type: 'mcq-standard', prompt: "27. The sentence “Engaging in community activities or volunteering can be simple yet powerful ways to stay socially connected” can best be replaced with...", options: ["Social connectedness is best achieved through personal solitude...", "Volunteering and community involvement tend to isolate individuals...", "Participating in local initiatives or offering one’s time through volunteering serves as an accessible yet impactful means of fostering social connection.", "Engaging in community service often distracts people..."] },
            { qNum: 28, type: 'mcq-standard', prompt: "28. Which of the following is TRUE according to the passage?", options: ["The influence of sleep on mental well-being is generally minimal.", "Breathing exercises are largely ineffective in alleviating stress.", "Social isolation has the potential to negatively impact one's physical health.", "Fitness applications tend to be exclusively utilised by individuals with professional training."] },
            { qNum: 29, type: 'mcq-standard', prompt: "29. In which paragraph does the writer mention emotional health through socializing?", options: ["Paragraph 3", "Paragraph 1", "Paragraph 4", "Paragraph 2"] },
            { qNum: 30, type: 'mcq-standard', prompt: "30. In which paragraph does the writer describe the use of modern tools to support health?", options: ["Paragraph 4", "Paragraph 3", "Paragraph 2", "Paragraph 1"] }
        ],
        answers: { 23: 'C', 24: 'B', 25: 'B', 26: 'A', 27: 'C', 28: 'C', 29: 'A', 30: 'A' }
    },
    {
        title: "Reading Comprehension II",
        id: "reading-comp-2",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and mark the letter A, B, C or D to indicate the best answer to each question.",
        readingText: "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain for a lack of sleep, but why is this? To start with, on average, teenagers need to sleep 8–10 hours, compared to adults' 7–9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in! [I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV] Luckily, there's a simple solution. Get more sleep and sleep better with a good evening routine...",
        questions: [
            { qNum: 31, type: 'mcq-standard', prompt: "31. The phrase 'complain for a lack of sleep' is closest in meaning to ____.", options: ["shout loudly about being sleepy", "cheer about a good night's sleep", "demand more sleeping hours", "grumble about sleepless nights"] },
            { qNum: 32, type: 'mcq-standard', prompt: "32. The word 'they' in paragraph 2 refers to ____.", options: ["adults", "sleepy people", "teenagers", "early risers"] },
            { qNum: 33, type: 'mcq-standard', prompt: "33. Which is NOT mentioned as a way to improve sleep quality?", options: ["Turning off electronic devices before sleeping", "Avoiding going to bed on a full stomach", "Doing homework right before going to bed", "Keeping a regular sleeping schedule"] },
            { qNum: 34, type: 'mcq-standard', prompt: "34. What is the main idea of paragraph 2?", options: ["Adolescents inherently exhibit a propensity for lethargy...", "Adolescents require a greater amount of sleep compared to adults and generally have a tendency to awaken later in the day.", "The sleep requirements of adults and adolescents are largely comparable.", "Adults invariably rise early..."] },
            { qNum: 35, type: 'mcq-standard', prompt: "35. Where in the passage does the sentence 'A lack of sleep can affect everything.' best fit?", options: ["[II]", "[III]", "[I]", "[IV]"] },
            { qNum: 36, type: 'mcq-standard', prompt: "36. The phrase 'catch up on' is OPPOSITE in meaning to ____.", options: ["make up for", "compensate for", "miss out on", "get back on track"] },
            { qNum: 37, type: 'mcq-standard', prompt: "37. Which of the following is TRUE?", options: ["Adolescents tend to perform more effectively with 6 to 7 hours of sleep...", "Insufficient sleep adversely impacts both the physical well-being and academic achievements of students.", "Consuming dinner immediately prior to bedtime is believed to aid in calming the digestive system.", "Engaging in reading on a tablet device before sleep is often suggested as a beneficial habit."] },
            { qNum: 38, type: 'mcq-standard', prompt: "38. Which best paraphrases 'Switch off your screens as the bright light from your smartphone or tablet can wake your body up.'?", options: ["Engaging with your smartphone... facilitates relaxation...", "The illumination emitted by digital screens can stimulate your physiological alertness, thereby impeding sleep initiation; hence, it is advisable to power down these devices before retiring.", "Exposure to the luminous displays... paradoxically induces heightened wakefulness...", "It is prudent to deactivate your mobile devices... to conserve battery life."] },
            { qNum: 39, type: 'mcq-standard', prompt: "39. What can be inferred from the passage?", options: ["Teenagers suffer more than adults from irregular sleeping patterns", "Most teenagers don’t need a bedtime routine to sleep well", "Teenagers’ sleep habits are mostly caused by poor parenting", "Teenagers perform well at school even with limited sleep"] },
            { qNum: 40, type: 'mcq-standard', prompt: "40. Which of the following best summarizes the passage?", options: ["Adequate nutrition and diligent studying can compensate for insufficient sleep.", "Adolescents may reduce their sleep duration provided they effectively incorporate relaxation techniques...", "Comprehending sleep cycles and maintaining consistent routines enables teenagers to enhance sleep quality and promote overall well-being.", "For academic success, teenagers must refrain from indulging in unrealistic aspirations."] }
        ],
        answers: { 31: 'D', 32: 'C', 33: 'C', 34: 'B', 35: 'D', 36: 'C', 37: 'B', 38: 'B', 39: 'A', 40: 'C' }
    }
];