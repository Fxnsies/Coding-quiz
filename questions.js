// Question bank for DevDuel: HTML & Python coding quiz
// Points system: Easy (10 pts), Medium (20 pts), Hard (35 pts), Boss (45 pts)

const QUIZ_QUESTIONS = [
  // 1. HTML - Easy (10 pts) [Correct: A / index 0]
  {
    id: 1,
    topic: "HTML",
    difficulty: "Easy",
    points: 10,
    question: "Let's start gentle: What does the acronym 'HTML' actually stand for?",
    code: null,
    filename: null,
    options: [
      "HyperText Markup Language",
      "How To Meet Ladies",
      "Heavy Text Manipulation Linguistics",
      "Hotmail Temporary Markup Logic"
    ],
    correct: 0,
    aiHint: "Hint: It is NOT 'How To Meet Ladies'. If it were, web developers wouldn't spend Friday nights debugging CSS on StackOverflow.",
    roast: "Emotional damage on Question 1?! It's HyperText Markup Language! Even my smart microwave knows this.",
    cheer: "Correct! The foundational brick of the entire internet. You are officially not illiterate!",
    explanation: "HTML stands for HyperText Markup Language. It provides the core structural skeleton for everything on the World Wide Web."
  },

  // 2. Python - Easy (10 pts) [Correct: B / index 1]
  {
    id: 2,
    topic: "PYTHON",
    difficulty: "Easy",
    points: 10,
    question: "What does Python do when you try to multiply a string by an integer?",
    code: `print("dev" * 3)`,
    filename: "repeat.py",
    options: [
      "TypeError: can't multiply string by non-int",
      "devdevdev",
      "dev 3",
      "The CPU starts smoking and notifies your mother"
    ],
    correct: 1,
    aiHint: "Unlike JavaScript, which might try to convert 'dev' into NaN or an existential crisis, Python loves duplicating sequences.",
    roast: "Oof! Python doesn't throw a tantrum when you multiply strings; it just duplicates them like git merge conflicts.",
    cheer: "Spot on! String repetition in Python is clean, unlike your room.",
    explanation: "In Python, the '*' operator on a sequence (like strings or lists) performs repetition, so 'dev' * 3 evaluates to 'devdevdev'."
  },

  // 3. HTML - Easy (10 pts) [Correct: C / index 2]
  {
    id: 3,
    topic: "HTML",
    difficulty: "Easy",
    points: 10,
    question: "What is the modern semantic tag to give text strong importance (not just bold visual weight)?",
    code: `<!-- Choose the semantic standard -->
<p>This warning is <___>critical</___> to read!</p>`,
    filename: "semantics.html",
    options: [
      "<b> (the only tag used since 1995)",
      "<make-it-chunky>",
      "<strong>",
      "<bold-af>"
    ],
    correct: 2,
    aiHint: "Think semantics and accessibility! Screen readers want to know this text has serious importance, not just extra ink.",
    roast: "Wrong! '<strong>' is the modern semantic standard. '<b>' is just visual styling with zero accessibility pride.",
    cheer: "High five! Screen readers everywhere are nodding in approval at your semantic dignity.",
    explanation: "While '<b>' historically styled text bold visually, '<strong>' conveys semantic importance and urgency for screen readers and SEO."
  },

  // 4. Python - Medium (20 pts) [Correct: A / index 0]
  {
    id: 4,
    topic: "PYTHON",
    difficulty: "Medium",
    points: 20,
    question: "What is the truth value of this Python comparison? Don't blink!",
    code: `result = bool([]) == bool([False])
print(result)`,
    filename: "truthy.py",
    options: [
      "False",
      "True",
      "None",
      "SyntaxError: empty list cannot be compared"
    ],
    correct: 0,
    aiHint: "Pay close attention: One list is empty. The other list contains an item, even if that item is literally the word False.",
    roast: "You got trapped! bool([]) is False because it's empty, but bool([False]) is TRUE because the list has 1 item! False == True is False!",
    cheer: "Galaxy brain move! You didn't fall into Python's notorious truthiness snare!",
    explanation: "An empty collection in Python is falsy, so bool([]) is False. But [False] is a non-empty list of length 1, which evaluates to True. Therefore, False == True evaluates to False."
  },

  // 5. HTML - Medium (20 pts) [Correct: D / index 3]
  {
    id: 5,
    topic: "HTML",
    difficulty: "Medium",
    points: 20,
    question: "Which HTML5 input attribute provides native browser email syntax validation without custom regex?",
    code: `<form>
  <input _____ required>
  <button type="submit">Submit</button>
</form>`,
    filename: "form.html",
    options: [
      "type=\"text\" with a prayer in comments",
      "type=\"electronic-letter\"",
      "type=\"mail\"",
      "type=\"email\""
    ],
    correct: 3,
    aiHint: "It's literally 5 letters long and rhymes with 'female'.",
    roast: "Nope! It's simply type=\"email\". Please tell me you don't write 80-line regexes when HTML5 already does it natively.",
    cheer: "Correct! Browser native validation saves you from writing buggy 400-character regex monstrosities.",
    explanation: "HTML5 introduced type='email' which uses browser-native validation matching standard email pattern syntax before submission."
  },

  // 6. Python - Medium (20 pts) [Correct: B / index 1]
  {
    id: 6,
    topic: "PYTHON",
    difficulty: "Medium",
    points: 20,
    question: "What does this classic 'Python mutable default argument' function print?",
    code: `def add_item(item, box=[]):
    box.append(item)
    return box

print(add_item("🍎"))
print(add_item("🍌"))`,
    filename: "mutable_trap.py",
    options: [
      "['🍎'] then ['🍌']",
      "['🍎'] then ['🍎', '🍌']",
      "['🍎'] then None",
      "['🍎', '🍌'] both times"
    ],
    correct: 1,
    aiHint: "Default arguments in Python are evaluated ONCE when the function definition is executed, NOT every time you call it!",
    roast: "Boom! You just stepped on Python's #1 rite of passage trap! The default list is shared across all function calls!",
    cheer: "Masterclass! You know about Python's mutable default trap! Many senior devs have cried over this in production.",
    explanation: "Python default parameter values are created once at definition time. The list 'box' persists across subsequent calls, accumulating items."
  },

  // 7. HTML - Medium (20 pts) [Correct: C / index 2]
  {
    id: 7,
    topic: "HTML",
    difficulty: "Medium",
    points: 20,
    question: "You want an image to load lazily to speed up initial page render. What modern native HTML attribute do you use?",
    code: `<img src="giant-cat-meme.png" alt="A good boy" _____>`,
    filename: "performance.html",
    options: [
      "lazy=\"true\"",
      "fetch=\"when-you-feel-like-it\"",
      "loading=\"lazy\"",
      "defer=\"image\""
    ],
    correct: 2,
    aiHint: "The attribute name is 'loading', and you are feeling rather unhurried...",
    roast: "Negative! It's loading=\"lazy\". No external npm package or IntersectionObserver required anymore!",
    cheer: "Nice! Modern browsers support native loading=\"lazy\". Your mobile users' data plans thank you.",
    explanation: "The native 'loading=\"lazy\"' attribute tells the browser to defer loading the image until it nears the viewport."
  },

  // 8. Python - Hard (35 pts) [Correct: A / index 0]
  {
    id: 8,
    topic: "PYTHON",
    difficulty: "Hard",
    points: 35,
    question: "What is printed by this sneaky slice assignment?",
    code: `nums = [1, 2, 3, 4, 5]
nums[1:4] = [99]
print(nums)`,
    filename: "slices.py",
    options: [
      "[1, 99, 5]",
      "[1, 99, 99, 99, 5]",
      "[1, [99], 5]",
      "ValueError: slice assignment length mismatch"
    ],
    correct: 0,
    aiHint: "Slice assignment replaces the entire sub-slice range [index 1 up to index 4) with the contents of the right-hand list, resizing it in-place!",
    roast: "Gotcha! Slices don't require equal lengths! nums[1:4] removes [2, 3, 4] and inserts [99], leaving [1, 99, 5].",
    cheer: "Impressive! Slice replacement doesn't need matching lengths. You handled that like a core developer.",
    explanation: "Slice assignment nums[1:4] = [99] replaces elements at indices 1, 2, and 3 with the single element 99, mutating and shrinking the list."
  },

  // 9. HTML - Hard (35 pts) [Correct: B / index 1]
  {
    id: 9,
    topic: "HTML",
    difficulty: "Hard",
    points: 35,
    question: "Which <meta> tag configuration is mandatory in responsive HTML documents to prevent mobile browsers from rendering at desktop zoom scale?",
    code: `<meta name="viewport" content="_____">`,
    filename: "meta.html",
    options: [
      "scale=auto, responsive=true",
      "width=device-width, initial-scale=1.0",
      "mobile=yes, zoom=normal",
      "display=flex, overflow=hidden"
    ],
    correct: 1,
    aiHint: "Look at the standard boilerplate created whenever you type '! + Tab' in VS Code.",
    roast: "Denied! Without 'width=device-width, initial-scale=1.0', phones assume your website is built for a 980px desktop monitor and zoom out into oblivion.",
    cheer: "Nailed it! That line has been copy-pasted into billions of websites since the birth of smartphones.",
    explanation: "The viewport meta tag 'width=device-width, initial-scale=1.0' sets the width of the viewport to match the device screen width at 1:1 scale."
  },

  // 10. Python - Hard (40 pts) [Correct: C / index 2]
  {
    id: 10,
    topic: "PYTHON",
    difficulty: "Hard",
    points: 40,
    question: "Look closely at `is` vs `==` with integers. What will this script print in standard CPython?",
    code: `a = 256
b = 256
print(a is b)

x = 257
y = 257
print(x is y)`,
    filename: "cpython_cache.py",
    options: [
      "True then True",
      "False then False",
      "True then False (in separate evaluations)",
      "TypeError: cannot check identity on primitives"
    ],
    correct: 2,
    aiHint: "CPython maintains an internal small integer singleton cache for numbers between -5 and 256!",
    roast: "Tricked by CPython internals! CPython pre-allocates an integer cache for -5 to 256. 256 shares the same object, but 257 gets distinct objects!",
    cheer: "LEGENDARY! You know about CPython's integer intern cache (-5 to 256)! Your nerd level is over 9000!",
    explanation: "CPython caches integer objects in the range [-5, 256]. Thus '256 is 256' is True because they reference the exact same memory address. For 257, new objects are allocated."
  },

  // 11. HTML / Web - Boss Level (45 pts) [Correct: D / index 3]
  {
    id: 11,
    topic: "HTML",
    difficulty: "Boss",
    points: 45,
    question: "What is the crucial performance difference between `<script async>` and `<script defer>`?",
    code: `<script src="analytics.js" async></script>
<script src="app.js" defer></script>`,
    filename: "scripts.html",
    options: [
      "async executes in order after DOM parsing; defer fires whenever it wants",
      "defer is deprecated in HTML5 and does nothing in modern Chrome",
      "There is no difference; they were created to spark Twitter flame wars",
      "defer executes in HTML order after DOM parsing completes; async executes immediately upon download, interrupting HTML parsing"
    ],
    correct: 3,
    aiHint: "One guarantees script execution order and waits for HTML parsing to finish. The other is a rogue cowboy that executes the microsecond it finishes downloading.",
    roast: "Defeated by script loading! 'defer' waits for DOM parsing and executes in script tag order. 'async' executes immediately upon download and pauses parsing!",
    cheer: "GOD-TIER WEB MASTERY! Understanding script loading attributes separates frontend junior devs from real web engineers.",
    explanation: "'defer' downloads in parallel and executes scripts in DOM order only after the HTML document is parsed. 'async' executes immediately when ready, which can interrupt parsing and ignore order."
  },

  // 12. Python - Boss Level (45 pts) [Correct: B / index 1]
  {
    id: 12,
    topic: "PYTHON",
    difficulty: "Boss",
    points: 45,
    question: "Final Boss Question: What does this devilish tuple syntax expression produce?",
    code: `x = (1)
y = (1,)
print(type(x) == type(y), len(y))`,
    filename: "tuples.py",
    options: [
      "True 1",
      "False 1",
      "True 2",
      "SyntaxError: invalid trailing comma"
    ],
    correct: 1,
    aiHint: "Parentheses without a comma are just grouping operators in math, NOT a tuple!",
    roast: "The comma caught you! (1) is just the int 1 in parentheses. (1,) is a tuple of length 1. So int != tuple -> False 1!",
    cheer: "ABSOLUTE PERFECTION! You conquered the Final Boss! A single comma made all the difference, and you caught it!",
    explanation: "In Python, parentheses alone do not create a single-element tuple; the trailing comma is what defines it. Thus type((1)) is 'int', while type((1,)) is 'tuple'."
  }
];

