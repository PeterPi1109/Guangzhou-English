// ---------------------------------------------------------------------------
// data/grammar.js — 语法知识点集合（供 app.js-mode="grammar" 调用）
// ---------------------------------------------------------------------------
const GRAMMAR = {
  "一般现在时": {
    title: "一般现在时 (Simple Present Tense)",
    desc: "表示经常性、习惯性的动作或客观事实。",
    rules: [
      "第三人称单数 (he/she/it) 的动词加 -s 或 -es。",
      "be 动词用 am/is/are。",
      "否定形式：don't / doesn't + 动词原形。",
      "疑问形式：Do / Does + 主语 + 动词原形？",
      "常见时间状语：always, usually, often, every day, sometimes 等。"
    ],
    example: [
      "She goes to school every day.",
      "He doesn't like pears.",
      "Do you play football?"
    ],
    note: "第三人称单数动词变形规则：一般加 -s，如 works；以 s/x/ch/sh/o 结尾加 -es，如 watches, goes；辅音+y 结尾变 y 为 i 再加 -es，如 studies。"
  },
  "be动词": {
    title: "be 动词 (am / is / are / was / were)",
    desc: "表示主语的身份、特征、状态或地点。",
    rules: [
      "I → am；He/She/It → is；You/We/They → are。",
      "否定形式: am not / isn't / aren't。",
      "一般疑问句: 把 be 提到主语前面 (Is he...? Are they...?)。",
      "过去式: was (第一、三人称单数) / were (第二人称及复数)。",
      "There be 句型: There is / There are 表示‘有’。"
    ],
    example: [
      "I am a student.",
      "She is my friend.",
      "They are not at home.",
      "There is a cat in the room."
    ],
    note: "be 动词不可单独作实义动词使用；表存在时用 There be，而非 have。"
  },
  "情态动词": {
    title: "情态动词 can / should / must",
    desc: "can 表示能力或可能性，should 表示建议或义务，must 表示必须。",
    rules: [
      "情态动词后接动词原形，不能单独作谓语。",
      "没有人称和数的变化 (He can, not He cans)。",
      "can 的否定: can't；疑问: Can ...?",
      "should 的否定: shouldn't；表示‘应该’。",
      "must 的否定: mustn't (禁止)；must 表示‘必须’。",
      "情态动词没有时态变化，过去意义常借助 could / should have done。"
    ],
    example: [
      "I can swim.",
      "She can't speak Japanese.",
      "You should do your homework.",
      "He shouldn't eat too much.",
      "You mustn't park here."
    ],
    note: "情态动词有时可表示推测：He must be tired. (他肯定累了。) / It may rain. (可能下雨。)"
  },
  "There_be": {
    title: "There be 句型",
    desc: "表示‘某处有某物/某人’，强调存在。",
    rules: [
      "There is + 单数或不可数名词；There are + 复数名词。",
      "就近原则: There is a book and two pencils on the desk. (is 跟第一个名词一致)",
      "否定: There isn't / There aren't。",
      "疑问: Is there...? / Are there...?",
      "常与 some, any, no, many, much, a lot of 连用。"
    ],
    example: [
      "There is a cat in the room.",
      "There are many flowers in spring.",
      "Is there any milk in the fridge?",
      "There isn't a bus stop near here."
    ],
    note: "There be 与 have/has 的区别: There be 表示‘存在’，have 表示‘拥有’。"
  },
  "一般疑问句": {
    title: "一般疑问句与特殊疑问句",
    desc: "一般疑问句(boolean question) 期待 Yes/No 回答；特殊疑问句以疑问词开头。",
    rules: [
      "一般疑问句: be 动词或助动词 (do/does/did/will/shall) 提前。",
      "回答必须用 Yes/No + 主语 + 对应形式。",
      "特殊疑问词: what, where, who, when, why, how, which。",
      "how 常与形容词/副词搭配: how old, how many, how much, how often, how long。",
      "回答不能只用 Yes/No，必须给出具体信息。"
    ],
    example: [
      "Are you a student? — Yes, I am.",
      "Where do you live? — I live in Guangzhou.",
      "How old are you? — I'm thirteen.",
      "What is your favourite colour? — I like red."
    ],
    note: "‘Who is that boy?’ 回答可以是 ‘He is my brother.’ 或简略 ‘My brother.’"
  },
  "主谓一致": {
    title: "主谓一致 (Subject-Verb Agreement)",
    desc: "谓语动词在人称和数上必须与主语保持一致。",
    rules: [
      "单数第三人称现在时动词加 -s/-es。",
      "and 连接的并列主语通常看作复数 (Tom and Jerry are... )。",
      "each, every, no one, nobody, everybody 等作主语时，谓语用单数。",
      "以 -s 结尾的名词(news, maths, physics)作主语时，谓语用单数。",
      "there be 句型中，be 跟靠近它的主语一致(就近原则)。"
    ],
    example: [
      "He likes music. / They like music.",
      "Every student has a book.",
      "Maths is my favourite subject.",
      "There is a book and two pens on the desk."
    ],
    note: "以 ex, class, family, team 等集体名词作主语，看作整体时用单数，看作个体时用复数。"
  },
  "名词的数": {
    title: "名词的单复数 (Singular & Plural)",
    desc: "可数名词有单复数形式，不可数名词没有复数形式。",
    rules: [
      "一般情况下加 -s: book → books, dog → dogs。",
      "以 s, x, ch, sh 结尾加 -es: bus → buses, box → boxes, watch → watches。",
      "以辅音字母 + y 结尾的，变 y 为 i 加 -es: city → cities, baby → babies。",
      "以 f/fe 结尾的，常变 f/fe 为 v 加 -es: leaf → leaves, knife → knives (个别仍加 -s: roof → roofs)。",
      "不规则变化: child → children, man → men, woman → women, foot → feet, tooth → teeth。",
      "不可数名词(milk, rice, water, homework) 无复数，谓语用单数。"
    ],
    example: [
      "I have two apples.",
      "There are many children in the park.",
      "The leaves turn yellow in autumn.",
      "Some water is in the bottle."
    ],
    note: "表示‘一些’时可用 some 修饰可数/不可数，any 常用于否定和疑问。"
  },
  "冠词": {
    title: "冠词 (a, an, the)",
    desc: "不定冠词 a/an 表示‘一个’泛指；定冠词 the 表示特指。",
    rules: [
      "a 用在辅音音素前: a book, a dog。an 用在元音音素前: an apple, an hour。",
      "第一次提到的单数可数名词用 a/an。",
      "第二次提到或说话双方都明确的，用 the。",
      "表示类别时可用零冠词(复数或不可数): Cats are cute. / Water is important。",
      "某些固定结构中不用冠词: by bus, at school, go home。"
    ],
    example: [
      "I have a book. The book is new.",
      "She is an English teacher.",
      "Cats are lovely animals.",
      "He goes to school by bus."
    ],
    note: "元音音素原则: an hour (h 不发音), a university (u 读作辅音 /j/)。"
  },
  "形容词和副词": {
    title: "形容词和副词的比较级/最高级",
    desc: "形容词修饰名词，副词修饰动词/形容词/副词；多数可比较。",
    rules: [
      "一般词尾加 -er / -est: tall → taller → tallest。",
      "重叠或多音节词用 more / most: beautiful → more beautiful → most beautiful。",
      "不规则变化: good/well → better → best；bad → worse → worst。",
      "副词比较级: fast → faster → fastest；slowly → more slowly。",
      "比较级常用 than，最高级常用 the。"
    ],
    example: [
      "Tom is taller than Mike.",
      "She is the most beautiful girl in my class.",
      "He runs faster than me.",
      "This is the best book I've ever read."
    ],
    note: "more/most 也可用于某些双音节词: more careful, most careful。"
  },
  "现在进行时": {
    title: "现在进行时 (Present Continuous Tense)",
    desc: "表示正在进行的动作。",
    rules: [
      "构成: be (am/is/are) + 动词的现在分词 (v.-ing)。",
      "否定: am/is/are not + v.-ing。",
      "疑问: 把 be 提前。",
      "常与 now, at the moment, look!, listen! 等连用。",
      "有些动词(如 like, want, know, believe)一般不用于进行时。"
    ],
    example: [
      "I am doing my homework now.",
      "She is reading a book.",
      "They are not playing football.",
      "Are you watching TV?"
    ],
    note: "现在进行时还可表示将来安排好的动作: We are leaving tomorrow."
  },
  "一般过去时": {
    title: "一般过去时 (Simple Past Tense)",
    desc: "表示过去某个时间发生的动作或状态。",
    rules: [
      "规则动词加 -ed: walk → walked, play → played。",
      "不规则动词须记忆: go → went, have → had, be → was/were, do → did。",
      "否定: didn't + 动词原形。",
      "疑问: Did + 主语 + 动词原形？",
      "常见时间状语: yesterday, last week, ... ago, in 2020, just now。"
    ],
    example: [
      "I went to school yesterday.",
      "She didn't do her homework.",
      "Did you see the film last night?",
      "I was at home an hour ago."
    ],
    note: "was/were 是 be 动词的过去式，不由 -ed 构成。"
  },
  "祈使句": {
    title: "祈使句 (Imperative Sentences)",
    desc: "表示命令、请求、建议、警告等。",
    rules: [
      "以动词原形开头: Open the door. Sit down.",
      "否定: Don't + 动词原形: Don't run. Don't eat in class.",
      "主语 you 常省略，有时加 please 表示礼貌。",
      "Let's + 动词原形 表示建议: Let's go. Let's play a game.",
      "Let me + 动词原形 表示请求: Let me help you."
    ],
    example: [
      "Open the window, please.",
      "Don't be late.",
      "Let's start the class.",
      "Let me carry the bag for you."
    ],
    note: "祈使句感叹号结尾较强语气，句号可表示较温和的请求。"
  },
};

// 按年级/学期提示的语法范围（供前端筛选/高亮用）
const GRAMMAR_BY_GRADE = {
  "7A": ["一般现在时", "be动词", "情态动词", "There_be", "一般疑问句"],
  "7B": ["主谓一致", "名词的数", "冠词", "形容词和副词"],
  "8A": ["现在进行时", "一般过去时", "祈使句"],
  "8B": ["一般将来时", "过去进行时"],
  "9A": ["现在完成时", "被动语态"],
  "9B": ["定语从句", "宾语从句", "条件状语从句"],
};
