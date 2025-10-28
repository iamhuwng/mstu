export const meta = {
    title: 'Mid-term Test 10 - Grade 10'
};

export const assignmentId = 'g10-mid-term-test-10-v2';

export const sections = [
    {
        title: "Cloze 1 (1-6)",
        id: "cloze-1",
        renderer: 'renderReadingComprehension', // Updated to two-column format
        instruction: "Read the passage on the right and mark the letter A, B, C, or D to indicate the option that best fits each numbered blank.",
        readingText: `
            <h4 class="font-bold text-lg text-slate-700">Humans and the Music in Life – The Harmony Within</h4>
            <p>Music influences people of all ages, especially those (1)____ seek emotional comfort and creative inspiration from melodies. From ancient times to modern life, music has played a role in healing and communication. Many individuals now enjoy (2)____ instrumental therapy sessions in schools and wellness centers. A growing (3)____ of scientific studies suggests that music improves memory and emotional well-being. Right now, researchers (4)____ exploring how brainwaves react to different musical frequencies. The increasing (5)____ of music in education and healthcare reflects its impact on human development. Through rhythm and lyrics, people can connect deeply with their identity, express their inner world, and (6)____ emotional trauma.</p>
        `,
        questions: [
            { qNum: 1, type: 'mcq-standard', prompt: "1. Select the best option for blank (1).", options: ["whom", "who", "which", "whose"] },
            { qNum: 2, type: 'mcq-standard', prompt: "2. Select the best option for blank (2).", options: ["calming", "relaxing", "remaining", "giving"] },
            { qNum: 3, type: 'mcq-standard', prompt: "3. Select the best option for blank (3).", options: ["amount", "range", "number", "deal"] },
            { qNum: 4, type: 'mcq-standard', prompt: "4. Select the best option for blank (4).", options: ["have explored", "are exploring", "explored", "were exploring"] },
            { qNum: 5, type: 'mcq-standard', prompt: "5. Select the best option for blank (5).", options: ["involving", "involved", "involvement", "involve"] },
            { qNum: 6, type: 'mcq-standard', prompt: "6. Select the best option for blank (6).", options: ["recover from", "look at", "turn off", "combine with"] }
        ],
        answers: { 1: 'B', 2: 'A', 3: 'C', 4: 'B', 5: 'C', 6: 'A' }
    },
    {
        title: "Cloze 2 (7-12)",
        id: "cloze-2",
        renderer: 'renderReadingComprehension', // Updated to two-column format
        instruction: "Read the leaflet on the right and mark the letter A, B, C, or D to indicate the option that best fits each numbered blank.",
        readingText: `
            <h4 class="font-bold text-lg text-slate-700">Human and Music in Life</h4>
            <p>Music has played a vital role in human life throughout history. It exists in every culture and serves as a form of communication, celebration, and emotional release. Whether you’re attending a concert or simply listening to your favorite song (7)____ the way to school, music can make a big difference in your day. You may prefer pop, classical, jazz, or even traditional folk music, (8)____ they all share the ability to connect people and express feelings that words sometimes cannot. People use music to express identity and culture, and some even associate (9)____ with improved focus and relaxation. One song can lift your mood, while (10)____ tune might bring back memories from childhood. Learning to play an instrument also helps in (11)____ patience, creativity, and self-discipline. To maintain this habit, try creating a personal playlist, joining a music group, or exploring new genres—these are all great ways to build a deeper (12)____ with music in your life.</p>
        `,
        questions: [
            { qNum: 7, type: 'mcq-standard', prompt: "7. Select the best option for blank (7).", options: ["in", "on", "at", "for"] },
            { qNum: 8, type: 'mcq-standard', prompt: "8. Select the best option for blank (8).", options: ["so", "or", "but", "if"] },
            { qNum: 9, type: 'mcq-standard', prompt: "9. Select the best option for blank (9).", options: ["soothing classical melodies", "soothing melodies classical", "classical melodies soothing", "melodies soothing classical"] },
            { qNum: 10, type: 'mcq-standard', prompt: "10. Select the best option for blank (10).", options: ["another", "other", "others", "the other"] },
            { qNum: 11, type: 'mcq-standard', prompt: "11. Select the best option for blank (11).", options: ["deferring", "dealing", "controlling", "developing"] },
            { qNum: 12, type: 'mcq-standard', prompt: "12. Select the best option for blank (12).", options: ["connection", "contribution", "balance", "fruit"] }
        ],
        answers: { 7: 'B', 8: 'C', 9: 'A', 10: 'A', 11: 'D', 12: 'A' }
    },
    {
        title: "Arrangement (13-17)",
        id: "arrangement",
        renderer: 'renderMcqTasks',
        instruction: "Mark the letter A, B, C or D to indicate the best arrangement of utterances or sentences to make a meaningful exchange or text.",
        questions: [
            { qNum: 13, type: 'mcq-standard', prompt: "13. Arrange the conversation:<br>a. Anna: I totally agree. I listen to music every day — it's like a friend who always understands me!<br>b. Anna: Hi! Do you think music really affects the way we feel?<br>c. Ben: Definitely! A happy song can lift your mood, and soft music helps me relax after a long day.", options: ["c-a-b", "b-c-a", "c-b-a", "b-a-c"] },
            { qNum: 14, type: 'mcq-standard', prompt: "14. Arrange the conversation:<br>a. Lily: Exactly! When I’m stressed, I just put on my headphones and listen to relaxing melodies.<br>b. Mark: I play the guitar in my free time. Creating music gives me so much joy.<br>c. Lily: I can’t imagine life without music. It’s like a part of who we are.<br>d. Mark: I feel the same. Music helps me express emotions that I can’t put into words.<br>e. Lily: That’s amazing! Music truly connects people and adds meaning to life.", options: ["c-b-a-e-d", "d-e-c-b-a", "c-d-a-b-e", "d-c-e-b-a"] },
            { qNum: 15, type: 'mcq-standard', prompt: "15. Arrange the sentences to form a complete letter:<br>a. If you need any assistance or have questions, please contact our support team at musichelp@xyz.com.<br>b. We are excited to inform you that our new online music platform now offers personalized playlists based on your listening habits.<br>c. Remember, your current subscription will remain active until the end of this month, regardless of whether you switch to the new platform.<br>d. Once you start using the platform, you can explore different genres and discover new artists easily.<br>e. This feature helps deepen your connection with music and enhances your overall listening experience.", options: ["a-d-e-b-c", "b-d-e-a-c", "d-a-e-b-c", "b-c-e-d-a"] },
            { qNum: 16, type: 'mcq-standard', prompt: "16. Arrange the sentences into a logical paragraph:<br>a. Playing music helped me relax and express my emotions in ways words could not.<br>b. I never realized before how much patience and practice music requires.<br>c. Every day, I practiced scales, chords, and simple songs to improve my skills.<br>d. This experience has deepened my appreciation for musicians and taught me the value of perseverance.<br>e. Learning to play the piano for a month was challenging, but it also brought me great joy and a sense of achievement.", options: ["b-e-c-a-d", "e-b-c-a-d", "b-c-d-a-e", "e-a-b-c-d"] },
            { qNum: 17, type: 'mcq-standard', prompt: "17. Arrange the sentences into a logical paragraph:<br>a. Recognizing the positive impact of music on mental health, schools have incorporated music therapy programs and group singing sessions into their curricula.<br>b. Over the past few years, music has played an increasingly important role in people’s daily lives, becoming a source of comfort and inspiration.<br>c. These initiatives have enriched cultural life, strengthened social bonds, and encouraged creativity among participants.<br>d. Today, music continues to unite people of all ages, promoting well-being and a sense of belonging.<br>e. To support this growing interest, communities have organized more live concerts, music festivals, and educational workshops.", options: ["b-a-e-c-d", "b-d-e-a-c", "d-e-a-b-c", "b-e-a-c-d"] }
        ],
        answers: { 13: 'B', 14: 'C', 15: 'A', 16: 'B', 17: 'D' }
    },
    {
        title: "Cloze 3 (18-22)",
        id: "cloze-3",
        renderer: 'renderReadingComprehension', // Updated to two-column format
        instruction: "Read the passage on the right and mark the letter A, B, C, or D to indicate the option that best fits each numbered blank.",
        readingText: `
            <p>Since its release in early March, the music video “Bac Bling” by singer Hoa Minzy, in collaboration with Meritorious Artist Xuan Hinh and rapper Tuan Cry, (18)____.<br></br> Starting with a modern melody, the artists have seamlessly incorporated many traditional elements, creating a song that appeals to audiences of all ages.</p>
            <p>The lyrics of “Bac Bling” (19)____. Featured in the music video are aspects of traditional culture such as Dong Ho paintings, Huu Chap village’s tug-of-war contest, Quan Ho folk singing at the Lim festival, and old Vietnamese customs like betel chewing, blackened teeth, and Mother Goddess worship.</p><br></br>
            <p>The video also (20)____ such as Dau pagoda, Do temple, the Bac Ninh Quan Ho Folk Song Theater, and the Phu Lang pottery village.<br></br> The song, understandably popular in Vietnam, has also gone viral worldwide, setting several records. It surpassed 63 million views within two weeks of release, topped several online music charts in Vietnam, (21)____, and was among the top 20 most-streamed songs in countries and territories like Australia, Singapore, South Korea, Taiwan (China), the Czech Republic, Japan, Germany, and Canada.</p><br></br>
            <p>“The MV is well-organized and harmonious in terms of music, production, and costumes, all showcasing a fusion of modern and traditional elements. The song expresses the artist’s love for her homeland. Through the MV, people (22)____. It’s also a good way to attract more visitors and boost tourism development in Bac Ninh,” said composer Giang Son.</p>
        `,
        questions: [
            { qNum: 18, type: 'mcq-standard', prompt: "18. Select the best option for blank (18).", options: ["has become a sensation in the Vietnamese music industry", "quickly rose to fame within Vietnam’s music scene", "has made a significant impact on Vietnam’s music market", "gained massive popularity across Vietnam’s music industry"] },
            { qNum: 19, type: 'mcq-standard', prompt: "19. Select the best option for blank (19).", options: ["were directed by internationally renowned producers", "were written based on contemporary social issues", "are influenced by traditional Vietnamese cultural elements", "were inspired by ancient Vietnamese folk songs, proverbs, and idioms"] },
            { qNum: 20, type: 'mcq-standard', prompt: "20. Select the best option for blank (20).", options: ["Introduces visitors to lesser-known attractions beyond Bac Ninh’s famous landmarks", "Protects the historic sites in Bac Ninh province from deterioration", "highlights famous landmarks in Bac Ninh province", "Renovates old structures to preserve Bac Ninh province’s architectural legacy"] },
            { qNum: 21, type: 'mcq-standard', prompt: "21. Select the best option for blank (21).", options: ["that ranking 15th on weekly streaming chart of the global", "where currently ranking 15th on streaming chart of the global weekly", "which ranked on the 15th of the global streaming chart every week", "ranked 15th on the global weekly streaming chart"] },
            { qNum: 22, type: 'mcq-standard', prompt: "22. Select the best option for blank (22).", options: ["can learn more about Bac Ninh as a land of extraordinary people and cultural heritages", "might overlook Bac Ninh’s unique cultural identity without proper guidance", "must visit Bac Ninh to experience the depth of its traditions", "may fail to recognize Bac Ninh’s cultural richness"] }
        ],
        answers: { 18: 'A', 19: 'D', 20: 'C', 21: 'D', 22: 'A' }
    },
    {
        title: "Reading 1 (23-30)",
        id: "reading-1",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and mark the letter A, B, C or D to indicate the best answer to each question.",
        readingText: "Music has existed in human life for thousands of years. From early drums made of animal skin to modern digital instruments, music has always played an important role in human societies. Most people enjoy music, no matter where they are from or what language they speak. In fact, music is often called a “universal language” because people around the world can feel emotions through it, even if they don’t understand the lyrics.<br></br>\n\nDifferent cultures use music in different ways. In many African communities, music is used in storytelling and daily communication. In India, classical music has been connected with meditation and spiritual practice for centuries. In Western countries, music plays a major role in entertainment, from movies and TV shows to concerts and parties. These cultural uses show how closely music is tied to human experiences and traditions.<br></br>\n\nResearch has shown that music can improve our mental and physical health. For example, listening to calm music can lower stress and reduce heart rate. Some hospitals even use music therapy to help patients recover faster. In schools, music education has been linked to better memory, creativity, and teamwork skills. These results suggest a strong connection between music and brain development.<br></br>\n\nToday, technology has changed the way people create and listen to music. Apps and online platforms allow anyone to access millions of songs with just a click. People can also create their own music using digital tools without needing expensive instruments. This means more people than ever before can enjoy and participate in music-making, regardless of their background or location.",
        questions: [
            { qNum: 23, type: 'mcq-standard', prompt: "23. Which of the following is NOT mentioned as a way people enjoy or use music?", options: ["Meditation", "Healing", "Cooking", "Storytelling"] },
            { qNum: 24, type: 'mcq-standard', prompt: "24. The word “universal” in paragraph 1 is OPPOSITE in meaning to:", options: ["global", "emotional", "local", "cultural"] },
            { qNum: 25, type: 'mcq-standard', prompt: "25. The word “they” in paragraph 1 refers to:", options: ["movies and shows", "most people", "different countries", "musical styles"] },
            { qNum: 26, type: 'mcq-standard', prompt: "26. The word “linked” in paragraph 3 could best be replaced by:", options: ["unconnected", "found", "discovered", "correlated"] },
            { qNum: 27, type: 'mcq-standard', prompt: "27. Which best paraphrases the sentence “Technology has changed the way people create and listen to music”?", options: ["Technology inhibits individuals from fully appreciating the nuances of music.", "Technology has increasingly alienated music from the everyday lives of people.", "The enjoyment of music has become heavily contingent upon technological mediation.", "Technology has profoundly reshaped the manner in which people engage with and perceive music."] },
            { qNum: 28, type: 'mcq-standard', prompt: "28. Which of the following is TRUE according to the passage?", options: ["Music education only improves singing ability.", "Digital tools make it harder to create music.", "Music can support brain and health development.", "Only trained musicians can use music apps."] },
            { qNum: 29, type: 'mcq-standard', prompt: "29. In which paragraph does the writer mention a present causal relationship?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"] },
            { qNum: 30, type: 'mcq-standard', prompt: "30. In which paragraph does the writer explore modern methods for music participation?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"] }
        ],
        answers: { 23: 'C', 24: 'C', 25: 'B', 26: 'D', 27: 'D', 28: 'C', 29: 'C', 30: 'D' }
    },
    {
        title: "Reading 2 (31-40)",
        id: "reading-2",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage and mark the letter A, B, C or D to indicate the best answer to each question.",
        readingText: "[I] Music has been an essential part of human life since ancient times. People create and enjoy music for various reasons, including emotional expression, social connection, and cultural identity. As society has evolved, the role of music has evolved as well, becoming increasingly integrated into daily life worldwide.<br></br>\n\n[II] Music can evoke powerful emotions and memories. It has the ability to calm stress, boost happiness, and even improve mental health. For example, listening to soothing melodies can help people relax after a busy day, while upbeat songs often motivate individuals during exercise or work. Besides personal benefits, music plays a significant role in social gatherings, strengthening bonds between friends and communities.<br></br>\n\n[III] The influence of music extends beyond emotional effects to educational and developmental benefits. Studies show that children who learn to play instruments tend to develop better language skills, concentration, and creativity. However, access to music education varies widely. Some schools provide excellent programs, while others lack resources, causing inequality in opportunities for children to experience the advantages of music.<br></br>\n\n[IV] Despite these benefits, the music industry also faces challenges. Rapid technological changes and online streaming have altered how people consume music, impacting artists’ incomes. Moreover, exposure to very loud music through headphones or concerts can lead to hearing problems. To maximize the positive effects of music, individuals and societies must balance enjoyment with health and support for musicians.",
        questions: [
            { qNum: 31, type: 'mcq-standard', prompt: "31. Where does the following sentence best fit? “People have been using music to connect with others and express themselves for thousands of years.”", options: ["[IV]", "[III]", "[II]", "[I]"] },
            { qNum: 32, type: 'mcq-standard', prompt: "32. The phrase “integrated into daily life” in paragraph I could be best replaced by:", options: ["removed from everyday activities", "included in regular routines", "separated from normal life", "ignored by most people"] },
            { qNum: 33, type: 'mcq-standard', prompt: "33. The word “soothing” in paragraph II most nearly means:", options: ["calming", "loud", "boring", "fast"] },
            { qNum: 34, type: 'mcq-standard', prompt: "34. According to paragraph II, which of the following is NOT a benefit of music?", options: ["Reducing stress", "Increasing happiness", "Creating social bonds", "Causing hearing loss"] },
            { qNum: 35, type: 'mcq-standard', prompt: "35. Which of the following best summarises paragraph III?", options: ["Music education is easy to access for all children and improves many skills.", "Music can help children develop important abilities, but access to learning is uneven.", "Music is only useful for creativity and has no other effects.", "Lack of music education does not affect children’s development."] },
            { qNum: 36, type: 'mcq-standard', prompt: "36. The word “inequality” in paragraph III is OPPOSITE in meaning to:", options: ["fairness", "difference", "advantage", "difficulty"] },
            { qNum: 37, type: 'mcq-standard', prompt: "37. Which of the following is TRUE according to the passage?", options: ["Music is only helpful in social settings and not for individual well-being.", "Technological advances have helped all musicians earn more money.", "Listening to very loud music may cause hearing problems.", "Music education programs are equally available worldwide."] },
            { qNum: 38, type: 'mcq-standard', prompt: "38. Which best paraphrases the sentence: “individuals and societies must balance enjoyment with health and support for musicians.”", options: ["Individuals ought to indulge in musical experiences to the fullest extent, disregarding any potential risks or consequences.", "It is imperative for society to strike a harmonious balance between the appreciation of music and the safeguarding of public health and the rights of musicians.", "Musicians are advised to prioritize their professional pursuits over health considerations, even if it entails personal risk.", "The gratification derived from music consumption should take precedence over concerns related to health or the welfare of performing artists."] },
            { qNum: 39, type: 'mcq-standard', prompt: "39. Which of the following can be inferred from the passage?", options: ["Music’s benefits are limited only to emotional well-being.", "Without careful management, music consumption can have negative consequences.", "Technology has no effect on how people experience music.", "Music education is unnecessary for child development."] },
            { qNum: 40, type: 'mcq-standard', prompt: "40. Which of the following best summarises the passage?", options: ["Music has long been important for emotional, social, and educational purposes but requires balance to avoid health and financial problems.", "Music primarily serves as a source of entertainment and enjoyment, without having any significant or serious effects on people’s lives.", "Technological advancements have exclusively caused harm to the music industry’s earnings and have negatively impacted listeners’ hearing health.", "Only children gain benefits from engaging with music, particularly through educational programs, while adults experience fewer advantages overall."] }
        ],
        answers: { 31: 'D', 32: 'B', 33: 'A', 34: 'D', 35: 'B', 36: 'A', 37: 'C', 38: 'B', 39: 'B', 40: 'A' }
    }
];