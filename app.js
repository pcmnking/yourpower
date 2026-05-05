// 1. 核心數據定義
const ELEMENT_MAP = { '金': 'metal', '木': 'wood', '水': 'water', '火': 'fire', '土': 'earth' };
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CLASHES = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
const HARMS = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
const COMBOS = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };

// 2. 十神運算引擎
const STEM_INFO = {
    '甲': { e: '木', p: '陽' }, '乙': { e: '木', p: '陰' },
    '丙': { e: '火', p: '陽' }, '丁': { e: '火', p: '陰' },
    '戊': { e: '土', p: '陽' }, '己': { e: '土', p: '陰' },
    '庚': { e: '金', p: '陽' }, '辛': { e: '金', p: '陰' },
    '壬': { e: '水', p: '陽' }, '癸': { e: '水', p: '陰' }
};

function getTenGod(target, dm) {
    const t = STEM_INFO[target], d = STEM_INFO[dm];
    if (!t || !d) return '-';
    const sameP = (t.p === d.p);
    const e1 = d.e, e2 = t.e;
    if (e1 === e2) return sameP ? '比肩' : '劫財';
    if (isProduce(e1, e2)) return sameP ? '食神' : '傷官';
    if (isProduce(e2, e1)) return sameP ? '偏印' : '正印';
    if (isControl(e1, e2)) return sameP ? '偏財' : '正財';
    if (isControl(e2, e1)) return sameP ? '七殺' : '正官';
    return '-';
}
function isProduce(a, b) { return { '木':'火','火':'土','土':'金','金':'水','水':'木' }[a] === b; }
function isControl(a, b) { return { '木':'土','土':'水','水':'火','火':'金','金':'木' }[a] === b; }

// 3. 象意資料庫
const XIANG_YI = {
    '比肩': { 'year': '祖上平庸，需自力更生。', 'month': '自我意識強，不喜束縛。', 'day': '配偶強勢，夫妻如友。', 'hour': '子女獨立，晚年忙碌。' },
    '劫財': { 'year': '祖產易耗，早年波折。', 'month': '大方好客，競爭壓力大。', 'day': '婚姻防外擾，注意財務。', 'hour': '晚年花費大，需理財。' },
    '食神': { 'year': '童年無憂，有福氣。', 'month': '事業平順，才華發揮。', 'day': '配偶賢惠，家庭和諧。', 'hour': '子女孝順，晚年悠閒。' },
    '傷官': { 'year': '祖輩多才，早年叛逆。', 'month': '創意多，易得罪上司。', 'day': '配偶挑剔，感情磨合。', 'hour': '子女聰明，晚年操心。' },
    '正財': { 'year': '祖上有財，早年穩定。', 'month': '工作踏實，家庭觀念強。', 'day': '配偶理財，經濟穩固。', 'hour': '晚年安逸，子女有成。' },
    '偏財': { 'year': '祖輩經商，意外獲益。', 'month': '人緣佳，財源廣。', 'day': '配偶大方，婚姻精彩。', 'hour': '財源不斷，子女有才。' },
    '正官': { 'year': '祖上有官，教育嚴格。', 'month': '事業順遂，重視名聲。', 'day': '配偶端莊，婚姻穩定。', 'hour': '子女優秀，晚年受尊。' },
    '七殺': { 'year': '祖上威嚴，早年壓力大。', 'month': '敢拼敢闖，防小人。', 'day': '配偶急躁，多挑戰。', 'hour': '子女果斷，注意健康。' },
    '正印': { 'year': '文化底蘊，長輩緣深。', 'month': '貴人相助，適合研究。', 'day': '配偶體體貼，長輩呵護。', 'hour': '子女好學，晚年平穩。' },
    '偏印': { 'year': '獨特才華，童年敏感。', 'month': '思維獨特，易孤獨。', 'day': '配偶特立獨行，需耐心。', 'hour': '子女獨特，生活獨立。' }
};