// Funny ranks based on final score (Max score = 310)
const QUIZ_RANKS = [
  {
    minScore: 280,
    rank: "⚡ 10x Full-Stack Demi-God",
    badgeClass: "rank-god",
    title: "Pull Request Auto-Approved!",
    description: "You speak fluent CPython bytecode, recite HTML5 specs in your sleep, and can center a <div> on IE6 using purely telepathic energy. StackOverflow moderators ask YOU for advice."
  },
  {
    minScore: 210,
    rank: "☕ Senior Caffeine Addict",
    badgeClass: "rank-senior",
    title: "Production Deployer",
    description: "Impressive! You actually know how mutable defaults, script execution, and truthiness work. You still Google 'git rebase' in an incognito window, but nobody needs to know."
  },
  {
    minScore: 130,
    rank: "📋 StackOverflow Copy-Paster",
    badgeClass: "rank-mid",
    title: "Certified Ctrl+C / Ctrl+V Engineer",
    description: "Not bad! Your code runs, which is more than we can say for most enterprise software. Just remember: a comma in Python is not just decoration, and HTML does matter!"
  },
  {
    minScore: 0,
    rank: "🐣 Intern on Day 1",
    badgeClass: "rank-intern",
    title: "Console.log('Help Me')",
    description: "Oof! The bugs had a feast today. But hey, even Guido van Rossum and Tim Berners-Lee had to start somewhere. Go grab some coffee, review the answers, and try again!"
  }
];
