export const meta = {
    title: 'Mid-term Test 1 - Grade 7 (Form 2025)'
};

export const assignmentId = 'g7-mid-term-2025-test-01';

export const sections = [
    {
        title: "Phonetics",
        id: "phonetics",
        renderer: 'renderMcqTasks',
        instruction: "Select the best option for each question.",
        questions: [
            { qNum: 1, type: 'mcq-standard', prompt: "1. Choose the word whose underlined part is pronounced differently.", options: ["enjoyed", "called", "laughed", "watered"] },
            { qNum: 2, type: 'mcq-standard', prompt: "2. Choose the word whose underlined part is pronounced differently.", options: ["wash", "wear", "wake", "wrap"] },
            { qNum: 3, type: 'mcq-standard', prompt: "3. Choose the word that has a different stress pattern.", options: ["ensure", "collect", "upload", "harvest"] },
            { qNum: 4, type: 'mcq-standard', prompt: "4. Choose the word that has a different stress pattern.", options: ["relation", "cultural", "basketball", "countryside"] }
        ],
        answers: { 1: 'C', 2: 'D', 3: 'D', 4: 'A' }
    },
    {
        title: "Multiple Choice",
        id: "mcq",
        renderer: 'renderMcqTasks',
        instruction: "Mark the letter A, B, C or D to indicate the correct answer to each question.",
        questions: [
            { qNum: 5, type: 'mcq-standard', prompt: "5. He took up ____ because he had suitable skills and talent.", options: ["draw", "drawing", "drew", "to draw"] },
            { qNum: 6, type: 'mcq-standard', prompt: "6. When did you start ____ postcards?", options: ["playing", "cooking", "collecting", "listening"] },
            { qNum: 7, type: 'mcq-standard', prompt: "7. The Japanese eat ____, so they have high life expectancy.", options: ["good", "healthily", "little rice", "unhealthy"] },
            { qNum: 8, type: 'mcq-standard', prompt: "8. When my family went on holiday, we ____ a lot of photos.", options: ["took", "saw", "buy", "do"] },
            { qNum: 9, type: 'mcq-standard', prompt: "9. A: ‘I think model making is an expensive hobby.’ B: ‘____. It’s incredibly cheap.’", options: ["You’re right", "No matter", "Certainly", "Not at all"] },
            { qNum: 10, type: 'mcq-standard', prompt: "10. My aunt often ____ money to charitable organizations to help street children and the homeless.", options: ["makes", "does", "donates", "send"] },
            { qNum: 11, type: 'mcq-standard', prompt: "11. My uncle is a ____. He doesn’t eat meat or fish.", options: ["monks", "librarian", "vegetarian", "balanced diet"] },
            { qNum: 12, type: 'mcq-standard', prompt: "12. Please wake me ____ at 5 and we will leave at 6 in the morning.", options: ["up", "on", "over", "in"] }
        ],
        answers: { 5: 'B', 6: 'C', 7: 'B', 8: 'A', 9: 'D', 10: 'C', 11: 'C', 12: 'A' }
    },
    {
        title: "Cloze 1 (13-16)",
        id: "cloze-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the announcement and select the correct option for each blank.",
        readingText: `
            <h4 class="font-bold text-lg text-slate-700 text-center">Healthy Snack Week – Try Something New!</h4>
            <p class="text-center">Say goodbye (13)____ chips and soda!</p>
            <p class="text-center">Join us in (14)____ canteen for Healthy Snack Week starting Monday.</p>
            <p class="font-semibold">Options include:</p>
            <ul class="list-disc list-inside">
                <li>Fresh fruit cups</li>
                <li>Whole grain sandwiches</li>
                <li>Smoothies & (15)____ juices</li>
            </ul>
            <p class="text-center mt-2">Vote for your favorite snack of the week! Let’s eat better and (16)____ better together!</p>
        `,
        questions: [
            { qNum: 13, type: 'mcq-standard', prompt: "13. Select the best option for blank (13).", options: ["for", "to", "in", "off"] },
            { qNum: 14, type: 'mcq-standard', prompt: "14. Select the best option for blank (14).", options: ["an", "a", "the", "no article"] },
            { qNum: 15, type: 'mcq-standard', prompt: "15. Select the best option for blank (15).", options: ["naturally", "unnature", "nature", "natural"] },
            { qNum: 16, type: 'mcq-standard', prompt: "16. Select the best option for blank (16).", options: ["take", "feel", "taste", "smell"] }
        ],
        answers: { 13: 'B', 14: 'C', 15: 'D', 16: 'B' }
    },
    {
        title: "Logical Order",
        id: "ordering",
        renderer: 'renderMcqTasks',
        instruction: `
            <div class="p-4 bg-slate-50 rounded-lg mb-6 prose max-w-none">
                <p><strong>Context:</strong> Trying something new can be both scary and exciting.</p>
                <p><strong>Sentences to order:</strong></p>
                <p>a. I signed up for a public speaking course.</p>
                <p>b. At first, I was nervous to speak in front of others.</p>
                <p>c. After a few weeks, I spoke confidently to the whole class.</p>
            </div>
        `,
        questions: [
            { qNum: 17, type: 'mcq-standard', prompt: "17. Put the sentences (a-c) in the correct order to make a logical text.", options: ["a-b-c", "a-c-b", "c-b-a", "b-c-a"] },
            { qNum: 18, type: 'mcq-standard', prompt: "18. Choose the sentence that most appropriately ends the text.", options: ["I don’t think I learned anything from the course.", "I still avoid speaking because it makes me nervous and stressed.", "It’s amazing how much progress I made through this hobby.", "Nothing about speaking in public interests me and my friends."] }
        ],
        answers: { 17: 'A', 18: 'C' }
    },
    {
        title: "Cloze 2 (19-24)",
        id: "cloze-2",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and select the correct option for each blank.",
        readingText: `
            <p>Many people enjoy hobbies like painting, playing music, or writing stories. These activities are fun, (19)____ they also serve a bigger purpose. According to a British Council article, true joy comes (20)____ doing things that give us both pleasure and meaning. For example, if you love music, you can play for others or join a group. If you enjoy (21)____, you might share your thoughts online to inspire people. Hobbies like these relax your mind and help you grow.</p>
            <p>Some hobbies improve health, (22)____ stress, or build skills like patience, teamwork, and memory. People who read often develop (23)____, while those who play sports build strength and discipline. Even small hobbies like collecting stamps or solving puzzles can teach attention to detail.</p>
            <p>What matters is not how popular the hobby is, but how it (24)____. A hobby that connects with your interests, values, or goals is likely to bring more lasting happiness than one you do just to pass time. Over time, meaningful hobbies can even lead to new friendships or future careers.</p>
        `,
        questions: [
            { qNum: 19, type: 'mcq-standard', prompt: "19. Select the best option for blank (19).", options: ["however", "but", "though", "despite"] },
            { qNum: 20, type: 'mcq-standard', prompt: "20. Select the best option for blank (20).", options: ["from", "in", "at", "on"] },
            { qNum: 21, type: 'mcq-standard', prompt: "21. Select the best option for blank (21).", options: ["to write", "write", "to writing", "writing"] },
            { qNum: 22, type: 'mcq-standard', prompt: "22. Select the best option for blank (22).", options: ["reduce", "increase", "improve", "raise"] },
            { qNum: 23, type: 'mcq-standard', prompt: "23. Select the best option for blank (23).", options: ["less focus", "worse focus", "better focus", "least focus"] },
            { qNum: 24, type: 'mcq-standard', prompt: "24. Select the best option for blank (24).", options: ["makes you felt", "makes you feel", "make you feel", "make you fell"] }
        ],
        answers: { 19: 'B', 20: 'A', 21: 'D', 22: 'A', 23: 'C', 24: 'B' }
    },
    {
        title: "Writing",
        id: "writing",
        renderer: 'renderMcqTasks',
        instruction: "Choose the best option for each question.",
        questions: [
            { qNum: 25, type: 'mcq-standard', prompt: "25. Choose the sentence closest in meaning: Anna likes doing creative things in her free time. She likes drawing more than dancing.", options: ["Anna prefers dancing to drawing.", "Anna prefers drawing to dancing.", "Anna doesn’t like drawing or dancing.", "Anna likes dancing more than drawing."] },
            { qNum: 26, type: 'mcq-standard', prompt: "26. Choose the sentence closest in meaning: July stayed home from school yesterday because she had a high fever.", options: ["July had a high fever, so she stayed home from school yesterday.", "July had a high fever, but she will stay home from school tomorrow.", "July had a high fever, or she stayed home from school every day.", "July had a high fever, and she went to school yesterday."] },
            { qNum: 27, type: 'mcq-standard', prompt: "27. Build a sentence from the cues: She/ start/ the hobby/ when/ she/ 6.", options: ["She started the hobby when she is 6.", "She starts the hobby when she will be 6.", "She started the hobby when she was 6.", "She starts the hobby when she 6."] },
            { qNum: 28, type: 'mcq-standard', prompt: "28. Build a sentence from the cues: We / need / calories / or / energy / do / things / every day.", options: ["We need calories or energy do things everyday.", "We need calories or energy doing things everyday.", "We needs calories or energy do things everyday.", "We need calories or energy to do things everyday."] }
        ],
        answers: { 25: 'A', 26: 'A', 27: 'C', 28: 'D' }
    },
  {
    title: "Signs & Notices",
    id: "signs",
    renderer: 'renderMcqTasks',
    instruction: "Read the sign or notice and choose the correct answer.",
    questions: [
        { 
            qNum: 29, 
            type: 'mcq-standard', 
            prompt: `29. What does this sign mean?<br><img src='https://i.imgur.com/3oHuQuC.jpeg' alt='A sign that says PLEASE TAKE OFF YOUR SHOES' class='w-40 mx-auto my-4 rounded-md'>`, 
            options: ["People don’t sell shoes in this place", "Please remove your shoes when you enter this place", "You can find shoes when you are in this place.", "Don’t buy shoes when you enter this place."] 
        },
        { 
            qNum: 30, 
            type: 'mcq-standard', 
            prompt: `30. What does this notice mean?<br><img src='https://i.imgur.com/aq0QIBU.png' alt='A notice that says SUPER-SALE 50% OFF ONLY TODAY' class='w-40 mx-auto my-4 rounded-md'>`, 
            options: ["You can buy clothes at a cheaper price today.", "All of their clothes are always cheaper.", "They only sell clothes today.", "You can only go shopping today."] 
        }
    ],
    answers: { 29: 'B', 30: 'A' }
},
    {
        title: "Reading 1 (31-36)",
        id: "reading-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and choose the correct answer for each question.",
        readingText: "Many teenagers snack between meals, often without thinking much about it. Chips, cookies, and sugary drinks are easy to grab and taste good, but eating them every day can lead to low energy, mood swings, and even health problems later. Making smarter choices during snack time is a simple way to take better care of your body. Swapping soda for water or fruit juice and choosing nuts, yogurt, or fresh fruit instead of candy can make a real difference. These snacks give you long-lasting energy and help you stay focused in class or during homework. In fact, nutrition experts say balanced snacking helps your brain work better and keeps your blood sugar steady. It’s not about cutting out all fun foods, but about being aware of what you eat and how often. Some schools are even adding “healthy vending machines” with better options like whole grain bars and dried fruit. Students say they feel more energetic and less sleepy in the afternoon when they eat well. Healthy living isn’t only about meals—it includes the little things you eat on the go. The more you understand your choices, the easier it becomes to stay strong, active, and ready for whatever the day brings. Eating wisely can also support better sleep, fewer cravings, and a more positive mood overall. Over time, these small decisions can build healthier habits that last into adulthood.",
        questions: [
            { qNum: 31, type: 'mcq-standard', prompt: "31. What is the main purpose of the text?", options: ["To explain how teenagers skip meals at school", "To suggest removing all snacks from diets", "To encourage better snack choices for health", "To describe how vending machines are used"] },
            { qNum: 32, type: 'mcq-standard', prompt: "32. What happens if teens eat chips and soda too often?", options: ["They feel full and active all day", "They sleep better at night", "They may feel tired and have mood swings", "They become stronger after school"] },
            { qNum: 33, type: 'mcq-standard', prompt: "33. What does the passage suggest is a better snack choice?", options: ["Chocolate and fizzy drinks", "Ice cream and cookies", "Yogurt and fresh fruit", "Fried noodles and bubble tea"] },
            { qNum: 34, type: 'mcq-standard', prompt: "34. (Question based on a missing paragraph in the source) Which is a general benefit of healthy habits mentioned in the text?", options: ["Better sleep and fewer cravings", "Sleeping less but feeling more active", "Mental health can be ignored if you exercise", "Avoiding friends is good for your well-being"] },
            { qNum: 35, type: 'mcq-standard', prompt: "35. What is the OPPOSITE of “simple” as used in the passage?", options: ["complicated", "healthy", "stressed", "peaceful"] },
            { qNum: 36, type: 'mcq-standard', prompt: "36. What is the CLOSEST meaning of “focused” as used in the passage?", options: ["tired", "attentive", "confused", "worried"] }
        ],
        answers: { 31: 'C', 32: 'C', 33: 'C', 34: 'B', 35: 'A', 36: 'B' }
    },
    {
        title: "Cloze 3 (37-40)",
        id: "cloze-3",
        renderer: 'renderReadingComprehension',
        instruction: "Read the text and select the correct option for each blank.",
        readingText: `
            <p>Many people enjoy reading books, but (37)____. In big cities, some young people now go to public parks to read in their free time. They sit on benches, bring a drink, and enjoy the fresh air while reading. Reading in the park helps people feel calm. (38)____ make the experience relaxing. It is also a cheap and easy activity. You don’t need expensive equipment—just a good book.</p>
            <p>Some parks even have free libraries. People can take a book, read it, and return it later. This idea helps more people enjoy reading, even if they don’t have money to buy books. Teenagers like reading in groups. (39)____ and then talk about it. It helps them think deeply and share their ideas. Some also write short reviews or post photos on social media.</p>
            <p>Reading outside is becoming a fun trend. It combines (40)____, and it’s a great way to spend your free time.</p>
        `,
        questions: [
            { qNum: 37, type: 'mcq-standard', prompt: "37. Select the best option for blank (37).", options: ["The sounds of birds and trees", "learning with enjoying nature", "They read the same book", "not everyone wants to read at home"] },
            { qNum: 38, type: 'mcq-standard', prompt: "38. Select the best option for blank (38).", options: ["The sounds of birds and trees", "learning with enjoying nature", "They read the same book", "not everyone wants to read at home"] },
            { qNum: 39, type: 'mcq-standard', prompt: "39. Select the best option for blank (39).", options: ["The sounds of birds and trees", "learning with enjoying nature", "They read the same book", "not everyone wants to read at home"] },
            { qNum: 40, type: 'mcq-standard', prompt: "40. Select the best option for blank (40).", options: ["The sounds of birds and trees", "learning with enjoying nature", "They read the same book", "not everyone wants to read at home"] }
        ],
        answers: { 37: 'D', 38: 'A', 39: 'C', 40: 'B' }
    }
];