const INTERACTION_TEXT = {
    '沖': '代表變動、對立、衝突。人生易有突如其來的改變。',
    '害': '代表牽絆、暗中損害。付出多回報少。',
    '合': '代表和諧、吸引、凝聚。易得人助，但也代表牽制。',
    '刑': '代表磨擦、是非、心理矛盾或外界阻礙。',
    '自刑': '代表自我矛盾、內耗、鑽牛角尖。'
};

const DEFICIENCY_NOTES = {
    '正財': '理財較隨緣。', '偏財': '意外財源少。', '正官': '不喜束縛。', '七殺': '缺乏魄力。',
    '正印': '安全感薄弱。', '偏印': '思維大眾化。', '食神': '生活情趣少。', '傷官': '缺乏冒險。',
    '比肩': '社交圈小。', '劫財': '競爭意識薄。'
};

// --- 運勢十神象意資料庫 ---
const LUCK_XIANG_YI = {
    '比肩': '主社交、同輩競爭。利於擴展人脈，但需防開支增加或與人爭執。',
    '劫財': '主財源變動、競爭。需嚴防投機行為及意外破財，保持低調為宜。',
    '食神': '主福氣、才華、口福。利於創意發揮、旅遊或創業，心境較為悠閒。',
    '傷官': '主變動、創意、口舌。利於改革或展示才華，但需注意與上司或長輩的關係。',
    '正財': '主正財、穩定、家庭。財運穩定，利於工作獲益或處理家庭事務。',
    '偏財': '主橫財、投機、機遇。財運起伏較大，利於經商或投資，但需見好就收。',
    '正官': '主事業、名聲、責任。利於職位晉升、考學或公職，但壓力較大。',
    '七殺': '主挑戰、小人、壓力。事業多競爭與阻礙，需注意身體健康與是非困擾。',
    '正印': '主貴人、學業、長輩。利於學習進修、買房或受人提拔，心靈較安穩。',
    '偏印': '主獨特才華、靈感、孤獨。利於非傳統研究，但易想太多，行動力稍弱。'
};

// --- 地支轉本氣天干 (用於計算地支十神) ---
const BRANCH_TO_STEM = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙',
    '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
};

// --- 地支藏干資料庫 ---
const BRANCH_HIDE_GANS = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'],
    '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'], '午': ['丁', '己'], '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

// --- 手動輸入 Mock Bazi 物件 ---
function createManualBazi(y, m, d, h) {
    return {
        getYear: () => [y[0], y[1]],
        getMonth: () => [m[0], m[1]],
        getDay: () => [d[0], d[1]],
        getHour: () => [h[0], h[1]],
        getTime: () => [h[0], h[1]],
        getYearHideGan: () => BRANCH_HIDE_GANS[y[1]] || [],
        getMonthHideGan: () => BRANCH_HIDE_GANS[m[1]] || [],
        getDayHideGan: () => BRANCH_HIDE_GANS[d[1]] || [],
        getTimeHideGan: () => BRANCH_HIDE_GANS[h[1]] || []
    };
}

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

// 4. 全域狀態與初始化
let currentBazi = null;
let currentGender = 1;
let currentDaYunList = [];
let selectedDaYunIndex = -1;

window.onload = () => { initSelects(); };
function getElement(char) { return STEM_INFO[char]?.e || (['子','亥'].includes(char)?'水':['寅','卯'].includes(char)?'木':['巳','午'].includes(char)?'火':['申','酉'].includes(char)?'金':'土'); }
function initSelects() {
    ['y', 'm', 'd', 'h'].forEach(p => {
        const sEl = document.getElementById(`${p}Stem`), bEl = document.getElementById(`${p}Branch`);
        if (sEl && bEl) { STEMS.forEach(s => sEl.add(new Option(s, s))); BRANCHES.forEach(b => bEl.add(new Option(b, b))); }
    });
}
function switchInput(type) {
    document.getElementById('dateInput').style.display = type === 'date' ? 'grid' : 'none';
    document.getElementById('manualInput').style.display = type === 'manual' ? 'grid' : 'none';
}
function switchCardTab(type) {
    document.getElementById('elementView').style.display = type === 'element' ? 'block' : 'none';
    document.getElementById('luckView').style.display = type === 'luck' ? 'block' : 'none';
    document.querySelectorAll('.card-tab').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(type === 'element' ? '五行' : '大運'));
    });
}

