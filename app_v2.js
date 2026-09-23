(function() {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    const getVal = (obj, key) => {
        if (!obj) return "";
        const mapping = { 'word': 'w', 'phonetic': 'p', 'meaning': 'm', 'type': 't', 'example': 'e' };
        const shortKey = mapping[key];
        if (obj[key] !== undefined && obj[key] !== null) return obj[key];
        if (shortKey && obj[shortKey] !== undefined && obj[shortKey] !== null) return obj[shortKey];
        return "";
    };

    function flattenData(input) {
        const result = [];
        const stack = [input];
        while (stack.length > 0) {
            const current = stack.pop();
            if (Array.isArray(current)) {
                for (let i = current.length - 1; i >= 0; i--) stack.push(current[i]);
            } else if (typeof current === 'object' && current !== null) {
                if (current.w !== undefined || current.word !== undefined) {
                    result.push(current);
                } else {
                    const keys = Object.keys(current).sort().reverse();
                    for (let i = 0; i < keys.length; i++) stack.push(current[keys[i]]);
                }
            }
        }
        return result;
    }

    function formatGrammarContent(item) {
        if (!item) return "";
        // item is the whole grammar object for one topic
        const desc = item.desc || item.description || "";
        const content = item.content || item.body || item.rules || ""; // Fallback to rules if content is missing
        
        let html = desc ? `<p style="color:#888; margin-bottom:15px; font-size:16px; line-height:1.5;">${desc}</p>` : "";
        
        if (Array.isArray(content)) {
            html += `<ul style="text-align:left; line-height:1.8; font-size:16px;">${content.map(r => `<li style="margin-bottom:10px;">${r}</li>`).join('')}</ul>`;
        } else if (typeof content === 'string' && content.length > 0) {
            html += `<div style="text-align:left; line-height:1.6; font-size:16px;">${content}</div>`;
        }
        
        // Add note if exists
        if (item.note) {
            html += `<div style="margin-top:20px; padding:12px; background:#f0f7ff; border-radius:8px; border-left:4px solid var(--primary); font-size:15px; color:#444;"><span style="font-weight:700; color:var(--primary);">💡 笔记:</span> ${item.note}</div>`;
        }
        
        // Add examples if exists
        if (item.example && Array.isArray(item.example) && item.example.length > 0) {
            html += `<div style="margin-top:20px;"><p style="font-weight:700; font-size:15px; color:#666;">📝 例句:</p><ul style="text-align:left; color:#555; font-style:italic;">${item.example.map(ex => `<li>${ex}</li>`).join('')}</ul></div>`;
        }
        
        return html;
    }

    const state = { mode: 'word', currentUnit: null, words: [], currentIndex: 0, grammarList: [], grammarIndex: 0, patternList: [] };

    function renderMenu() {
        const app = $('#app');
        if (!app) return;
        app.innerHTML = `
            <div class="wrap">
                <div class="hd"><div class="hd-t"><span style="font-size:28px; font-weight:800; color:var(--primary);">广州英语学习</span><small>轻量高效 · 助力成长</small></div></div>
                <div class="main-content" style="margin-top:40px;">
                    <div class="mode-switch" style="display:flex; justify-content:center; gap:12px; margin-bottom:40px;">
                        <button class="mode-pill on" data-mode="word">📖 单词</button>
                        <button class="mode-pill" data-mode="grammar">✍️ 语法</button>
                        <button class="mode-pill" data-mode="pattern">💡 规律</button>
                    </div>
                    <div style="text-align:center; color:#888; font-size:14px;">请选择一个模式开始学习</div>
                </div>
            </div>`;
        $$('.mode-pill').forEach(btn => {
            btn.onclick = () => {
                $$('.mode-pill').forEach(b => b.classList.remove('on'));
                btn.classList.add('on');
                state.mode = btn.dataset.mode;
                if (state.mode === 'grammar' || state.mode === 'pattern') {
                    startMode();
                } else {
                    renderModeSelector();
                }
            };
        });
    }

    function renderModeSelector() {
        const app = $('#app');
        if (!app) return;
        app.innerHTML = `
            <div class="wrap">
                <div class="hd"><div class="hd-t"><button id="btn-back" style="background:none; border:none; color:var(--primary); font-weight:700; cursor:pointer; margin-bottom:10px;">⬅ 返回菜单</button><span style="font-size:22px; font-weight:700;">请选择年级</span></div></div>
                <div class="selector-area">
                    ${Object.keys(WORDS).sort().map(u => `<button class="sel-btn sel-btn-h" data-unit="${u}">${u}</button>`).join('')}
                </div>
            </div>`;
        $('#btn-back').onclick = renderMenu;
        $$('.sel-btn').forEach(btn => { btn.onclick = () => { state.currentUnit = btn.dataset.unit; startMode(); }; });
    }

    function startMode() {
        const app = $('#app');
        app.innerHTML = '<div class="empty-state"><span class="empty-icon">🌀</span>正在加载数据...</div>';
        setTimeout(() => {
            try {
                if (state.mode === 'word') {
                    const unitData = WORDS[state.currentUnit];
                    if (!unitData) throw new Error("该单元不存在");
                    state.words = flattenData(unitData);
                    state.currentIndex = 0;
                    if (state.words.length === 0) throw new Error("该单元暂无单词");
                    renderWordCard();
                } else if (state.mode === 'grammar') {
                    const allGrammar = [];
                    Object.keys(GRAMMAR).forEach(key => {
                        const data = GRAMMAR[key];
                        if (Array.isArray(data)) {
                            data.forEach(item => allGrammar.push(item));
                        } else {
                            // IMPORTANT: We pass the object itself as the item, including its title, desc, rules, etc.
                            allGrammar.push({ title: data.title || key, ...data });
                        }
                    });
                    state.grammarList = allGrammar;
                    state.grammarIndex = 0;
                    if (state.grammarList.length === 0) throw new Error("暂无语法内容");
                    renderGrammarCard();
                } else if (state.mode === 'pattern') {
                    const allPatterns = [];
                    if (Array.isArray(PATTERNS)) {
                        PATTERNS.forEach(p => allPatterns.push(p));
                    } else {
                        Object.keys(PATTERNS).forEach(key => {
                            const data = PATTERNS[key];
                            if (Array.isArray(data)) {
                                data.forEach(item => allPatterns.push(item));
                            } else {
                                Object.keys(data).forEach(k => allPatterns.push({title: k, ...data[k]}));
                            }
                        });
                    }
                    state.patternList = allPatterns;
                    if (state.patternList.length === 0) throw new Error("暂无规律内容");
                    renderGlobalPatternMode();
                }
            } catch (e) {
                app.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p>${e.message}</p><button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; border-radius:50px; border:none; background:var(--primary); color:white;">返回</button></div>`;
            }
        }, 150);
    }

    function renderWordCard() {
        const app = $('#app');
        const word = state.words[state.currentIndex];
        const etym = getVal(word, 'origin') || getVal(word, 'etymology');
        const etymHtml = etym ? `<div class="etymology-box"><span class="etym-label">🌱 词源探秘</span><div class="etym-content">${etym}</div></div>` : '';
        app.innerHTML = `
            <div class="wrap">
                <div class="content-pane">
                    <div class="card word-card">
                        <div style="display:flex;justify-content:space-between;padding:10px 20px;color:var(--text-sub);font-size:14px;">
                            <span id="btn-unit-back" style="cursor:pointer;">${state.currentUnit} ⬅</span>
                            <span>${state.currentIndex + 1} / ${state.words.length}</span>
                        </div>
                        <div style="text-align:center;padding:20px;">
                            <span class="w">${getVal(word, 'word')}</span>
                            <span class="p">${getVal(word, 'phonetic')}</span>
                            <div style="height:1px;background:#eee;margin:20px 0;"></div>
                            <span class="m">${getVal(word, 'meaning')}</span>
                            ${etymHtml}
                            <div class="example" style="margin-top:20px;">${getVal(word, 'example')}</div>
                        </div>
                        <div style="display:flex;justify-content:space-around;padding:30px 20px;">
                            <button class="ctrl-btn" id="btn-prev">上一个</button>
                            <button class="ctrl-btn" id="btn-next">下一个</button>
                        </div>
                    </div>
                </div>
            </div>`;
        $('#btn-unit-back').onclick = renderModeSelector;
        $('#btn-prev').onclick = () => { if(state.currentIndex > 0) { state.currentIndex--; renderWordCard(); } };
        $('#btn-next').onclick = () => { if(state.currentIndex < state.words.length - 1) { state.currentIndex++; renderWordCard(); } };
    }

    function renderGrammarCard() {
        const app = $('#app');
        const item = state.grammarList[state.grammarIndex];
        app.innerHTML = `
            <div class="wrap">
                <div class="content-pane">
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;padding:10px 20px;color:var(--text-sub);font-size:14px;">
                            <span id="btn-gram-back" style="cursor:pointer;">⬅ 返回菜单</span>
                            <span>${state.grammarIndex + 1} / ${state.grammarList.length}</span>
                        </div>
                        <div style="padding:20px;">
                            <h2 style="color:var(--primary);margin-bottom:20px;text-align:center;">${item.title || "语法点"}</h2>
                            <div style="min-height:200px;">${formatGrammarContent(item)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-around;padding:30px 20px;">
                            <button class="ctrl-btn" id="btn-prev">上一个</button>
                            <button class="ctrl-btn" id="btn-next">下一个</button>
                        </div>
                    </div>
                </div>
            </div>`;
        $('#btn-gram-back').onclick = renderMenu;
        $('#btn-prev').onclick = () => { if(state.grammarIndex > 0) { state.grammarIndex--; renderGrammarCard(); } };
        $('#btn-next').onclick = () => { if(state.grammarIndex < state.grammarList.length - 1) { state.grammarIndex++; renderGrammarCard(); } };
    }

    function renderGlobalPatternMode() {
        const app = $('#app');
        app.innerHTML = `
            <div class="wrap">
                <div class="hd"><div class="hd-t"><button id="btn-pattern-back" style="background:none; border:none; color:var(--primary); font-weight:700; font-size:14px; cursor:pointer;">⬅ 返回菜单</span><span style="font-size:22px; font-weight:700;">规律学习 (全书)</span></div></div>
                <div id="pattern-list-container" style="margin-top:20px;"></div>
            </div>`;
        $('#btn-pattern-back').onclick = renderMenu;
        const container = $('#pattern-list-container');
        const groups = {};
        state.patternList.forEach(p => {
            const type = (p.type || '其他').toUpperCase();
            if (!groups[type]) groups[type] = [];
            groups[type].push(p);
        });
        Object.keys(groups).sort().forEach(type => {
            const groupDiv = document.createElement('div');
            groupDiv.innerHTML = `<h3 style="font-size:18px;color:var(--primary);border-left:4px solid var(--primary);padding-left:10px;margin:25px 0 15px 0;">${type}</h3>`;
            const grid = document.createElement('div'); grid.style = "display:grid;grid-template-columns:1fr 1fr;gap:12px;";
            groups[type].forEach(p => {
                const card = document.createElement('button'); card.className = 'sel-btn'; card.style = "aspect-ratio:1/1; font-size:14px; font-weight:700; padding:10px; line-height:1.2;";
                const displayTitle = p.title || p.name || "未知规律";
                card.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;">${displayTitle}</div>`;
                card.onclick = () => runPatternMatch(p);
                grid.appendChild(card);
            });
            groupDiv.appendChild(grid); container.appendChild(groupDiv);
        });
    }

    function runPatternMatch(pattern) {
        const app = $('#app');
        app.innerHTML = `
            <div class="wrap">
                <div class="content-pane">
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;padding:10px 20px;color:var(--text-sub);font-size:14px;"><span id="btn-pm-back" style="cursor:pointer;">⬅ 返回列表</span></div>
                        <div style="padding:20px;text-align:center;"><h3 style="color:var(--primary);margin-bottom:20px;">匹配: ${pattern.title || pattern.name || pattern.id}</h3><div id="results-list" style="max-height:50vh;overflow-y:auto;text-align:left;padding-right:5px;"></div></div>
                    </div>
                </div>
            </div>`;
        $('#btn-pm-back').onclick = renderGlobalPatternMode;
        const resultsDiv = $('#results-list');
        const val = (pattern.pattern || pattern.value || "").toLowerCase();
        let count = 0;
        const allWords = flattenData(WORDS);
        allWords.forEach(w => {
            const txt = getVal(w, 'word').toLowerCase();
            let m = false;
            const type = (pattern.type || "").toLowerCase();
            if (type === 'suffix' && txt.endsWith(val)) m = true;
            else if (type === 'prefix' && txt.startsWith(val)) m = true;
            else if (type === 'includes' && txt.includes(val)) m = true;
            else if (type === 'exact' && txt === val) m = true;
            else if (type === 'phrase' && txt === val) m = true;
            if (m) {
                count++;
                const el = document.createElement('div'); el.style = 'padding:12px;border-bottom:1px solid #eee;';
                el.innerHTML = `<strong style="font-size:1.1rem;">${getVal(w, 'word')}</strong> <span style="color:#888;margin-left:8px;">${getVal(w, 'meaning')}</span>`;
                resultsDiv.appendChild(el);
            }
        });
        if (count === 0) resultsDiv.innerHTML = '<p style="text-align:center;color:#aaa;margin-top:30px;">未找到匹配项</p>';
    }

    function init() {
        if (typeof WORDS === 'undefined' || typeof GRAMMAR === 'undefined' || typeof PATTERNS === 'undefined') { setTimeout(init, 200); return; }
        renderMenu();
    }
    init();
})();