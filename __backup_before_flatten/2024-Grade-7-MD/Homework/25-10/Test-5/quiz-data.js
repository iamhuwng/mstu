export const meta = {
    title: 'Mid-term Test 5 - Grade 7 (New 2026)'
};

export const assignmentId = 'g7-mid-term-2026-test-05';

export const sections = [
    {
        title: "Phonetics",
        id: "phonetics",
        renderer: 'renderMcqTasks',
        instruction: "Choose the word A, B, C or D whose underlined part is pronounced differently from the others.",
        questions: [
            { qNum: 1, type: 'mcq-standard', prompt: "1.", options: ["earn<u>ed</u>", "expect<u>ed</u>", "enjoy<u>ed</u>", "enter<u>ed</u>"] },
            { qNum: 2, type: 'mcq-standard', prompt: "2.", options: ["acti<u>vi</u>ty", "break<u>f</u>ast", "a<u>ff</u>ect", "<u>f</u>ood"] }
        ],
        answers: { 1: 'B', 2: 'A' }
    },
    {
        title: "Multiple Choice",
        id: "mcq",
        renderer: 'renderMcqTasks',
        instruction: "Choose the best option to complete each of the following sentences.",
        questions: [
            { qNum: 3, type: 'mcq-standard', prompt: "3. Drinking too much coffee can make you feel ______.", options: ["sleepy", "boring", "calm", "tired"] },
            { qNum: 4, type: 'mcq-standard', prompt: "4. You should wear a ______ to protect your head when you ride a bike.", options: ["helmet", "scarf", "glove", "sock"] },
            { qNum: 5, type: 'mcq-standard', prompt: "5. My sister enjoys ______ photos of her friends and family.", options: ["taking", "take", "takes", "to take"] },
            { qNum: 6, type: 'mcq-standard', prompt: "6. Students often join a ______ to improve their English.", options: ["sports club", "music club", "drama club", "speaking club"] },
            { qNum: 7, type: 'mcq-standard', prompt: "7. Alex is fond of _______ chess in his free time.", options: ["playing", "to play", "plays", "played"] },
            { qNum: 8, type: 'mcq-standard', prompt: "8. We_______ a new movie at the cinema last night.", options: ["watch", "watches", "watched", "to watch"] },
            { qNum: 9, type: 'mcq-standard', prompt: "9. She_______ her grandparents every weekend.", options: ["visit", "visits", "has visited", "to visit"] },
            { qNum: 10, type: 'mcq-standard', prompt: "10. What_____ she_____ for dinner yesterday?", options: ["did/ cook", "did/ cooked", "do/ cook", "does/ cooked"] }
        ],
        answers: { 3: 'D', 4: 'A', 5: 'A', 6: 'D', 7: 'A', 8: 'C', 9: 'B', 10: 'A' }
    },
    {
        title: "Error Correction",
        id: "error",
        renderer: 'renderMcqTasks',
        instruction: "Choose the letter A, B, C or D on your answer sheet to indicate the underlined part that needs correction.",
        questions: [
            { qNum: 11, type: 'mcq-underline', prompt: "11. My father <u>is</u> good <u>at</u> <u>fix</u> things around the house <u>on</u> weekends.", options: { A: "is", B: "at", C: "fix", D: "on" } },
            { qNum: 12, type: 'mcq-underline', prompt: "12. <u>Where</u> did you <u>bought</u> <u>that</u> beautiful dress <u>for</u> the party?", options: { A: "Where", B: "bought", C: "that", D: "for" } }
        ],
        answers: { 11: 'C', 12: 'B' }
    },
    {
        title: "Odd One Out",
        id: "odd-one-out",
        renderer: 'renderMcqTasks',
        instruction: "Choose the word that doesn't fit the group.",
        questions: [
            { qNum: 13, type: 'mcq-standard', prompt: "13.", options: ["hobby", "paint", "read", "listen"] },
            { qNum: 14, type: 'mcq-standard', prompt: "14.", options: ["sunburn", "healthy", "headache", "cough"] }
        ],
        answers: { 13: 'A', 14: 'B' }
    },
    {
        title: "Verb Forms",
        id: "verb-forms",
        renderer: 'renderWritingTasks',
        instruction: "Put the correct form of the verbs in the bracket.",
        questions: [
            { qNum: 15, type: 'writing-inline', prompt: "15. She {{BLANK_15}} (play) badminton with her friends yesterday afternoon." },
            { qNum: 16, type: 'writing-inline', prompt: "16. I {{BLANK_16}} (not/watch) TV last night because I was tired." },
            { qNum: 17, type: 'writing-inline', prompt: "17. He often {{BLANK_17}} (ride) his bike to school." },
            { qNum: 18, type: 'writing-inline', prompt: "18. They {{BLANK_18}} (organize) a charity event last Sunday." }
        ],
        answers: { 15: "played", 16: "didn't watch", 17: "rides", 18: "organized" }
    },
    {
        title: "Ordering",
        id: "ordering",
        renderer: 'renderMcqTasks',
        instruction: "Put the sentences in the correct order to make a logical conversation.",
        questions: [
            { qNum: 19, type: 'mcq-standard', prompt: "19. a. Great idea! I'm free on Saturday.\n b. Hi Jane, it's Tom.\n c. How about Saturday? We could go to the new cinema.\n d. Hi Tom. How are you?\n e. I'm good, thanks. Are you free this weekend?\n f. Yes, I am. Why?", options: ["b – d – e – f – c – a", "b – e – d – c – f – a", "d – b – c – e – f – a", "a – c – f – e – d – b"] },
            { qNum: 20, type: 'mcq-standard', prompt: "20. a. I'm sorry to hear that. You should see a doctor.\n b. You're right. I'll make an appointment.\n c. Of course. Health should always come first.\n d. What's the matter? You look unwell.\n e. Yes, but I'm worried about my exam tomorrow.\n f. I think I have a fever.", options: ["d – f – a – e – b – c", "d – a – f – e – b – c", "f – d – a – b – e – c", "d – f – e – a – c – b"] }
        ],
        answers: { 19: 'A', 20: 'A' }
    },
    {
        title: "Signs & Notices",
        id: "signs",
        renderer: 'renderMcqTasks',
        instruction: "Read the following sign or notice and choose the correct answer.",
        questions: [
            { qNum: 21, type: 'mcq-standard', prompt: "21. What does this sign (a camera crossed out in a red circle) mean?<br></br><img src='https://i.imgur.com/D05ndCM.png'>", options: ["You can take photos here.", "Taking photos is not allowed.", "This is a good place for photos.", "You must use a camera here."] },
            { qNum: 22, type: 'mcq-standard', prompt: "22. What does this notice (Cinema: We cannot change your seats after you've paid for tickets.) mean??<br></br><img src='https://i.imgur.com/BEeTWb2.jpeg'>", options: ["You can change your seats after paying for tickets", "You can change your seats before paying for tickets.", "You should change your seats if you can see the film.", "You can change your seats if you like."] }
        ],
        answers: { 21: 'B', 22: 'A' }
    },
    {
        title: "Cloze 1 (23-27)",
        id: "cloze-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read and complete each blank in the passage with the correct answer A, B, C or D.",
        readingText: `
            <p>Linda has a very busy and interesting life. She always (23)______ up at 6 a.m. to go for a run in the park. After school, Linda usually helps her mom with the (24)______. She is very good at making dinner. Sometimes, she invites her friends over to eat with her family. She also has a passion for music. She is learning to play the piano, and she has classes on Mondays and Wednesdays.</p>
            <p>On weekends, she (25) ______ stays at home because she loves outdoor activities. She has a bicycle and often goes cycling in the countryside. She also likes (26) ______, and she has a beautiful collection of her own paintings. Linda is a very (27) ______ and creative person!</p>
        `,
        questions: [
            { qNum: 23, type: 'mcq-standard', prompt: "23. Select the best option for blank (23).", options: ["wake", "wakes", "woke", "waking"] },
            { qNum: 24, type: 'mcq-standard', prompt: "24. Select the best option for blank (24).", options: ["homework", "gardening", "cooking", "shopping"] },
            { qNum: 25, type: 'mcq-standard', prompt: "25. Select the best option for blank (25).", options: ["often", "always", "never", "sometimes"] },
            { qNum: 26, type: 'mcq-standard', prompt: "26. Select the best option for blank (26).", options: ["paint", "paints", "painting", "painted"] },
            { qNum: 27, type: 'mcq-standard', prompt: "27. Select the best option for blank (27).", options: ["lazy", "quiet", "shy", "energetic"] }
        ],
        answers: { 23: 'B', 24: 'A', 25: 'C', 26: 'C', 27: 'D' }
    },
    {
        title: "Reading (28-32)",
        id: "reading",
        renderer: 'renderReadingComprehension',
        instruction: "Read the following passage and choose the correct answer to each of the questions.",
        readingText: `
            <p>Our school holds a "Sports Day" event every year in the spring. The event includes many different sports and activities. Students can compete in running, long jump, and swimming. There are also team sports like football, basketball, and volleyball.</p>
            <p>Our school started this event about ten years ago to encourage students to be more active. Every student can sign up for at least one activity, but many students choose to participate in two or three. Before the event, we practice for several weeks. Teachers help us train and learn the rules of the games. Those who are good at running can join the track team. Those who enjoy team sports can form a group with their friends.</p>
            <p>Finally, on the day of the event, everyone comes to the school's sports field. We compete, cheer for our friends, and have a lot of fun. The winners receive medals and feel very proud. During the event, we learn about teamwork and sportsmanship. It’s not just about winning; it’s about trying our best and supporting each other. These events are exciting and bring our school community closer together.</p>
        `,
        questions: [
            { qNum: 28, type: 'mcq-standard', prompt: "28. How many team sports are mentioned in the passage?", options: ["2", "3", "4", "5"] },
            { qNum: 29, type: 'mcq-standard', prompt: "29. When did the school start this event?", options: ["Last year", "In the spring", "Ten years ago", "A few weeks ago"] },
            { qNum: 30, type: 'mcq-standard', prompt: "30. What can students who enjoy team sports do?", options: ["Join the track team", "Practice by themselves", "Form a group with friends", "Train the teachers"] },
            { qNum: 31, type: 'mcq-standard', prompt: "31. The word “compete” in paragraph 1 is closest in meaning to:", options: ["talk to others", "watch others", "help others", "play against others"] },
            { qNum: 32, type: 'mcq-standard', prompt: "32. Which statement is NOT true?", options: ["The event happens every spring.", "Winners of the competitions receive medals.", "The event helps students learn about teamwork.", "Students can only participate in one activity."] }
        ],
        answers: { 28: 'B', 29: 'C', 30: 'C', 31: 'D', 32: 'D' }
    },
    {
        title: "Sentence Building",
        id: "sentence-building",
        renderer: 'renderMcqTasks',
        instruction: "Choose the sentence that is best made from the given cues.",
        questions: [
            { qNum: 33, type: 'mcq-standard', prompt: "33. They/ visit/ a museum/ last Saturday.", options: ["They visit a museum last Saturday.", "They visiting a museum last Saturday.", "They visited a museum last Saturday.", "They visits a museum last Saturday."] },
            { qNum: 34, type: 'mcq-standard', prompt: "34. She/ learn/ how to/ cook/ different dishes.", options: ["She learns how to cooking different dishes.", "She learning how to cook different dishes.", "She learns how cook different dishes.", "She learns how to cook different dishes."] },
            { qNum: 35, type: 'mcq-standard', prompt: "35. He/ enjoy/ read/ books/ because/ it/ help/ him/ relax.", options: ["He enjoys read books because it helps him relax.", "He enjoys reading books because it helps him relax.", "He enjoy reading books because it help him relax.", "He enjoys reading book because it helping him relax."] },
            { qNum: 36, type: 'mcq-standard', prompt: "36. We/ give/ food/ stray animals/ last week.", options: ["We gave food to stray animals last week.", "We give food to stray animals last week.", "We giving food to stray animals last week.", "We gives food to stray animals last week."] }
        ],
        answers: { 33: 'C', 34: 'D', 35: 'B', 36: 'A' }
    },
    {
        title: "Sentence Writing",
        id: "sentence-writing",
        renderer: 'renderWritingTasks',
        instruction: "Rewrite the following sentences as instructed.",
        questions: [
            { qNum: 37, type: 'fill-in-text', prompt: "37. Rewrite using (so): It's raining outside. You should take an umbrella." },
            { qNum: 38, type: 'fill-in-text', prompt: "38. Rewrite using (and): I like pizza. My brother likes pizza, too." },
            { qNum: 39, type: 'fill-in-text', prompt: "39. Rewrite using (interested in): She loves listening to music in her free time." },
            { qNum: 40, type: 'fill-in-text', prompt: "40. Rewrite using (There are): The library has many interesting books." }
        ],
        answers: { 37: "It's raining outside, so you should take an umbrella.", 38: "I like pizza and my brother likes pizza, too.", 39: "She is interested in listening to music in her free time.", 40: "There are many interesting books in the library." }
    }
];