function calculateByDate() {
    try {
        const d = document.getElementById('birthDate').value, t = document.getElementById('birthTime').value;
        const g = parseInt(document.getElementById('gender').value);
        if (!d || !t) return;
        const [yy, mm, dd] = d.split('-').map(Number), [hh, mi] = t.split(':').map(Number);
        const solar = Solar.fromYmdHms(yy, mm, dd, hh, mi, 0), lunar = solar.getLunar();
        currentBazi = lunar.getEightChar(); currentGender = g;
        displayResult(currentBazi);
        initLuckModule(lunar, g);
    } catch (e) { alert("運算失敗: " + e.message); }
}

function calculateByManual() {
    try {
        const y = document.getElementById('yStem').value + document.getElementById('yBranch').value;
        const m = document.getElementById('mStem').value + document.getElementById('mBranch').value;
        const d = document.getElementById('dStem').value + document.getElementById('dBranch').value;
        const h = document.getElementById('hStem').value + document.getElementById('hBranch').value;
        
        // 使用 Mock 物件替代 EightChar.fromGanZhi
        currentBazi = createManualBazi(y, m, d, h);
        
        // 清除大運數據 (手動輸入無法計算大運)
        currentDaYunList = [];
        document.getElementById('dayunList').innerHTML = '<p style="font-size:0.8rem; color:var(--text-secondary); padding:10px;">手動輸入不支援大運計算</p>';
        document.getElementById('liunianList').innerHTML = '';
        document.getElementById('liuyueList').innerHTML = '';
        document.getElementById('luckAnalysisResult').innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.5;">請使用生辰輸入以查看完整運勢分析</p>';
        
        displayResult(currentBazi);
    } catch (e) { alert("手動轉換失敗: " + e.message); }
}

function initLuckModule(lunar, gender) {
    try {
        const yun = lunar.getEightChar().getYun(gender);
        currentDaYunList = yun.getDaYun();
        const dm = currentBazi.getDay()[0];
        const listEl = document.getElementById('dayunList');
        const displayList = currentDaYunList.filter(dy => dy.getStartAge() > 0).slice(0, 8);
        listEl.innerHTML = displayList.map((dy, i) => {
            const gz = dy.getGanZhi();
            const tg = getTenGod(gz[0], dm);
            return `<div class="luck-item" onclick="selectDaYun(${i})">${gz} <small>[${tg}]</small><span>${dy.getStartAge()}歲起</span></div>`;
        }).join('');
        currentDaYunList = displayList;
        selectDaYun(0);
    } catch (e) { alert("運勢模組載入錯誤: " + e.message); }
}

function selectDaYun(index) {
    selectedDaYunIndex = index;
    document.querySelectorAll('#dayunList .luck-item').forEach((item, i) => item.classList.toggle('active', i === index));
    const dy = currentDaYunList[index];
    const lnList = dy.getLiuNian();
    const dm = currentBazi.getDay()[0];
    document.getElementById('liunianList').innerHTML = lnList.map(ln => {
        const gz = ln.getGanZhi();
        const tg = getTenGod(gz[0], dm);
        return `<div class="luck-item" onclick="selectLiuNian(${ln.getYear()}, '${gz[0]}', '${gz[1]}')">${gz} <small>[${tg}]</small><span>${ln.getYear()}</span></div>`;
    }).join('');
    const firstLn = lnList[0];
    const firstGZ = firstLn.getGanZhi();
    selectLiuNian(firstLn.getYear(), firstGZ[0], firstGZ[1]);
}

