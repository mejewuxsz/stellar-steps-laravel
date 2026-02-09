/**
 * Audio file paths for Stellar Steps.
 * Map page/step to voice, BGM, or SFX.
 */

const BASE = '/assets/audio';

export const AUDIO = {
    // Prologue
    prologueEnd: {
        voice: [
            `${BASE}/Leo/Where am I_ Is this….m4a`,
            `${BASE}/Marky/Marky 1.m4a`,
            `${BASE}/Leo/Waiting for me_ But I${'\u2019'}m just Leo….m4a`,
            `${BASE}/Marky/Marky 2.m4a`,
            `${BASE}/Marky/Marky 3.m4a`,
            `${BASE}/Marky/Marky 4.m4a`,
            `${BASE}/Leo/I${'\u2019'}m Ready! Let${'\u2019'}s Go!.m4a`,
        ],
    },

    // Kingdom (Chapter 1)
    kingdom2: {
        voice: [
            `${BASE}/Leo/Eww.m4a`,
            `${BASE}/Leo/Who is that_.m4a`,
            `${BASE}/Marky/Marky 6.m4a`,
            `${BASE}/Leo/Excuse me, Mr. King_ Why are you crying_.m4a`,
            `${BASE}/king/KING1.mp3`,
            `${BASE}/Leo/Wow! This is the same as my bedroom when mom scolds me….m4a`,
            `${BASE}/king/KING2.mp3`,
            `${BASE}/Leo/You know, it is not an impossible task when we do it together….m4a`,
        ],
    },

    kingdomEnd: {
        voice: [
            `${BASE}/king/KING3.mp3`,
            null,
            `${BASE}/king/KING4.mp3`,
            null, // Leo - no exact match
            `${BASE}/king/KING5.mp3`,
        ],
    },

    kingdomComplete: {
        voice: [
            `${BASE}/Marky/Marky 8.m4a`, // "You did it, Leo! You fixed the story! And look!"
            null,
            null,
            `${BASE}/Leo/Yes.m4a`, // "Yes! We got the Star of Order! One step closer to going home."
            `${BASE}/Marky/Marky 9.m4a`, // "Great job! But rejoice not, yet... the book comes round again! Hold on tight!"
        ],
    },

    // Whispering Woods (Chapter 2)
    whisper1: {
        voice: [`${BASE}/Leo/Lola said there are only old boxes….m4a`],
    },

    whisper2: {
        voice: [
            `${BASE}/Leo/I don${'\u2019'}t like this place.m4a`,
            `${BASE}/Marky/Marky 10.m4a`, // "Don't worry, Leo. A hero is not a coward even when he is terrified. We must locate the Second Star."
            null, // Narrator SFX
        ],
    },

    whisper3: {
        voice: [
            `${BASE}/Leo/What was that_.m4a`,
            null,
            `${BASE}/Leo/It${'\u2019'}s a monster. Run!.m4a`,
            `${BASE}/Marky/Marky 11.m4a`, // "Wait! Listen closely, Leo. It does not look like a nasty growl. That sounds like a..."
            null,
            `${BASE}/Leo/A cry_ It sounds sad.m4a`,
            null,
            null, // Wolf
        ],
        voiceVolume: [1.5, 1, 1, 1, 1, 1, 1, 1], // step 0 "What was that?!" - boost for quieter recording
    },

    whisper4: {
        voice: [
            null, // Narrator
            `${BASE}/Marky/Marky 12.m4a`, // "He isn't a monster, Leo. He is hurt. But he is a wolf... is that bold enough to approach him?"
            `${BASE}/Leo/I${'\u2019'}m not scared. Are you okay, Mr. Wolf_.m4a`,
            null, // Wolf
            `${BASE}/Leo/My Lola says even large animals need assistance….m4a`,
        ],
    },

    whisper4End: {
        voice: [
            null, // Narrator
            null, // Wolf
            `${BASE}/Leo/You${'\u2019'}re welcome! You aren${'\u2019'}t scary at all….m4a`, // "You're welcome! You aren't scary at all. You know, you are pretty fluffy."
            null, // Wolf
            `${BASE}/Marky/Marky 14.m4a`, // "Leo showed Empathy. That means understanding how others feel!"
            null, // Wolf
        ],
    },

    whisper4EndStar: {
        voice: [
            `${BASE}/Marky/Marky 15.m4a`, // "Look! It's the Second Star!"
        ],
    },

    // Gate of Gratitude (Chapter 3)
    clouds1: {
        voice: [
            null,
            `${BASE}/Leo/It${'\u2019'}s… too… hard! I can${'\u2019'}t reach the top!.m4a`,
            `${BASE}/Marky/Marky 16.m4a`, // "Don't give up, Leo! Remember the Star of Order? Do you remember the Star of Kindness? You have come so far. Just one more big push!"
            null,
        ],
        bgm: `${BASE}/gateofgratitude/Strong wind mountains.wav`,
    },

    cloud2Game: {
        bgm: `${BASE}/gateofgratitude/mini game - platform.wav`,
    },

    cloud3: {
        voice: [
            null, // Leo - "The Crystal Door! We made it, Marky!..."
            `${BASE}/Marky/Marky 17.m4a`, // "Look! And there he is the last Star, and merged with the door!"
        ],
    },

    cloud4: {
        voice: [
            `${BASE}/Leo/Hey! Door! Open Up!….m4a`,
            `${BASE}/Leo/I said OPEN UP!.m4a`,
            null, // Stone Guardian - uses SFX instead
            `${BASE}/Leo/But I have already written the other chapters!.m4a`,
            `${BASE}/gateofgratitude/grumpy stone guardian.mp3`, // "Have to? I do not even need to do anything with rude children..."
            `${BASE}/Leo/Oh no… I${'\u2019'}m trapped forever..m4a`,
            `${BASE}/Marky/Marky 18.m4a`, // "Leo, you don't need magic power. You need Word Power. You tell Lola something you want, remember?"
            `${BASE}/Leo/Oh! I know what to do!.m4a`,
            null,
        ],
        stoneGuardianSfx: `${BASE}/gateofgratitude/_WHO IS SHOUTING_ sfx Stone Guardian.wav`,
        sleepingStoneGuardian: `${BASE}/gateofgratitude/Sleeping Stone Guardian.wav`, // plays on Cloud4 load/reload
    },

    cloud5: {
        voice: [
            null, // Step 1: Direction
            null, // Step 2: Choice popup
            `${BASE}/Leo/Excuse me, PO, Mr. Guardian….m4a`, // Step 3: "Excuse me, po, Mr. Guardian? May I speak with you?"
            `${BASE}/gateofgratitude/Happy Stone Guardian.wav`, // Step 4: "Oh? That sounds much better. You used 'Po'. You are a respectful child. What do you need?"
            null, // Step 5: Direction
            null, // Step 6: Choice popup
            `${BASE}/Leo/Pls open the door po.m4a`, // Step 7: "Please open the door, po. I really miss my family."
            `${BASE}/gateofgratitude/Happy Stone Guardian.wav`, // Step 8: "Hmm. You are brave and polite. Very well. The Gate of Gratitude does not open to those who do not know how to ask nicely."
            null, // Steps 9–10: Door opening
            `${BASE}/Marky/Marky 20.m4a`, // Step 11: "You did it, Leo! You used the Magic Words!"
            null, // Step 12: Final Star
        ],
        bgm: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`,
        stoneGuardianCracks: `${BASE}/gateofgratitude/stone guardian cracks.mp3`, // SFX when door opens after step 8
    },

    cloud6: {
        sfx: `${BASE}/gateofgratitude/Tap the star sfx.wav`,
    },

    epilogue1Attic: {
        voice: [
            null, // Step 1: Lola "Leo! Dinner time! Did you wash your hands?"
            `${BASE}/Leo/Opo, Lola! I${'\u2019'}m coming.m4a`, // Step 2: "Opo, Lola! I'm coming!"
            null, // Step 3: Narrator
        ],
        bgm: `${BASE}/bgm/tunetank-medieval-happy-music-412790.mp3`, // plays on Epilogue1Attic load/reload
    },

    cloud6End: {
        voice: [
            null, // Step 0: auto-transition
            `${BASE}/Leo/Wait. I have to say one last thing..m4a`, // Step 1: "Wait. I have to say one last thing."
            `${BASE}/Leo/Thank you. Thank you for helping me..m4a`, // Step 2: "Thank you. Thank you for helping me."
            `${BASE}/Marky/Marky 21.m4a`, // Step 3: "You are welcome, Hero. Goodbye, Leo!"
        ],
    },

    // BGM tracks
    bgm: {
        main: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`,
        kingdom: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`,
        woods: `${BASE}/gateofgratitude/Strong wind mountains.wav`,
        chapter3: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`, // Chapter3Intro through Cloud2Game
        chapter3StrongWind: `${BASE}/gateofgratitude/Strong wind mountains.wav`, // Cloud3 onwards
    },

    // SFX
    sfx: {
        correct: `${BASE}/bgm/SFX - Correct.MP3`,
        incorrect: `${BASE}/bgm/SFX - incorrect.MP3`,
        star: `${BASE}/gateofgratitude/Tap the star sfx.wav`,
        starClick: `${BASE}/bgm/SFX - STAR FRAME 20.MP3`,
    },
};
