// app.js — 广州初中英语 · 沪教版 (艾宾浩斯算法版 - 增强诊断版)
(function() {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // --- 调试工具 ---
  function showErrorToUI(msg, error) {
    let errDiv = $("#debug-error");
    if (!errDiv) {
      errDiv = document.createElement('div');
      errDiv.id = 'debug-error';
      errDiv.style = "position:fixed;top:0;left:0;width:100%;background:rgba(255,0,0,0.9);color:white;z-index:9999;padding:15px;font-family:monospace;font-size:12px;overflow:auto;max-height:40%;";
      document.body.prepend(errDiv);
    }
    errDiv.innerHTML = `<strong style="font-size:16px">❌ App Error:</strong><br>${msg}<br><hr><pre style="white-space:pre-wrap;word-break:break-all;">${error?.stack || error}</pre>`;
    console.error("App Error:", msg, error);
  }

  // --- 艾宾浩斯算法配置 ---
  const EB_INTERVALS = [0, 1, 2, 4, 7, 15, 30]; 

  // --- 状态管理 ---
  let state = {
    currentGrade: "7A",
    currentUnit: null,
    mode: "word",
    progress: 0,
    reviewQueue: [],
    currentWordList: [],
    currentIndex: 0,
    currentWord: null
  };

  let memoryMap = {};

  // --- 初始化 ---
  document.addEventListener('DOMContentLoaded', () => {
    try {
      if (typeof WORDS === 'undefined') {
        throw new Error("WORDS (words.js) 未能成功加载！请检查网络或文件路径。");
      }
      loadMemory();
      initTabs();
      initModeSwitch();
      updateProgressDisplay();
      console.log("App initialized successfully");
    } catch (e) {
      showErrorToUI("初始化失败", e);
    }
  });

  function loadMemory() {
    const saved = localStorage.getItem('guangzhou_eng_memory');
    if (saved) {
      try { memoryMap = JSON.parse(saved); } catch (e) { memoryMap = {}; }
    }
  }

  function saveMemory() {
    try { localStorage.setItem('guangzhou_eng_memory', JSON.stringify(memoryMap)); } catch (e) { console.error(e); }
  }

  // --- UI 逻辑 ---
  function initTabs() {
    const tabs = $("#grade-tabs");
    if (!tabs) return;
    tabs.innerHTML = '';
    const grades = Object.keys(WORDS).sort();
    grades.forEach(g => {
      const btn = document.createElement('button');
      btn.innerText = g;
      btn.onclick = () => setGrade(g);
      if (g === state.currentGrade) btn.classList.add('on');
      tabs.appendChild(btn);
    });
  }

  function initModeSwitch() {
    const btnWord = $("#btn-word");
    const btnGrammar = $("#btn-grammar");
    if (btnWord) btnWord.onclick = () => setMode('word');
    if (btnGrammar) btnGrammar.onclick = () => setMode('grammar');
  }

  function setGrade(g) {
    state.currentGrade = g;
    state.currentUnit = null;
    $$("#grade-tabs button").forEach(b => {
      b.classList.toggle('on', b.innerText === g);
    });
    renderUnitSelector();
    renderMain();
  }

  function setMode(m) {
    state.mode = m;
    $("#btn-word").classList.toggle('on', m === 'word');
    $("#btn-grammar").classList.toggle('on', m === 'grammar');
    renderMain();
  }

  function setUnit(u) {
    try {
      state.currentUnit = u;
      $$(".sel-btn").forEach(b => {
        const btnUnit = b.dataset.unit;
        b.classList.toggle('on', String(btnUnit) === String(u));
      });
      prepareQueue();
      renderMain();
    } catch (e) {
      showErrorToUI("切换单元失败", e);
    }
  }

  // --- 数据处理 ---
  function prepareQueue() {
    try {
      let allWordsData = WORDS[state.currentGrade] || [];
      const targetUnit = String(state.currentUnit);
      
      // 兼容逻辑：处理 7A (Array) 和 9A (Object) 的差异
      let targetWords = [];
      if (Array.isArray(allWordsData)) {
        targetWords = allWordsData;
      } else if (typeof allWordsData === 'object' && allWordsData !== null) {
        targetWords = allWordsData[targetUnit] || [];
      }

      // 过滤并识别属于本单元的单词 (基于 u 字段)
      const unitWords = targetWords.filter(w => {
        const wu = String(w.u);
        return wu === targetUnit || wu.includes(targetUnit);
      });
      
      const now = Date.now();
      const reviewList = [];
      const learningList = [];

      unitWords.forEach(word => {
        const key = `${state.currentGrade}_${word.u}_${word.w}`;
        const mem = memoryMap[key];
        if (mem && mem.nextReview <= now) {
          reviewList.push(word);
        } else {
          learningList.push(word);
        }
      });

      const shuffledReview = reviewList.sort(() => Math.random() - 0.5);
      const shuffledLearning = learningList.sort(() => Math.random() - 0.5);
      
      state.reviewQueue = [...shuffledReview, ...shuffledLearning];
      state.currentWordList = [...state.reviewQueue];
      state.currentIndex = 0;
      state.currentWord = state.currentWordList.length > 0 ? state.currentWordList[0] : null;
      
      const masteredCount = unitWords.filter(w => {
        const key = `${state.currentGrade}_${w.u}_${w.w}`;
        return memoryMap[key] && memoryMap[key].level > 0;
      }).length;
      
      state.progress = unitWords.length > 0 ? (masteredCount / unitWords.length) * 100 : 0;
      updateProgressDisplay();
    } catch (e) {
      showErrorToUI("准备队列时崩溃", e);
    }
  }

  function getNextWord() {
    if (state.currentIndex >= 0 && state.currentIndex < state.currentWordList.length) {
      return state.currentWordList[state.currentIndex];
    }
    return null;
  }

  // --- 渲染逻辑 ---
  function renderUnitSelector() {
    const area = $("#unit-selector");
    if (!area) return;
    area.innerHTML = '';
    
    try {
      let allWordsData = WORDS[state.currentGrade] || [];
      const units = [];

      // 兼容逻辑：提取单元号
      if (Array.isArray(allWordsData)) {
        const unitSet = new Set(allWordsData.map(w => w.u).filter(u => u !== undefined && u !== null));
        unitSet.forEach(u => units.push(String(u)));
      } else if (typeof allWordsData === 'object' && allWordsData !== null) {
        Object.keys(allWordsData).forEach(u => units.push(u));
      }

      units.sort((a, b) => {
        const na = parseInt(String(a).replace(/[^0-9]/g, '')) || 0;
        const nb = parseInt(String(b).replace(/[^0-9]/g, '')) || 0;
        return na - nb;
      });
      
      if (units.length === 0) {
        area.innerHTML = '<p style="color:var(--text-sub); font-size:14px;">暂无单词数据</p>';
        return;
      }

      units.forEach(u => {
        const btn = document.createElement('button');
        btn.className = 'sel-btn';
        btn.innerText = `U${u}`;
        btn.dataset.unit = u;
        btn.onclick = (e) => {
          e.preventDefault();
          setUnit(u);
        };
        if (String(state.currentUnit) === String(u)) btn.classList.add('on');
        area.appendChild(btn);
      });
    } catch (e) {
      showErrorToUI("渲染单元区域崩溃", e);
    }
  }

  function renderMain() {
    const pane = $("#main-pane");
    if (!pane) return;
    pane.innerHTML = '';

    if (!state.currentUnit) {
      pane.innerHTML = `
        <div class="empty-state animate-pop">
          <div class="empty-icon">👋</div>
          <p>请从上方选择一个单元开始学习吧！</p>
        </div>`;
      return;
    }

    if (state.mode === 'word') {
      renderWordCard(pane);
    } else {
      renderGrammarCard(pane);
    }
  }

  function renderWordCard(pane) {
    try {
      const word = getNextWord();

      if (!word) {
        pane.innerHTML = `
          <div class="card animate-pop" style="padding: 40px 20px; text-align:center;">
            <div style="font-size: 50px; margin-bottom: 15px;">🎉</div>
            <h3 style="margin:0">学习完成！</h3>
            <p style="color:var(--text-sub)">本单元单词已全部完成复习</p>
            <button onclick="location.reload()" style="margin-top:20px; background:var(--primary); color:white; border:none; padding:10px 25px; border-radius:50px; font-weight:700;">重新开始</button>
          </div>`;
        return;
      }

      const key = `${state.currentGrade}_${word.u}_${word.w}`;
      const mem = memoryMap[key] || { level: 0, nextReview: 0 };

      const card = document.createElement('div');
      card.className = 'card word-card animate-pop';
      
      const displayW = word.w || "???";
      const displayP = word.p || "";
      const displayM = word.m || "";
      const displayE = (Array.isArray(word.e) && word.e.length > 0) ? word.e[0] : "暂无例句";
      
      card.innerHTML = `
        <span class="w">${displayW}</span>
        <span class="p">${displayP}</span>
        <span class="m">${displayM}</span>
        <div class="example">${displayE}</div>
        <div style="font-size:12px; color:var(--text-sub); margin-top:10px; text-align:center;">
          进度: ${state.currentIndex + 1} / ${state.currentWordList.length}
        </div>
        <div style="margin-top:20px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
          <button id="btn-prev" class="action-btn" style="background:#95a5a6; color:white; border:none; padding:8px 15px; border-radius:50px; font-weight:700;">上一个</button>
          <button id="btn-wrong" class="action-btn" style="background:#ff6b6b; color:white; border:none; padding:8px 15px; border-radius:50px; font-weight:700;">记不住 ❌</button>
          <button id="btn-right" class="action-btn" style="background:#4ecdc4; color:white; border:none; padding:8px 15px; border-radius:50px; font-weight:700;">掌握了 ✅</button>
          <button id="btn-next" class="action-btn" style="background:#95a5a6; color:white; border:none; padding:8px 15px; border-radius:50px; font-weight:700;">下一个</button>
        </div>
      `;
      pane.appendChild(card);

      const moveNext = () => {
        if (state.currentIndex < state.currentWordList.length - 1) {
          state.currentIndex++;
        }
        renderMain(); 
      };

      const movePrev = () => {
        if (state.currentIndex > 0) {
          state.currentIndex--;
        }
        renderMain();
      };

      card.querySelector("#btn-prev").onclick = movePrev;
      card.querySelector("#btn-next").onclick = moveNext;

      card.querySelector("#btn-wrong").onclick = () => {
        mem.level = Math.max(0, mem.level - 1);
        mem.nextReview = Date.now() + (24 * 60 * 60 * 1000); 
        memoryMap[key] = mem;
        saveMemory();
        renderMain();
      };

      card.querySelector("#btn-right").onclick = () => {
        mem.level = Math.min(6, mem.level + 1);
        const days = EB_INTERVALS[mem.level];
        mem.nextReview = Date.now() + (days * 24 * 60 * 60 * 1000);
        memoryMap[key] = mem;
        saveMemory();

        const allWords = WORDS[state.currentGrade] || [];
        // 兼容查找逻辑
        let unitWords = [];
        if (Array.isArray(allWords)) {
            unitWords = allWords.filter(w => String(w.u) === String(state.currentUnit) || String(w.u).includes(String(state.currentUnit)));
        } else {
            unitWords = allWords[state.currentUnit] || [];
        }

        const newMasteredCount = unitWords.filter(w => {
          const k = `${state.currentGrade}_${w.u}_${w.w}`;
          return memoryMap[k] && memoryMap[k].level > 0;
        }).length;
        state.progress = unitWords.length > 0 ? (newMasteredCount / unitWords.length) * 100 : 0;
        updateProgressDisplay();

        moveNext();
      };

    } catch (e) {
      showErrorToUI("渲染单词卡片时崩溃", e);
    }
  }

  function renderGrammarCard(pane) {
    pane.innerHTML = `
      <div class="card animate-pop">
        <h3 style="color:var(--primary)">语法学习</h3>
        <p style="font-size:15px; color:var(--text-sub)">正在加载 ${state.currentGrade} U${state.currentUnit} 的知识点...</p>
        <div class="example" style="margin-top:15px;">💡 语法重点加载中...</div>
      </div>`;
  }

  function updateProgressDisplay() {
    const progressEl = $("#progress-bar");
    const dayProgressEl = $("#day-progress");
    if (progressEl) progressEl.style.width = (state.progress || 0) + '%';
    if (dayProgressEl) dayProgressEl.innerText = Math.round(state.progress || 0) + '%';
  }

})();