function selectLiuNian(year, gan, zhi) {
    document.querySelectorAll('#liunianList .luck-item').forEach(item => item.classList.toggle('active', item.innerText.includes(year.toString())));
    const dy = currentDaYunList[selectedDaYunIndex];
    const ln = dy.getLiuNian().find(l => l.getYear() === year);
    const lyList = ln.getLiuYue();
    const dm = currentBazi.getDay()[0];
    const listEl = document.getElementById('liuyueList');
    const branchNames = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    const westernApprox = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1'];
    listEl.innerHTML = lyList.map((ly, i) => {
        const gz = ly.getGanZhi();
        const tg = getTenGod(gz[0], dm);
        const idx = ly.getIndex();
        return `<div class="luck-item" onclick="selectLiuYue(${i}, '${gz[0]}', '${gz[1]}')">${gz} <small>[${tg}]</small><span>${branchNames[idx]}月 (約${westernApprox[idx]}月)</span></div>`;
    }).join('');
    const firstLy = lyList[0];
    const firstGZ = firstLy.getGanZhi();
    window.currentSelectedLuck = { year, gan, zhi, dy };
    selectLiuYue(0, firstGZ[0], firstGZ[1]);
}

function selectLiuYue(index, mGan, mZhi) {
    document.querySelectorAll('#liuyueList .luck-item').forEach((item, i) => item.classList.toggle('active', i === index));
    const { year, gan, zhi, dy } = window.currentSelectedLuck;
    const dm = currentBazi.getDay()[0];
    const dyGZ = dy.getGanZhi();
    const dyGan = dyGZ[0], dyZhi = dyGZ[1];
    
    const luckGods = {
        dyS: getTenGod(dyGan, dm), dyB: getTenGod(BRANCH_TO_STEM[dyZhi], dm),
        lnS: getTenGod(gan, dm), lnB: getTenGod(BRANCH_TO_STEM[zhi], dm),
        lyS: getTenGod(mGan, dm), lyB: getTenGod(BRANCH_TO_STEM[mZhi], dm)
    };
    
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
                <div style="margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 8px;">
                    <p style="font-size: 0.9rem; color: var(--primary-gold); margin-bottom: 5px;"><strong>【流年重點】</strong></p>
                    <p style="font-size: 0.85rem;">天[${luckGods.lnS}]: ${LUCK_XIANG_YI[luckGods.lnS] || '當前歲月'}</p>
                    <p style="font-size: 0.85rem;">地[${luckGods.lnB}]: ${LUCK_XIANG_YI[luckGods.lnB] || '環境動盪'}</p>
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

// 6. 核心解讀與渲染
function displayResult(bazi) {
    const res = document.getElementById('resultSection'); res.style.display = 'block';
    const dm = bazi.getDay()[0];
    const call = (sfx) => {
        const h = `getHour${sfx}`, t = `getTime${sfx}`;
        return (typeof bazi[h] === 'function') ? bazi[h]() : (typeof bazi[t] === 'function' ? bazi[t]() : null);
    };
    const data = {
        pillars: [
            { id: 'year', s: bazi.getYear()[0], b: bazi.getYear()[1], h: bazi.getYearHideGan(), sg: getTenGod(bazi.getYear()[0], dm), bg: getTenGod(bazi.getYearHideGan()[0], dm) },
            { id: 'month', s: bazi.getMonth()[0], b: bazi.getMonth()[1], h: bazi.getMonthHideGan(), sg: getTenGod(bazi.getMonth()[0], dm), bg: getTenGod(bazi.getMonthHideGan()[0], dm) },
            { id: 'day', s: dm, b: bazi.getDay()[1], h: bazi.getDayHideGan(), sg: '日主', bg: getTenGod(bazi.getDayHideGan()[0], dm) },
            { id: 'hour', s: (call('')||'  ')[0], b: (call('')||'  ')[1], h: call('HideGan')||[], sg: getTenGod((call('')||'  ')[0], dm), bg: getTenGod((call('HideGan')||[])[0], dm) }
        ]
    };
    data.pillars.forEach(p => {
        const sEl = document.getElementById(`${p.id}Stem`), bEl = document.getElementById(`${p.id}Branch`), hEl = document.getElementById(`${p.id}Hidden`);
        sEl.textContent = p.s; sEl.className = `character stem ${ELEMENT_MAP[getElement(p.s)]}`;
        bEl.textContent = p.b; bEl.className = `character branch ${ELEMENT_MAP[getElement(p.b)]}`;
        hEl.innerHTML = (p.h || []).map(h => `<div class="hidden-item"><span class="${ELEMENT_MAP[getElement(h)]}">${h}</span><small>[${getTenGod(h, dm)}]</small></div>`).join('');
        if (document.getElementById(`${p.id}StemTenGod`)) document.getElementById(`${p.id}StemTenGod`).textContent = p.sg;
        if (document.getElementById(`${p.id}BranchTenGod`)) document.getElementById(`${p.id}BranchTenGod`).textContent = p.bg;
    });
    updateChart(data); generateAnalysis(data);
    window.scrollTo({ top: res.offsetTop - 50, behavior: 'smooth' });
}

function updateChart(data) {
    const ctx = document.getElementById('elementChart').getContext('2d');
    const counts = { '木':0, '火':0, '土':0, '金':0, '水':0 };
    data.pillars.forEach(p => { counts[getElement(p.s)]++; counts[getElement(p.b)]++; });
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'polarArea',
        data: { labels: ['木','火','土','金','水'], datasets: [{ data: Object.values(counts), backgroundColor: ['rgba(16,185,129,0.6)','rgba(239,68,68,0.6)','rgba(217,119,6,0.6)','rgba(203,213,225,0.6)','rgba(59,130,246,0.6)'], borderWidth: 0 }] },
        options: { responsive: true, scales: { r: { ticks: { display:false }, grid: { color: 'rgba(255,255,255,0.1)' } } } }
    });
}

