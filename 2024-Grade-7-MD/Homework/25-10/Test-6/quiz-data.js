export const meta = {
    title: 'Mid-term Test 6 - Grade 7 (New 2026)'
};

export const assignmentId = 'g7-mid-term-2026-test-06-alt2'; // Added 'alt2' to ID

export const sections = [
    {
        title: "Phonetics",
        id: "phonetics",
        renderer: 'renderMcqTasks',
        instruction: "Choose the word A, B, C or D whose underlined part is pronounced differently from the others.",
        questions: [
            { qNum: 1, type: 'mcq-standard', prompt: "1.", options: ["need<u>ed</u>", "look<u>ed</u>", "help<u>ed</u>", "miss<u>ed</u>"] },
            { qNum: 2, type: 'mcq-standard', prompt: "2.", options: ["n<u>ear</u>", "d<u>ear</u>", "f<u>ear</u>", "p<u>ear</u>"] }
        ],
        answers: { 1: 'A', 2: 'D' }
    },
    {
        title: "Multiple Choice",
        id: "mcq",
        renderer: 'renderMcqTasks',
        instruction: "Choose the best option to complete each of the following sentences.",
        questions: [
            { qNum: 3, type: 'mcq-standard', prompt: "3. Carrots are a good source of ______, which is good for your eyes.", options: ["protein", "fat", "vitamin A", "sugar"] },
            { qNum: 4, type: 'mcq-standard', prompt: "4. My brother likes ______ because he can create new things from wood.", options: ["doing DIY", "playing chess", "gardening", "collecting stamps"] },
            { qNum: 5, type: 'mcq-standard', prompt: "5. My ears hurt because of the_________ from the construction site.", options: ["loud noise", "soft music", "quiet room", "fresh air"] },
            { qNum: 6, type: 'mcq-standard', prompt: "6. A balanced diet, ____________, and enough sleep are keys to a healthy lifestyle.", options: ["junk food", "regular exercise", "stress", "staying up late"] },
            { qNum: 7, type: 'mcq-standard', prompt: "7. The train _________ (leave) at 8 AM and _________ (arrive) at 10 AM.", options: ["leaves/ arrives", "leave/ arrive", "leaves/ arrive", "leave/ arrives"] },
            { qNum: 8, type: 'mcq-standard', prompt: "8. How often _________ he ________ (go) to the gym?", options: ["does/ go", "do/ go", "does/ goes", "do/ goes"] },
            { qNum: 9, type: 'mcq-standard', prompt: "9. My sister enjoys _________ to pop music in her room.", options: ["listening", "listen", "listens", "listened"] },
            { qNum: 10, type: 'mcq-standard', prompt: "10. She _________ her project last night.", options: ["was finished", "to finish", "finished", "finish"] }
        ],
        answers: { 3: 'C', 4: 'A', 5: 'A', 6: 'B', 7: 'A', 8: 'A', 9: 'A', 10: 'C' }
    },
    {
        title: "Error Correction",
        id: "error",
        renderer: 'renderMcqTasks',
        instruction: "Choose the letter A, B, C or D on your answer sheet to indicate the underlined part that needs correction.",
        questions: [
            { qNum: 11, type: 'mcq-underline', prompt: "11. <u>What</u> did you <u>ate</u> <u>for</u> breakfast <u>this morning</u>?", options: { A: "What", B: "ate", C: "for", D: "this morning" } },
            { qNum: 12, type: 'mcq-underline', prompt: "12. <u>He</u> is <u>interested</u> <u>in</u> <u>learn</u> a new language.", options: { A: "He", B: "interested", C: "in", D: "learn" } }
        ],
        answers: { 11: 'B', 12: 'D' }
    },
    {
        title: "Odd One Out",
        id: "odd-one-out",
        renderer: 'renderMcqTasks',
        instruction: "Choose the word that doesn't fit the group.",
        questions: [
            { qNum: 13, type: 'mcq-standard', prompt: "13.", options: ["swimming", "cooking", "beautiful", "reading"] },
            { qNum: 14, type: 'mcq-standard', prompt: "14.", options: ["enjoyable", "flooded", "plant", "local"] }
        ],
        answers: { 13: 'C', 14: 'C' }
    },
    {
        title: "Verb Forms (15-18)", // Renumbered section title
        id: "verb-forms",
        renderer: 'renderWritingTasks',
        instruction: `
            <p>Put the correct form of the verbs in the bracket.</p>
            <p class="font-bold text-red-600">⚠️ Important: For Question 15, type both answers in the single box, separated by a comma (e.g., word1,word2).</p>
        `,
        questions: [
            {
                qNum: 15, // Original question number
                type: 'fill-in-text', // Single line input
                prompt: "15. ______ your class ______ (collect) books for poor children last month? (Type both words separated by a comma)"
            },
            { qNum: 16, type: 'fill-in-text', prompt: "16. We usually ______ (have) fruit for breakfast." }, // Renumbered Q16 -> Q16
            { qNum: 17, type: 'fill-in-text', prompt: "17. Yesterday, I ______ (not/go) swimming because it rained." }, // Renumbered Q17 -> Q17
            { qNum: 18, type: 'fill-in-text', prompt: "18. He ______ (love) reading science books in his free time." } // Renumbered Q18 -> Q18
        ],
        answers: {
            15: "Did,collect", // Combined answer format
            16: "have",
            17: "didn't go",
            18: "loves"
        }
    },
    {
        title: "Ordering (19-20)", // Renumbered section title
        id: "ordering",
        renderer: 'renderMcqTasks',
        instruction: "Put the sentences in the correct order to make a logical conversation.",
        questions: [
            { qNum: 19, type: 'mcq-standard', prompt: "19. a. Yes, of course. Go straight and then turn left at the traffic lights.\n b. You’re welcome.\n c. Excuse me, can you help me?\n d. Thank you so much.\n e. Sure. How can I help you?\n f. I’m looking for the nearest post office.", options: ["c-e-f-a-d-b", "c-a-f-e-d-b", "a-c-e-f-d-b", "e-c-f-d-a-b"] }, // Renumbered Q19 -> Q19
            { qNum: 20, type: 'mcq-standard', prompt: "20. a. I’m sorry to hear that. You should go home and rest.\n b. You’re right. Thanks for the advice.\n c. Of course. Your health is the most important thing.\n d. What's wrong, Anna? You don't look well.\n e. Yes, but we have a meeting this afternoon.\n f. I have a really bad cold.", options: ["d-f-e-a-c-b", "f-d-e-a-c-b", "d-f-a-e-c-b", "d-a-f-c-e-b"] } // Renumbered Q20 -> Q20
        ],
        answers: { 19: 'A', 20: 'C' }
    },
    {
        title: "Signs & Notices (21-22)", // Renumbered section title
        id: "signs",
        renderer: 'renderMcqTasks',
        instruction: "Read the following sign or notice and choose the correct answer.",
        questions: [
            { qNum: 21, type: 'mcq-standard', prompt: "21. What does this sign mean?<br><img src='https://i.imgur.com/4rm261L.png' alt='No left turn sign' class='w-40 mx-auto my-4 rounded-md'>", options: ["You can go straight ahead", "You can go around", "You must not turn right", "You must not turn left"] }, // Renumbered Q21 -> Q21
            { qNum: 22, type: 'mcq-standard', prompt: "22. What does this notice mean?<br><img src='https://i.imgur.com/61w3Ybv.jpeg' alt='House for rent sign' class='w-40 mx-auto my-4 rounded-md'>", options: ["This is a horror place to live.", "You want to buy an apartment here.", "Come to this place if you want to buy a house.", "Come to this place if you’re looking for a place to live."] } // Renumbered Q22 -> Q22
        ],
        answers: { 21: 'D', 22: 'D' }
    },
    {
        title: "Cloze 1 (23-27)", // Renumbered section title
        id: "cloze-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read and complete each blank in the passage with the correct answer A, B, C or D.",
        readingText: `
            <p>Learning to play a musical instrument, like the guitar, is a rewarding hobby. It can develop (23)_____ patience and discipline. At first, it's hard to make your fingers press the right strings, and the sounds might not be perfect. But with practice, you can play your favorite (24)_____ . Many beginners (25)____ to take lessons from a teacher. A good teacher can show you the correct way to play the guitar and read music.</p><br></b>
            <p>As you get better, you can (26)_____ your skills by learning more complex songs. Remember that making mistakes is a normal part of learning. The important thing is to not give up (27)_____ you can play a full song beautifully.</p>
        `,
        questions: [
            { qNum: 23, type: 'mcq-standard', prompt: "23. Select the best option for blank (23).", options: ["you", "your", "yours", "yourself"] }, // Renumbered Q23 -> Q23
            { qNum: 24, type: 'mcq-standard', prompt: "24. Select the best option for blank (24).", options: ["songs", "song", "hobby", "hobbies"] }, // Renumbered Q24 -> Q24
            { qNum: 25, type: 'mcq-standard', prompt: "25. Select the best option for blank (25).", options: ["decide", "decides", "decided", "to decide"] }, // Renumbered Q25 -> Q25
            { qNum: 26, type: 'mcq-standard', prompt: "26. Select the best option for blank (26).", options: ["reduce", "challenge", "lose", "stop"] }, // Renumbered Q26 -> Q26
            { qNum: 27, type: 'mcq-standard', prompt: "27. Select the best option for blank (27).", options: ["because", "although", "so", "until"] } // Renumbered Q27 -> Q27
        ],
        answers: { 23: 'B', 24: 'A', 25: 'A', 26: 'B', 27: 'D' }
    },
    {
        title: "Reading (28-32)", // Renumbered section title
        id: "reading",
        renderer: 'renderReadingComprehension',
        instruction: "Read the following passage and choose the correct answer to each of the questions.",
        readingText: `
            <p>Community service is work that people do to help others without being paid. It's a way for people to give back to their community and make it a better place. Many students and adults participate in community service. Common activities include cleaning up parks, visiting the elderly in nursing homes, and collecting food for those in need.</p><br></b>
            <p>There are many reasons why people do community service. Some people enjoy the feeling of helping others. Others want to gain new skills or meet new people. For students, it can be a great way to learn about responsibility and teamwork. Volunteering can also help you understand the problems in your community and see how you can be a part of the solution. For instance, helping at an animal shelter can teach you about caring for animals, and tutoring younger students can improve your own understanding of a subject.</p><br></b>
            <p>Before the modern era, helping neighbors was a normal part of life. Today, with busy schedules, organized community service programs make it easier for people to get involved. Many schools and companies encourage their students and employees to volunteer. They know that when people help build a stronger community, everyone benefits.</p>
        `,
        questions: [
            { qNum: 28, type: 'mcq-standard', prompt: "28. According to the passage, what is community service?", options: ["Work that people do to earn money.", "Work people do to help others for free.", "A type of school assignment.", "A way to travel to new places."] }, // Renumbered Q28 -> Q28
            { qNum: 29, type: 'mcq-standard', prompt: "29. Which of the following is NOT mentioned as a community service activity?", options: ["Cleaning up parks.", "Playing video games.", "Visiting the elderly.", "Collecting food."] }, // Renumbered Q29 -> Q29
            { qNum: 30, type: 'mcq-standard', prompt: "30. What can students learn from community service?", options: ["How to make money.", "Only about their school subjects.", "Responsibility and teamwork.", "How to be a professional worker."] }, // Renumbered Q30 -> Q30
            { qNum: 31, type: 'mcq-standard', prompt: "31. The word “participate in” in paragraph 1 line 2 is closest in meaning to ___.", options: ["avoid", "watch", "start", "take part in"] }, // Renumbered Q31 -> Q31
            { qNum: 32, type: 'mcq-standard', prompt: "32. Which statement is NOT true?", options: ["Both students and adults can do community service.", "Volunteering can help you gain new skills.", "Only schools organize community service programs.", "Helping others makes the community a better place."] } // Renumbered Q32 -> Q32
        ],
        answers: { 28: 'B', 29: 'B', 30: 'C', 31: 'D', 32: 'C' }
    },
    {
        title: "Sentence Building (33-36)", // Renumbered section title
        id: "sentence-building",
        renderer: 'renderMcqTasks',
        instruction: "Choose the sentence that is best made from the given cues.",
        questions: [
            { qNum: 33, type: 'mcq-standard', prompt: "33. My sister/ watch/ cartoons/ every morning.", options: ["My sister watches cartoons every morning.", "My sister watch cartoons every morning.", "My sister watching cartoons every morning.", "My sister watched cartoons every morning."] }, // Renumbered Q33 -> Q33
            { qNum: 34, type: 'mcq-standard', prompt: "34. We/ donate/ books/ children in need/ last month.", options: ["We donates books for children in need last month.", "We donating books for children in need last month.", "We donate books for children in need last month.", "We donated books for children in need last month."] }, // Renumbered Q34 -> Q34
            { qNum: 35, type: 'mcq-standard', prompt: "35. Although/ the test/ be/ difficult/ she/ get/ high score.", options: ["Although the test is difficult, she gets a high score.", "Although the test was difficult, she got a high score.", "Although the test being difficult, she got a high score.", "Although the test was difficult, she getting a high score."] }, // Renumbered Q35 -> Q35
            { qNum: 36, type: 'mcq-standard', prompt: "36. Last year/ my class/ join/ a tree-planting project/ in the local park.", options: ["Last year my class joining a tree-planting project in the local park.", "Last year my class joins a tree-planting project in the local park.", "Last year my class joined a tree-planting project in the local park.", "Last year my class join a tree-planting project in the local park."] } // Renumbered Q36 -> Q36
        ],
        answers: { 33: 'A', 34: 'D', 35: 'B', 36: 'C' }
    },
    {
        title: "Sentence Writing (37-40)", // Renumbered section title
        id: "sentence-writing",
        renderer: 'renderWritingTasks',
        instruction: "Rewrite the following sentences as instructed.",
        questions: [
            { qNum: 37, type: 'fill-in-text', prompt: "37. Rewrite using the given word: There are a lot of tall buildings and modern houses in my hometown now. (has)" }, // Renumbered Q37 -> Q37
            { qNum: 38, type: 'fill-in-text', prompt: "38. Rewrite using the given word: Nam enjoys playing football with his friends after finishing his homework. (interested in)" }, // Renumbered Q38 -> Q38
            { qNum: 39, type: 'fill-in-text', prompt: "39. Combine the sentences using (and): You should eat a balanced diet. You should do exercise regularly." }, // Renumbered Q39 -> Q39
            { qNum: 40, type: 'fill-in-text', prompt: "40. Rewrite using the given word: Staying up late is bad for you. (should)" } // Renumbered Q40 -> Q40
        ],
        answers: { 37: "My hometown has a lot of tall buildings and modern houses now.", 38: "Nam is interested in playing football with his friends after finishing his homework.", 39: "You should eat a balanced diet and do exercise regularly.", 40: "You should not stay up late." }
    }
];