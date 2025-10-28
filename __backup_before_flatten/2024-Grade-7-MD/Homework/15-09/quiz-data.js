export const meta = { title: 'Homework 15-09' };
export const assignmentId = '2024-G7-15-09';
export const sections = [
    {
        title: "Correction I",
        id: "correction-1",
        renderer: 'renderMcqTasks',
        instruction: "Choose the underlined word or phrase (marked A, B, C or D) in each sentence that needs correcting.",
        questions: [
            { qNum: 1, type: 'mcq-underline', prompt: "1. She's interested in <u>photographs</u> because she wants <u>to take</u> a lot of <u>beautiful photos</u> of <u>life</u>.", options: {A: "photographs", B: "to take", C: "beautiful photos", D: "life"} },
            { qNum: 2, type: 'mcq-underline', prompt: "2. The band <u>would like to</u> share their interest <u>in music to</u> their fans <u>by singing</u> good songs in <u>their concert</u>.", options: {A: "would like to", B: "in music to", C: "by singing", D: "their concert"} },
            { qNum: 3, type: 'mcq-underline', prompt: "3. Water puppetry <u>is</u> one of the <u>unique</u> and traditional <u>artist</u> forms in <u>Viet Nam</u>.", options: {A: "is", B: "unique", C: "artist", D: "Viet Nam"} },
            { qNum: 4, type: 'mcq-underline', prompt: "4. She <u>thinks</u> her younger brother plays the piano as <u>good</u> as she <u>does</u>.", options: {A: "thinks", B: "good", C: "as", D: "does"} },
            { qNum: 5, type: 'mcq-underline', prompt: "5. Some people say that the melody of classical music <u>isn't</u> <u>more quick</u> as <u>hip-hop</u>.", options: {A: "isn't", B: "more quick", C: "as", D: "hip-hop"} },
            { qNum: 6, type: 'mcq-underline', prompt: "6. My hobby isn't quite <u>different with</u> your hobby, so <u>I think</u> we can become <u>close friends</u>.", options: {A: "different with", B: "I think", C: "close friends", D: "hobby"} },
            { qNum: 7, type: 'mcq-underline', prompt: "7. She <u>doesn't like</u> going to cinema, and her sister <u>doesn't</u> <u>too</u>.", options: {A: "doesn't like", B: "going to", C: "doesn't", D: "too"} },
            { qNum: 8, type: 'mcq-underline', prompt: "8. I <u>think</u> your idea is <u>quite</u> different <u>as</u> <u>mine</u>.", options: {A: "think", B: "quite", C: "as", D: "mine"} },
            { qNum: 9, type: 'mcq-underline', prompt: "9. Uncle Jimmy <u>came to stay</u> with us <u>last month</u>; it <u>is</u> very <u>nice life</u>.", options: {A: "came to stay", B: "last month", C: "is", D: "nice life"} },
            { qNum: 10, type: 'mcq-underline', prompt: "10. I <u>have travelled</u> a lot, but I have <u>never been</u> <u>in</u> the <u>USA</u>.", options: {A: "have travelled", B: "never been", C: "in", D: "USA"} }
        ],
        answers: { 1:'B', 2:'C', 3:'D', 4:'D', 5:'D', 6:'A', 7:'D', 8:'D', 9:'C', 10:'D' }
    },
    {
        title: "Correction II",
        id: "correction-2",
        renderer: 'renderWritingTasks',
        instruction: "There is one mistake in each sentence. Find the mistake and type the correction in the box.",
        questions: [
            { qNum: 11, type: 'fill-in-text', prompt: "1. A lot of people are good artists and they are successfully in life." },
            { qNum: 12, type: 'fill-in-text', prompt: "2. Music promote creativity, social development, and personality." },
            { qNum: 13, type: 'fill-in-text', prompt: "3. The Mona Lisa is a portrait paint by the Italian artist Leonardo da Vinci." },
            { qNum: 14, type: 'fill-in-text', prompt: "4. Your violin is the same with the one I've just bought." },
            { qNum: 15, type: 'fill-in-text', prompt: "5. My mother doesnt like rock music and I dont too." },
            { qNum: 16, type: 'fill-in-text', prompt: "6. The weather of Hong Kong is different from that of Canadas." },
            { qNum: 17, type: 'fill-in-text', prompt: "7. How long do you go to the movies? - Twice a month." },
            { qNum: 18, type: 'fill-in-text', prompt: "8. The weather today is not so hot as it is yesterday." },
            { qNum: 19, type: 'fill-in-text', prompt: "9. They kept me in the dark. I didnt knew anything about that robbery." },
            { qNum: 20, type: 'fill-in-text', prompt: "10. Yesterday class 2B has gone to the National Library." }
        ],
        answers: { 11: "successful", 12: "promotes", 13: "painting", 14: "as", 15: "either", 16: "Canada", 17: "How often", 18: "was", 19: "didn't know", 20: "went" }
    },
    {
        title: "Reading I",
        id: "reading-1",
        renderer: 'renderSummaryCompletion',
        instruction: "Fill in the blank with a suitable word.",
        readingText: "Kevin O’Donnell works {{BLANK_21}} Hollywood. He records {{BLANK_22}} for films. He worked on his first film in 1980: Star Wars. He’s now 51 and he {{BLANK_23}} helped to make more than 100 films. In 1983, he did the sound on the film called Terms of Endearment. The film won five Oscars, but O’Donnell {{BLANK_24}} win one. He was at the Oscars in 1983 {{BLANK_25}} he was only 26. Now, he has {{BLANK_26}} to the Oscars 20 times. He worked on Top Gun, Terminator 3, Spider-Man, Transformers and other great films, but he hasn’t won an Oscar {{BLANK_27}}. He has written 20 speeches so far, but has never been given one. {{BLANK_28}} speeches are in a drawer in {{BLANK_29}} house. Kevin doesn’t mind. He knows the sound in his films is amazing. He’s {{BLANK_30}} to win one day!",
        questions: [ { qNum: 21, type: 'blank-in-text'}, { qNum: 22, type: 'blank-in-text'}, { qNum: 23, type: 'blank-in-text'}, { qNum: 24, type: 'blank-in-text'}, { qNum: 25, type: 'blank-in-text'}, { qNum: 26, type: 'blank-in-text'}, { qNum: 27, type: 'blank-in-text'}, { qNum: 28, type: 'blank-in-text'}, { qNum: 29, type: 'blank-in-text'}, { qNum: 30, type: 'blank-in-text'} ],
        answers: { 21: "in", 22: "sound", 23: "has", 24: "didnt", 25: "when", 26: "been", 27: "yet", 28: "The", 29: "his", 30: "going" }
    },
    {
      title: "Reading II",
      id: "reading-2",
      renderer: 'renderSummaryCompletion',
      instruction: "Fill in the blank with a suitable word in the box.",
      readingText: "One of the first novels in the history of literature {{BLANK_31}} written in England in 1719. It was Robinson Crusoe by Daniel Defoe. Daniel Defoe was born {{BLANK_32}} London in the family of a rich man. When Daniel was a schoolboy, he began to write stories. After {{BLANK_33}} school, he worked in his father’s shop and {{BLANK_34}} articles for newspapers. Defoe visited many countries and met many people. That helped him {{BLANK_35}} in his writings. In 1719, when Defoe was sixty years old, he wrote the novel Robinson Crusoe which {{BLANK_36}} him famous. Defoe used in his book a true story about a sailor who {{BLANK_37}} on an island for four years. Robinson Crusoe in Defoe’s novel lived on an island for twenty-eight years. People liked {{BLANK_38}} novel in England and in many other countries, Daniel Defoe wrote other books. {{BLANK_39}}, his novel Robison Crusoe was the {{BLANK_40}} famous. Defoe was not a rich man when he died in 1731.",
      wordBank: ["However", "made", "most", "was", "much", "leaving", "wrote", "lived", "in", "the"],
      questions: [ { qNum: 31, type: "dropdown-in-text" }, { qNum: 32, type: "dropdown-in-text" }, { qNum: 33, type: "dropdown-in-text" }, { qNum: 34, type: "dropdown-in-text" }, { qNum: 35, type: "dropdown-in-text" }, { qNum: 36, type: "dropdown-in-text" }, { qNum: 37, type: "dropdown-in-text" }, { qNum: 38, type: "dropdown-in-text" }, { qNum: 39, type: "dropdown-in-text" }, { qNum: 40, type: "dropdown-in-text" } ],
      answers: { 31: "was", 32: "in", 33: "leaving", 34: "wrote", 35: "much", 36: "made", 37: "lived", 38: "the", 39: "However", 40: "most" }
    },
    {
        title: "Reading III",
        id: "reading-3",
        renderer: 'renderReadingComprehension',
        instruction: "Read the passage, and then answer the questions.",
        readingText: "Have you ever seen the film School of Rock? It’s about a rock musician who became a teacher. The film is based on a real music school which is run by Paul Green. Paul Green started the first School of Rock in 1998 in Philadelphia in the USA. He gave students rock music lessons after school, but he wanted to do more. Now he gives them the chance to play in rock concerts. “Some of our students have never played in front of a real audience before. We teach them how to do it.” he says. He has already taught hundreds of young people to be rock performers, and now there are 30 schools of rock in different towns in the USA.",
        questions: [
            { qNum: 41, type: 'writing', prompt: "1. How many students has he taught?" },
            { qNum: 42, type: 'writing', prompt: "2. How many schools of rock are there in the USA?" },
            { qNum: 43, type: 'writing', prompt: "3. When did Paul Green start his first rock school?" },
            { qNum: 44, type: 'writing', prompt: "4. What is the film School of Rock about?" },
            { qNum: 45, type: 'writing', prompt: "5. What does he teach his students to do?" },
        ],
        answers: { 41: "He has already taught hundreds of young people.", 42: "There are over 30 schools of rock in different towns in the USA.", 43: "He started the first School of Rock in 1998.", 44: "Its about a rock musician who became a teacher.", 45: "He teaches them to be rock performers." }
    },
    {
        title: "Reading IV",
        id: "reading-4",
        renderer: 'renderReadingComprehension',
        instruction: "Read the text about an artist. Choose the correct answer: A, B, or C.",
        readingText: "You can’t buy a drawing by Julian Beever and you can’t see his work in a gallery or museum. Julian makes his amazing pictures on the pavements of city streets. People have called him “the Pavement Picasso” and perhaps you have seen his pictures on the Internet. Julian has made hundreds of pieces of pavement art in different countries - in many parts of Europe and also in the USA, Australia, Japan, Argentina, and Brazil. His drawings can take three or four days to finish. But because he draws with chalk, the drawings only stay for a short time. When people walk on them or when it rains, they quickly disappear. For Julian, this isn’t a problem. The drawings survive in the photos he has taken, and this is the most important thing for him. Julian’s fame hasn’t come from experts in the art world, but from the Internet. “The reason why my work has become well known is because people like it and they’ve sent it to each other on the Internet,” he says. “So I know that what I do is popular.” Julian Beever is from Leicestershire in England, but he now lives in Belgium.",
        questions: [
            { qNum: 46, type: 'mcq-standard', prompt: "1. Julian Beever makes drawings ____.", options: ["outside", "on his computer", "for exhibitions in a gallery"] },
            { qNum: 47, type: 'mcq-standard', prompt: "2. He has worked ____.", options: ["in a few cities", "in lots of countries", "with hundreds of people"] },
            { qNum: 48, type: 'mcq-standard', prompt: "3. His pictures ____.", options: ["are easy to draw", "look good when it rains", "don’t stay for a long time"] },
            { qNum: 49, type: 'mcq-standard', prompt: "4. Lots of people know Julian’s art because ____.", options: ["they know a lot about art", "he has sent photos to them", "they have seen it on the net"] },
            { qNum: 50, type: 'mcq-standard', prompt: "5. Julian Beever ____.", options: ["hasn’t lived in Britain", "hasn’t tried to be a star in the art world", "isn’t very interested in photos"] }
        ],
        answers: { 46:'A', 47:'B', 48:'C', 49:'C', 50:'B' }
    },
    {
        title: "Writing I",
        id: "writing-1",
        renderer: 'renderMcqTasks',
        instruction: "Complete sentences with 'too' or 'either'.",
        questions: [
            { qNum: 51, type: 'mcq-buttons', prompt: "1. We often go to the library on Sunday afternoon, and they do, ____." },
            { qNum: 52, type: 'mcq-buttons', prompt: "2. Susan can speak Japanese, and Tom can, ____." },
            { qNum: 53, type: 'mcq-buttons', prompt: "3. Minh didn't see the train, and Nga didn’t, ____." },
            { qNum: 54, type: 'mcq-buttons', prompt: "4. Hoa will fly to Hong Kong next month, and her mother will, ____." },
            { qNum: 55, type: 'mcq-buttons', prompt: "5. The pineapples aren’t ripe, and the durians arent, ____." },
            { qNum: 56, type: 'mcq-buttons', prompt: "6. I'm a student, and May is, ____." },
            { qNum: 57, type: 'mcq-buttons', prompt: "7. The boys shouldn't make noise in class, and the girls shouldn't, ____." },
            { qNum: 58, type: 'mcq-buttons', prompt: "8. I don't like pop music, and my friends dont, ____." },
            { qNum: 59, type: 'mcq-buttons', prompt: "9. I love country music, and her brothers do, ____." },
            { qNum: 60, type: 'mcq-buttons', prompt: "10. Our parents went to the concert last night, and their children did, ____." }
        ],
        answers: { 51:"too", 52:"too", 53:"either", 54:"too", 55:"either", 56:"too", 57:"either", 58:"either", 59:"too", 60:"too" }
    },
    {
        title: "Writing II",
        id: "writing-2",
        renderer: 'renderWritingTasks',
        instruction: "Combine the sentences. Use the words in brackets.",
        questions: [
            { qNum: 61, type: 'writing', prompt: "1. Mr. Pike teaches history of arts. Mrs May teaches history of music. (Combine using SAME SUBJECT)" },
            { qNum: 62, type: 'writing', prompt: "2. This bike is 800,000 VND. That bike is 600,000 VND. (Combine using PRICE ... DIFFERENT)" },
            { qNum: 63, type: 'writing', prompt: "3. Linda didn’t go to the concert show last night. Susan didn’t go to the concert show last night. (Combine using EITHER)" },
            { qNum: 64, type: 'writing', prompt: "4. Classical music is interesting. Folk music is interesting. (Combine using AS ... AS)" },
            { qNum: 65, type: 'writing', prompt: "5. Mr. Owen speaks English. Mrs. Phan speaks English. (Combine using SAME LANGUAGE)" }
        ],
        answers: { 61: "Mr. Pike teaches history of arts and Mrs. May teaches the same subject.", 62: "The price of this bike is different from that bike.", 63: "Linda didnt go to the concert show last night and Susan didnt, either", 64: "Classical music is as interesting as folk music.", 65: "Mr. Owen speaks English and Mrs. Phan speaks the same language." }
    },
    {
        title: "Writing III",
        id: "writing-3",
        renderer: 'renderWritingTasks',
        instruction: "Complete each sentence so that it means the same as the sentence above.",
        questions: [
            { qNum: 66, type: 'writing-inline', prompt: "1. This room is larger than the one at the end of the corridor of the art gallery. <br>-> Rewrite: The room at the end of the corridor of the art gallery is not {{BLANK_66}}" },
            { qNum: 67, type: 'writing-inline', prompt: "2. I think action films are more exciting than romance films. <br>-> Rewrite: In my opinion, romance films are not {{BLANK_67}}" },
            { qNum: 68, type: 'writing-inline', prompt: "3. Salvador Dali’s paintings are different from Picasso’s paintings. <br>-> Rewrite: Picasso’s paintings are not {{BLANK_68}}" },
            { qNum: 69, type: 'writing-inline', prompt: "4. I am interested in comic books, and my brother is also interested in comic books. <br>-> Rewrite: I am interested in comic books, and my brother is {{BLANK_69}}" },
            { qNum: 70, type: 'writing-inline', prompt: "5. My mother doesn’t like thrillers. I don’t like them. <br>-> Rewrite: My mother doesn’t like thrillers, and I don’t {{BLANK_70}}" },
            { qNum: 71, type: 'writing-inline', prompt: "6. Her interests are taking photographs and collecting coins. <br>-> Rewrite: Her hobbies are {{BLANK_71}}" },
            { qNum: 72, type: 'writing-inline', prompt: "7. Viet Nam has various kinds of traditional opera. For example, there are “Chèo” and “Cải lương”. <br>-> Rewrite: Viet Nam has some kinds of traditional opera, such as {{BLANK_72}}"},
            { qNum: 73, type: 'writing-inline', prompt: "8. My sister sings better than me. <br>-> Rewrite: I don’t sing {{BLANK_73}}"},
            { qNum: 74, type: 'writing-inline', prompt: "9. Ballets are different from modern dance. <br>-> Rewrite: Ballets and modern dance are {{BLANK_74}}"},
            { qNum: 75, type: 'writing-inline', prompt: "10. The project took less time than we had thought at first. <br>-> Rewrite: The project was not {{BLANK_75}}"}
        ],
        answers: { 66: "as large as this room", 67: "as exciting as action films", 68: "the same as Salvador Dalis paintings", 69: "interested in comic books too", 70: "either", 71: "taking photographs and collecting coins", 72: "“Chèo” or “Cải lương”", 73: "as well as my sister", 74: "not the same", 75: "as long as we thought at first" }
    },
    {
        title: "Writing IV",
        id: "writing-4",
        renderer: 'renderWritingTasks',
        instruction: "Write complete sentences using the following cues.",
        questions: [
            { qNum: 76, type: 'writing', prompt: "1. I/ happy/ hear/ that/ you/ your family/ well." },
            { qNum: 77, type: 'writing', prompt: "2. You/ remember/ circus/ we/ see/ last year?" },
            { qNum: 78, type: 'writing', prompt: "3. Circus/ coming/ again/ our city." },
            { qNum: 79, type: 'writing', prompt: "4. My father/ tickets/ circus." },
            { qNum: 80, type: 'writing', prompt: "5. We/ you/ go/ us." },
            { qNum: 81, type: 'writing', prompt: "6. You/ free/ this weekend?" },
            { qNum: 82, type: 'writing', prompt: "7. We/ meet/ 7 pm/ outside/ theatre." },
            { qNum: 83, type: 'writing', prompt: "8. Show/ begin/ 7.30 pm." },
            { qNum: 84, type: 'writing', prompt: "9. I/ hope/ we/ good time/ together." },
            { qNum: 85, type: 'writing', prompt: "10. I/ look forward/ see/ you/ there." }
        ],
        answers: { 76: "I am happy to hear that you and your family are well.", 77: "Did you remember the circus (that) we saw last year?", 78: "The circus is coming again to our city.", 79: "My father has bought the tickets for the circus.", 80: "We would like you to go with us.", 81: "Are you free this weekend?", 82: "We will meet you at 7 pm outside the theatre.", 83: "The show begins at 7.30 pm.", 84: "I hope we will have a good time together.", 85: "I look forward to seeing you there." }
    }
];