function generateAnalysis(data) {
    const content = document.getElementById('interpretationContent');
    const b = data.pillars.map(p => p.b), dm = data.pillars[2].s, allG = [];
    data.pillars.forEach(p => { if (p.sg!=='日主') allG.push(p.sg); if(p.bg) allG.push(p.bg); if(p.h) p.h.forEach(h=>allG.push(getTenGod(h,dm))); });
    
    let inters = [];
    for (let i=0; i<4; i++) { for (let j=i+1; j<4; j++) { const r = checkBranchRelation(b[i],b[j],['年','月','日','時'][i],['年','月','日','時'][j]); if(r) inters.push(...r); } }
    const missing = ['正財','偏財','正官','七殺','正印','偏印','食神','傷官','比肩','劫財'].filter(g => !allG.includes(g));
    const counts = {}; allG.forEach(g => counts[g] = (counts[g]||0)+1);
    const extremes = Object.keys(counts).filter(g => counts[g] >= 3);

    let html = `<div class="analysis-section"><h3 class="section-title">🌟 實務派核心診斷</h3></div>
        <div class="analysis-section"><h4 class="sub-title">第一步：地支動態</h4><div class="remedy-box">${inters.length>0 ? inters.map(it=>`<div style="margin-bottom:8px;"><span class="${it.type==='合'?'success':'danger'}">${it.tag}</span><p style="font-size:0.8rem;color:#cbd5e1;">${INTERACTION_TEXT[it.type]}</p></div>`).join('') : '<p>地支氣場平穩。</p>'}</div></div>
        <div class="analysis-section"><h4 class="sub-title">第二步：缺失論</h4><ul>${missing.slice(0,3).map(m=>`<li><strong>缺${m}：</strong>${DEFICIENCY_NOTES[m]||'特質平淡。'}</li>`).join('')}</ul></div>
        <div class="analysis-section"><h4 class="sub-title">第三步：極星非極</h4><p>${extremes.length>0 ? `<span class="danger">${extremes[0]}</span>過旺。` : '能量溫和。'}</p></div>
        <div class="analysis-section" style="border-top:1px dashed rgba(255,255,255,0.1);padding-top:1rem;margin-top:2rem;"><h3 class="section-title">📋 柱位詳解</h3></div>`;
    
    data.pillars.forEach(p => { html += `<div class="analysis-section"><h4 class="sub-title">${['年','月','日','時'][data.pillars.indexOf(p)]}柱</h4><div class="pillar-analysis"><p><strong>天干 (${p.sg})：</strong>${XIANG_YI[p.sg]?.[p.id]||'能量穩定。'}</p><p><strong>地支 (${p.bg})：</strong>${XIANG_YI[p.bg]?.[p.id]||'內在環境。'}</p></div></div>`; });
    content.innerHTML = html;
}
