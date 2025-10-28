export const meta = {
    title: 'Mid-term Test - Grade 9 Global Success'
};

export const assignmentId = 'g9-mid-term-2026-global-success';

export const sections = [
    {
        title: "Pronunciation & Stress",
        id: "phonetics",
        renderer: 'renderMcqTasks',
        instruction: "Select the best option for each question.",
        questions: [
            { qNum: 1, type: 'mcq-standard', prompt: "1. Choose the word whose underlined part is pronounced differently.", options: ["Singapore", "foreign", "importance", "information"] },
            { qNum: 2, type: 'mcq-standard', prompt: "2. Choose the word whose underlined part is pronounced differently.", options: ["phrases", "mistakes", "chances", "languages"] },
            { qNum: 3, type: 'mcq-standard', prompt: "3. Choose the word that has a different stress pattern.", options: ["cottage", "support", "housewife", "marriage"] },
            { qNum: 4, type: 'mcq-standard', prompt: "4. Choose the word that has a different stress pattern.", options: ["double", "worldwide", "figure", "foreign"] }
        ],
        answers: { 1: 'B', 2: 'A', 3: 'B', 4: 'B' }
    },
    {
        title: "Multiple Choice",
        id: "mcq",
        renderer: 'renderMcqTasks',
        instruction: "Mark the letter A, B, C or D on your answer sheet to indicate the correct answer to each of the following questions.",
        questions: [
            { qNum: 5, type: 'mcq-standard', prompt: "5. Visiting this local craft market ____ me of the beautiful vases I saw at Bat Trang pottery village.", options: ["misses", "reminds", "remembers", "reviews"] },
            { qNum: 6, type: 'mcq-standard', prompt: "6. Last year, the researchers ____ a survey to find out how eating habits affect the health of teenagers.", options: ["cut down", "looked round", "worked out", "carried out"] },
            { qNum: 7, type: 'mcq-standard', prompt: "7. If you ____ public transportation, you can reduce traffic congestion in the city.", options: ["will use", "are used", "using", "use"] },
            { qNum: 8, type: 'mcq-standard', prompt: "8. Nam: “Can I help you with your project?” Nick: “That would be great, ____”", options: ["I beg your pardon", "you’re too helpful", "it’s not necessary", "I appreciate it"] },
            { qNum: 9, type: 'mcq-standard', prompt: "9. In the past, people ____ usually be home for family meals.", options: ["have to", "may", "would", "will"] },
            { qNum: 10, type: 'mcq-standard', prompt: "10. I ____ going to the temple with my mom on her tuk-tuk.", options: ["used to loving", "used to love", "be used to love", "get use to loving"] },
            { qNum: 11, type: 'mcq-standard', prompt: "11. After working hard from the beginning of the school year, Ms. Giang ____ her goal of achieving the highest score on the mid-term test.", options: ["balanced", "intended", "accomplished", "solved"] },
            { qNum: 12, type: 'mcq-standard', prompt: "12. You’d better look after your ____ by taking time to relax and do things you enjoy.", options: ["physical health", "mental health", "healthy diet", "well-balanced diet"] }
        ],
        answers: { 5: 'B', 6: 'D', 7: 'D', 8: 'D', 9: 'C', 10: 'B', 11: 'C', 12: 'B' }
    },
    {
        title: "Cloze 1 (13-16)",
        id: "cloze-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the announcement and select the correct option for each blank.",
        readingText: `
            <h4 class="font-bold text-lg text-slate-700 text-center">HEALTHY LIVING TIPS FOR TEENAGERS</h4>
            <ul class="list-disc list-inside mt-4">
                <li>Eat (13)____ balanced diet with plenty of fruits and vegetables.</li>
                <li>Drink plenty of water and get enough sleep.</li>
                <li>Exercise regularly (14)____ fit.</li>
                <li>Limit screen time to 2 hours a day.</li>
                <li>Manage your time and give (15)____ to important activities.</li>
                <li>Talk to a counsellor, friends, or parents if you feel (16)____ out.</li>
            </ul>
        `,
        questions: [
            { qNum: 13, type: 'mcq-standard', prompt: "13. Select the best option for blank (13).", options: ["an", "a", "x (no article)", "the"] },
            { qNum: 14, type: 'mcq-standard', prompt: "14. Select the best option for blank (14).", options: ["to keep", "kept", "keep", "keeping"] },
            { qNum: 15, type: 'mcq-standard', prompt: "15. Select the best option for blank (15).", options: ["balance", "due date", "priority", "assignment"] },
            { qNum: 16, type: 'mcq-standard', prompt: "16. Select the best option for blank (16).", options: ["stressed", "stress", "stressful", "stressfully"] }
        ],
        answers: { 13: 'C', 14: 'A', 15: 'A', 16: 'A' }
    },
    {
        title: "Logical Order",
        id: "logic",
        renderer: 'renderMcqTasks',
        instruction: `
            <div class="p-4 bg-slate-50 rounded-lg mb-6 prose max-w-none">
                <p><strong>Read the sentences that form a story:</strong></p>
                <p>a. One weekend, my family and I went to the park for a picnic.</p>
                <p>b. We were excited, but things didn’t go as planned.</p>
                <p>c. The park was crowded, and there were no tables available.</p>
                <p>d. We went around and found a small place under a tree, but mosquitoes made it hard to enjoy our meal.</p>
                <p>e. Then, the weather became hot, and we realized we had forgotten to bring water.</p>
                <p>f. Feeling uncomfortable, we decided to leave early.</p>
            </div>
        `,
        questions: [
            { qNum: 17, type: 'mcq-standard', prompt: "17. Choose the option that shows the most logical order of the events.One weekend, my family and I went to the park for a picnic. We were excited, but things didn’t go as planned. ______. Feeling uncomfortable, we decided to leave early.<br></br> a. Then, the weather became hot, and we realized we had forgotten to bring water.<br></br> b. We went around and found a small place under a tree, but mosquitoes made it hard to enjoy our meal.<br></br> c. The park was crowded, and there were no tables available. ", options: ["a-b-c-d-e-f", "a-c-d-e-b-f", "a-b-e-d-c-f", "a-d-c-b-e-f"] },
            { qNum: 18, type: 'mcq-standard', prompt: "18. Choose the best concluding sentence for the story.", options: ["It wasn’t a fun picnic, but we have learned to plan better next time.", "The weather was perfect, and we didn’t have any more problems.", "Everyone had a great time, and we can’t wait to do it again.", "The park was very far from our house, so we were tired when we arrived."] }
        ],
        answers: { 17: 'C', 18: 'A' }
    },
    {
        title: "Cloze 2 (19-24)",
        id: "cloze-2",
        renderer: 'renderReadingComprehension',
        instruction: "Read the text and select the correct option for each blank.",
        readingText: `
            <p>While many people enjoy the excitement of city life, cities are not attractive to everyone. One common reason is the high (19)____. In many cities, rent, food, and transportation are expensive. For some people, it is difficult to afford a good quality of life in cities.</p>
            <p>Pollution is also a big problem in many cities. Air pollution (20)____ cars and factories can make the air (21)____. Some people worry about their health and choose to live in places with cleaner air.</p>
            <p>In addition, cities are often very crowded. Many people feel uncomfortable and even annoyed because of the large population. They (22)____ not like the busy streets, crowded public transportation, or long lines in stores.</p>
            <p>Lastly, people may miss nature in cities. (23)____ like parks are sometimes hard to find. Those who enjoy nature and outdoor activities might prefer to live in the countryside, (24)____ they can be closer to trees, rivers, and fresh air. For these reasons, cities may not be the best choice for everyone.</p>
        `,
        questions: [
            { qNum: 19, type: 'mcq-standard', prompt: "19. Select the best option for blank (19).", options: ["quality of life", "cost of living", "living conditions", "city life"] },
            { qNum: 20, type: 'mcq-standard', prompt: "20. Select the best option for blank (20).", options: ["from", "through", "in", "by"] },
            { qNum: 21, type: 'mcq-standard', prompt: "21. Select the best option for blank (21).", options: ["polluting", "pollution", "polluted", "pollute"] },
            { qNum: 22, type: 'mcq-standard', prompt: "22. Select the best option for blank (22).", options: ["must", "need", "should", "may"] },
            { qNum: 23, type: 'mcq-standard', prompt: "23. Select the best option for blank (23).", options: ["Green spaces", "Concrete jungles", "High buildings", "Public systems"] },
            { qNum: 24, type: 'mcq-standard', prompt: "24. Select the best option for blank (24).", options: ["whose", "that", "where", "which"] }
        ],
        answers: { 19: 'B', 20: 'A', 21: 'C', 22: 'D', 23: 'A', 24: 'C' }
    },
    {
        title: "Writing",
        id: "writing",
        renderer: 'renderMcqTasks',
        instruction: "Choose the best option for each sentence.",
        questions: [
            { qNum: 25, type: 'mcq-standard', prompt: "25. Choose the sentence closest in meaning: You should take the subway during rush hour, or you may be late for work.", options: ["If you don’t take the subway, you may be late for work.", "Unless you take the subway, you may not be late for work.", "You may be late for work even though you take the subway.", "You may take the subway if you are not late for work."] },
            { qNum: 26, type: 'mcq-standard', prompt: "26. Choose the sentence closest in meaning: They last visited their home village five years ago.", options: ["They haven’t visited their home village for five years.", "They didn’t visit their home village since five years.", "They haven’t visited their home village five years ago.", "They visited their home village for five years."] },
            { qNum: 27, type: 'mcq-standard', prompt: "27. Build a sentence from the cues: people/ prefer/ handmade products,/ valuable/ traditional craft villages/ become.", options: ["More people prefer handmade products, the more valuable traditional craft villages become.", "More people prefer handmade products, more valuable traditional craft villages become.", "The more people prefer handmade products, the valuable traditional craft villages become.", "The more people prefer handmade products, the more valuable traditional craft villages become."] },
            { qNum: 28, type: 'mcq-standard', prompt: "28. Build a sentence from the cues: Students / want / go aboard / education / have to / learn / English well.", options: ["Students who want to go aboard for education will have to be learn English well.", "Students who want to go aboard for education will have to being learn English well.", "Students who want to go aboard for education will have be learn English well.", "Students who want to go aboard for education will have to learn English well."] }
        ],
        answers: { 25: 'A', 26: 'A', 27: 'D', 28: 'D' }
    },
    {
        title: "Signs & Notices",
        id: "signs",
        renderer: 'renderMcqTasks',
        instruction: "Read the sign or notice and choose the correct answer.",
        questions: [
            { qNum: 29, type: 'mcq-standard', prompt: "29. What does the sign, a diamond shape with the text 'BE PREPARED TO STOP', mean?", options: ["You must stop immediately.", "You should be ready to stop soon.", "You must not stop in this area.", "You should wait until everyone stops."] },
            { qNum: 30, type: 'mcq-standard', prompt: "30. The message about a Museum Trip states: 'Students who have not booked this trip need to maintain their attendance before and after the trip.' What does this mean?", options: ["Students who do not want to join the trip can stay home.", "Students must come to school before going on the trip.", "Students can decide to join the trip after today.", "Students must take class if they don’t take part in the trip."] }
        ],
        answers: { 29: 'B', 30: 'B' }
    },
    {
        title: "Reading 1 (31-36)",
        id: "reading-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and choose the correct answer for each question.",
        readingText: `
            <p>According to historical records, tea, associated with Buddhism, was and originated in pagodas and temples. It was called “Tea Meditation”. This form of tea then quickly became popular in the Vietnamese royal court. In the past, that sophisticated tea was enjoyed by the king and nobles.</p>
            <p>Differently, people at normal class simply picked green leaves from tea trees, washed them, softly rumpled, boiled and enjoyed it. In the course of contacts with the Chinese and European industrial approach for many years, Vietnamese people also learned, practiced and created prerequisites for the development of Vietnam’s own tea industry.</p>
            <p>Traditionally, drinking Vietnamese tea is considered a daily habit of the old people in households and in society in general. In the morning, people start a new day with some cups of tea to wake their power. Patio or garden in the backyard is among the most favorite places for tea appreciating for its closeness to nature, as some fresh air can give extra flavor to the tea. Consuming tea after meals is also a habit that is loved by many people, when all family members can gather and talk about what they have done during the day.</p>
            <p>Tradition is out and modern is in, however, generation after generation, tea is not only part of Vietnamese everyday life, but also an essential part of the nation’s history and economy.</p>
        `,
        questions: [
            { qNum: 31, type: 'mcq-standard', prompt: "31. What did normal-class people do to make tea?", options: ["Used special royal tools and scented flowers like the nobles", "Only drank tea in the morning with family, without making it at home", "Picked green leaves, washed them, softly crushed, boiled, and drank", "Bought tea from factories and drank it cold without boiling"] },
            { qNum: 32, type: 'mcq-standard', prompt: "32. The word “essential” in paragraph 4 is CLOSEST in meaning to:", options: ["traditional", "economical", "modern", "vital"] },
            { qNum: 33, type: 'mcq-standard', prompt: "33. The word “nobles” in paragraph 2 is OPPOSITE in meaning to:", options: ["monks", "common people", "royal court", "foreigners"] },
            { qNum: 34, type: 'mcq-standard', prompt: "34. What is the main idea of this passage?", options: ["Detailed rules of the royal court tea ceremony.", "The origins, practice, and continuing role of Vietnamese tea.", "Proper places to drink tea and discuss about daily life.", "The spread of European industrial methods for tea production."] },
            { qNum: 35, type: 'mcq-standard', prompt: "35. According to the passage, where did the Vietnamese tea tradition first take shape?", options: ["Royal court halls", "Pagodas and temples", "Backyard gardens", "European factories"] },
            { qNum: 36, type: 'mcq-standard', prompt: "36. Which statement is NOT true according to the text?", options: ["Vietnamese tea is now only a religious practice kept inside temples.", "Patios or backyard gardens are favorite places to enjoy tea because of the fresh air.", "Many families drink tea after meals and talk about their day.", "Contact with Chinese and European methods affects Vietnam’s tea industry."] }
        ],
        answers: { 31: 'C', 32: 'D', 33: 'B', 34: 'B', 35: 'B', 36: 'A' }
    },
    {
        title: "Cloze 3 (37-40)",
        id: "cloze-3",
        renderer: 'renderReadingComprehension',
        instruction: "Read the text and select the correct option for each blank.",
        readingText: `
            <p>The world is home to many amazing cities, each with its own special character. Some cities are known for their beauty, (37)____. One city that stands out is Tokyo, the capital of Japan. Tokyo is known for its mix of modern technology and traditional culture. It is also very clean and safe, making it a great place to live.</p>
            <p>Another city that is often praised is Amsterdam in the Netherlands. Amsterdam is famous for its beautiful canals, bike-friendly streets, and rich history. It is also (38)____.</p>
            <p>Singapore is another city that many people admire. Located in Southeast Asia, Singapore is known for its strict laws, clean streets, and excellent public transportation, (39)____.</p>
            <p>Lastly, New York City, in the United States, is one of the most exciting cities in the world. With (40)____, New York is a top destination for tourists. However, it is also a fast-paced city with many job opportunities. These cities offer a mix of culture, safety, and opportunities that make them great places to live or visit.</p>
        `,
        questions: [
            { qNum: 37, type: 'mcq-standard', prompt: "37. Select the best option for blank (37).", options: ["one of the most environmentally friendly cities in the world", "while others are famous for the quality of life they offer.", "its world-class museums, restaurants, and shopping malls.", "It is also a great place for business and education."] },
            { qNum: 38, type: 'mcq-standard', prompt: "38. Select the best option for blank (38).", options: ["It is also a great place for business and education.", "while others are famous for the quality of life they offer.", "one of the most environmentally friendly cities in the world", "its world-class museums, restaurants, and shopping malls."] },
            { qNum: 39, type: 'mcq-standard', prompt: "39. Select the best option for blank (39).", options: ["while others are famous for the quality of life they offer.", "one of the most environmentally friendly cities in the world", "its world-class museums, restaurants, and shopping malls.", "It is also a great place for business and education."] },
            { qNum: 40, type: 'mcq-standard', prompt: "40. Select the best option for blank (40).", options: ["It is also a great place for business and education.", "one of the most environmentally friendly cities in the world", "its world-class museums, restaurants, and shopping malls.", "while others are famous for the quality of life they offer."] }
        ],
        answers: { 37: 'B', 38: 'C', 39: 'D', 40: 'C' }
    }
];