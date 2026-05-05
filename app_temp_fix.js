
// --- 行動能量資料庫 (由筆記整合) ---
const ACTION_ENERGY_RULES = [
    { id: '食神剋官', n: '挑戰傳統型', d: '具備獨特視角，喜歡挑戰僵化制度。行動上需有專業實力支撐，否則易流於挑剔。', check: (g) => g.includes('食神') && (g.includes('正官') || g.includes('七殺')) },
    { id: '財剋印', n: '渴求關注型', d: '內心缺乏安定感，會以積極熱情向外索求保護與關注。需防範因暴露弱點而受騙。', check: (g) => (g.includes('正財') || g.includes('偏財')) && (g.includes('正印') || g.includes('偏印')) },
    { id: '比劫剋財', n: '慷慨分享型', d: '重情重義，將人際關係看得比金錢重要。樂於分享資源，但需分清真心與面子。', check: (g) => (g.includes('比肩') || g.includes('劫財')) && (g.includes('正財') || g.includes('偏財')) },
    { id: '印生比劫', n: '溫和配合型', d: '態度柔和體貼，願意為了和諧而放下主觀意識配合他人。重視朋友但有守財意識。', check: (g) => (g.includes('正印') || g.includes('偏印')) && (g.includes('比肩') || g.includes('劫財')) },
    { id: '印剋食傷', n: '過度理性型', d: '行動過度謹慎，做事較慢且易自我壓抑。因過度理性易招惹小人，需放鬆心態。', check: (g) => (g.includes('正印') || g.includes('偏印')) && (g.includes('食神') || g.includes('傷官')) },
    { id: '食傷生財', n: '追求認同型', d: '強烈的表達慾望，積極傳達理念以獲得大眾目光與崇拜。非常願意配合環境需求。', check: (g) => (g.includes('食神') || g.includes('傷官')) && (g.includes('正財') || g.includes('偏財')) },
    { id: '官殺制比劫', n: '爭強好勝型', d: '在意外界看法，行動上帶有強烈的競爭意識，傾向於在同儕中脫穎而出或超越他人。', check: (g) => (g.includes('正官') || g.includes('七殺')) && (g.includes('比肩') || g.includes('劫財')) },
    { id: '傷官洩秀', n: '追求自由型', d: '思路清晰且內在底蘊深厚。討厭受權威壓迫，渴望在無壓力的環境下自由發揮。', check: (g) => g.includes('傷官') && g.filter(x => x === '傷官').length >= 1 }
];

function selectLiuYue(index, mGan, mZhi) {
    document.querySelectorAll('#liuyueList .luck-item').forEach((item, i) => item.classList.toggle('active', i === index));
    const { year, gan, zhi, dy } = window.currentSelectedLuck;
    const dm = currentBazi.getDay()[0];
    const dyGZ = dy.getGanZhi();
    const dyGan = dyGZ[0], dyZhi = dyGZ[1];
    
    // 計算三柱十神
    const luckGods = {
        dyS: getTenGod(dyGan, dm), dyB: getTenGod(BRANCH_TO_STEM[dyZhi], dm),
        lnS: getTenGod(gan, dm), lnB: getTenGod(BRANCH_TO_STEM[zhi], dm),
        lyS: getTenGod(mGan, dm), lyB: getTenGod(BRANCH_TO_STEM[mZhi], dm)
    };
    
    // 行動能量偵測
    const b = currentBazi;
    const originalGods = [];
    [b.getYear(), b.getMonth(), b.getDay(), (typeof b.getHour==='function'?b.getHour():b.getTime())].forEach(p => {
        originalGods.push(getTenGod(p[0], dm));
        originalGods.push(getTenGod(BRANCH_TO_STEM[p[1]], dm));
    });
    const currentActiveGods = [...originalGods, luckGods.dyS, luckGods.dyB, luckGods.lnS, luckGods.lnB, luckGods.lyS, luckGods.lyB];
    
    const activeEnergies = ACTION_ENERGY_RULES.filter(rule => rule.check(currentActiveGods)).map(rule => {
        const triggers = currentActiveGods.filter(g => rule.id.includes(g.substring(0,2)) || rule.id.includes(g));
        return { ...rule, triggers: [...new Set(triggers)].join('、') };
    });

    // 計算三柱互動 (修正重疊標籤問題)
    const call = (sfx) => {
        const h = `getHour${sfx}`, t = `getTime${sfx}`;
        return (typeof b[h] === 'function') ? b[h]() : (typeof b[t] === 'function' ? b[t]() : null);
    };
    const pillars = [ { n: '年', b: b.getYear()[1] }, { n: '月', b: b.getMonth()[1] }, { n: '日', b: b.getDay()[1] }, { n: '時', b: (call('')||'  ')[1] } ];

    let rawInters = [];
    pillars.forEach(p => {
        const dR = checkBranchRelation(dyZhi, p.b, `大運`, p.n); if (dR) rawInters.push(...dR);
        const lR = checkBranchRelation(zhi, p.b, `流年`, p.n); if (lR) rawInters.push(...lR);
        const mR = checkBranchRelation(mZhi, p.b, `流月`, p.n); if (mR) rawInters.push(...mR);
    });

    const luckInters = [];
    const seen = new Set();
    rawInters.forEach(item => {
        if (!seen.has(item.tag)) {
            luckInters.push(item);
            seen.add(item.tag);
        }
    });
    
    document.getElementById('luckAnalysisResult').innerHTML = `
        <div class="luck-pillar-display" style="gap: 10px;">
            <div class="luck-pillar-item" style="flex: 1;"><div class="p-label">大運</div><div class="ten-god" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.dyS}</div><div class="character stem ${ELEMENT_MAP[getElement(dyGan)]}">${dyGan}</div><div class="character branch ${ELEMENT_MAP[getElement(dyZhi)]}">${dyZhi}</div><div class="ten-god" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.dyB}</div></div>
            <div class="luck-pillar-item" style="flex: 1;"><div class="p-label">流年</div><div class="ten-god" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lnS}</div><div class="character stem ${ELEMENT_MAP[getElement(gan)]}">${gan}</div><div class="character branch ${ELEMENT_MAP[getElement(zhi)]}">${zhi}</div><div class="ten-god" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lnB}</div></div>
            <div class="luck-pillar-item" style="flex: 1;"><div class="p-label">流月</div><div class="ten-god" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lyS}</div><div class="character stem ${ELEMENT_MAP[getElement(mGan)]}">${mGan}</div><div class="character branch ${ELEMENT_MAP[getElement(mZhi)]}">${mZhi}</div><div class="ten-god" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lyB}</div></div>
        </div>
        
        <div class="analysis-section">
            <h4 class="sub-title">⚡ 運勢行為慣性 (行動能量)</h4>
            <div class="remedy-box" style="margin-bottom: 1.5rem; padding: 1rem;">
                ${activeEnergies.length > 0 
                    ? activeEnergies.slice(0, 2).map(e => `
                        <div style="margin-bottom:12px;">
                            <strong>【${e.n}】</strong>
                            <small style="color:var(--primary-gold); display:block; margin-top:2px;">(觸發原因：${e.id} - 偵測到 ${e.triggers})</small>
                            <p style="font-size:0.8rem; margin-top:5px; opacity:0.9;">${e.d}</p>
                        </div>
                    `).join('')
                    : '<p>當前行為模式較為中性平穩。</p>'}
            </div>

            <h4 class="sub-title">🔮 運勢與原局互動 (三柱聯動)</h4>
            <div class="remedy-box" style="padding: 1rem;">
                ${luckInters.length > 0 
                    ? luckInters.map(it => `
                        <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                            <span class="${it.type === '合' ? 'success' : 'danger'}" style="font-weight:600;">${it.tag}</span>
                            <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">${INTERACTION_TEXT[it.type]}</p>
                        </div>
                    `).join('')
                    : '<p>當前氣場交感平穩。</p>'}
            </div>

            <h4 class="sub-title" style="margin-top:1.5rem;">📑 運勢核心提醒</h4>
            <div class="remedy-box" style="padding: 1rem;">
                <div style="margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 8px;">
                    <p style="font-size: 0.9rem; color: var(--primary-gold); margin-bottom: 5px;"><strong>【大運週期】</strong></p>
                    <p style="font-size: 0.85rem;">天[${luckGods.dyS}]: ${LUCK_XIANG_YI[luckGods.dyS] || '穩定'}</p>
                    <p style="font-size: 0.85rem;">地[${luckGods.dyB}]: ${LUCK_XIANG_YI[luckGods.dyB] || '根基'}</p>
                </div>
                <div>
                    <p style="font-size: 0.9rem; color: var(--primary-gold); margin-bottom: 5px;"><strong>【流月重點】</strong></p>
                    <p style="font-size: 0.85rem;">天[${luckGods.lyS}]: ${LUCK_XIANG_YI[luckGods.lyS] || '當月'}</p>
                    <p style="font-size: 0.85rem;">地[${luckGods.lyB}]: ${LUCK_XIANG_YI[luckGods.lyB] || '心理'}</p>
                </div>
            </div>
        </div>
    `;
}

function checkBranchRelation(b1, b2, n1, n2) {
    const l = `${n1}[${b1}] 與 ${n2}[${b2}]`, res = [];
    if (CLASHES[b1] === b2) res.push({ tag: `${l} 相沖`, type: '沖' });
    if (HARMS[b1] === b2) res.push({ tag: `${l} 相害`, type: '害' });
    if (COMBOS[b1] === b2) res.push({ tag: `${l} 相合`, type: '合' });
    if ((b1==='子'&&b2==='卯')||(b1==='卯' && b2==='子')) res.push({ tag: `${l} 相刑`, type: '刑' });
    if (['寅','巳','申'].includes(b1)&&['寅','巳','申'].includes(b2)&&b1!==b2) res.push({ tag: `${l} 相刑`, type: '刑' });
    if (['丑','戌','未'].includes(b1)&&['丑','戌','未'].includes(b2)&&b1!==b2) res.push({ tag: `${l} 相刑`, type: '刑' });
    return res.length > 0 ? res : null;
}
